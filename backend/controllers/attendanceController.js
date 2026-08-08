const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const {
  DEFAULT_ALLOWED_RADIUS_METERS,
  haversineDistance,
} = require("../utils/distance");

/**
 * Student Scan QR
 */
const scanAttendance = asyncHandler(async (req, res) => {
  const { qrToken, latitude, longitude } = req.body;

  // Get logged-in student
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!student) {
    return res.status(404).json({
      message: "Student profile not found.",
    });
  }

  // Find active attendance session
  const session = await prisma.attendanceSession.findFirst({
    where: {
      qrToken,
      status: "ACTIVE",
    },
    include: {
      teacherAssignment: true,
    },
  });

  if (!session) {
    return res.status(400).json({
      message: "Invalid or expired QR Code.",
    });
  }

  // ============================================
  // GPS PROXIMITY CHECK
  // ============================================

  // Student location is required to verify they are
  // physically present in the class.
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({
      message:
        "Your location is required to mark attendance. Please allow location access and try again.",
    });
  }

  // Session must carry the teacher's location (set when
  // the session was started).
  if (
    session.teacherLatitude === null ||
    session.teacherLongitude === null
  ) {
    return res.status(400).json({
      message:
        "This session has no teacher location set. Please ask your teacher to end and restart the session.",
    });
  }

  // Distance between the student and the teacher in meters.
  const distanceMeters = haversineDistance(
    session.teacherLatitude,
    session.teacherLongitude,
    latitude,
    longitude
  );

  // Per-session radius chosen by the teacher when starting the
  // session (schema default 20 if not set).
  const allowedRadiusMeters =
    session.allowedRadiusMeters ??
    DEFAULT_ALLOWED_RADIUS_METERS;

  // Reject scans from students outside the allowed radius.
  if (distanceMeters > allowedRadiusMeters) {
    return res.status(403).json({
      message:
        "You are not in the class. You must be within " +
        `${allowedRadiusMeters} meters of the teacher to mark attendance.`,
      distanceMeters: Math.round(distanceMeters),
    });
  }

  // Check student belongs to session section
  if (
    student.sectionId !==
    session.teacherAssignment.sectionId
  ) {
    return res.status(403).json({
      message: "You are not enrolled in this section.",
    });
  }

  // Check duplicate attendance
  const existingAttendance =
    await prisma.attendance.findUnique({
      where: {
        attendanceSessionId_studentId: {
          attendanceSessionId: session.id,
          studentId: student.userId,
        },
      },
    });

  if (existingAttendance) {
    return res.status(400).json({
      message: "Attendance already marked.",
    });
  }

  // Mark attendance
  const attendance = await prisma.attendance.create({
    data: {
      attendanceSessionId: session.id,
      studentId: student.userId,
      status: "PRESENT",
      method: "QR",
      studentLatitude: latitude,
      studentLongitude: longitude,
      distanceMeters: Math.round(distanceMeters * 100) / 100,
    },
  });

  res.status(201).json({
    message: "Attendance marked successfully.",
    attendance,
  });
});

/**
 * Mark Manual Attendance
 */
const markManualAttendance = asyncHandler(
  async (req, res) => {
    const {
      attendanceSessionId,
      studentId,
      status,
      remarks,
    } = req.body;

    // Check required fields
    if (
      !attendanceSessionId ||
      !studentId ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Attendance session ID, student ID and status are required.",
      });
    }

    // Valid attendance statuses
    const validStatuses = [
      "PRESENT",
      "ABSENT",
      "LATE",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status.",
      });
    }

    // Find attendance session
    const session =
      await prisma.attendanceSession.findUnique({
        where: {
          id: attendanceSessionId,
        },
        include: {
          teacherAssignment: true,
        },
      });

    if (!session) {
      return res.status(404).json({
        message: "Attendance session not found.",
      });
    }

    // Check session status
    if (session.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Attendance session is not active.",
      });
    }

    // Find student
    const student =
      await prisma.studentProfile.findUnique({
        where: {
          userId: studentId,
        },
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    // Check student belongs to section
    if (
      student.sectionId !==
      session.teacherAssignment.sectionId
    ) {
      return res.status(403).json({
        message:
          "Student does not belong to this section.",
      });
    }

    // Check duplicate attendance
    const existingAttendance =
      await prisma.attendance.findUnique({
        where: {
          attendanceSessionId_studentId: {
            attendanceSessionId,
            studentId,
          },
        },
      });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "Attendance already marked for this student.",
      });
    }

    // Create attendance
    const attendance =
      await prisma.attendance.create({
        data: {
          attendanceSessionId,
          studentId,
          status,
          method: "MANUAL",
          remarks: remarks || null,
        },
      });

    res.status(201).json({
      message: "Attendance marked successfully.",
      attendance,
    });
  }
);

/**
 * Get Attendance Records for a Session
 */
const getSessionAttendance = asyncHandler(
  async (req, res) => {
    const { sessionId } = req.params;

    // Find session
    const session =
      await prisma.attendanceSession.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          teacherAssignment: {
            include: {
              teacher: {
                include: {
                  user: true,
                },
              },
              subject: true,
              section: true,
            },
          },
        },
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Attendance session not found.",
      });
    }

    // Get attendance records
    const attendances =
      await prisma.attendance.findMany({
        where: {
          attendanceSessionId: sessionId,
        },
        include: {
          student: {
            include: {
              user: true,
              program: true,
              section: true,
            },
          },
        },
        orderBy: {
          scanTime: "asc",
        },
      });

    res.json({
      session,
      total: attendances.length,
      attendances,
    });
  }
);

/**
 * Get Logged-in Student Attendance History
 */
const getMyAttendance = asyncHandler(
  async (req, res) => {
    // Get logged-in student's profile
    const student =
      await prisma.studentProfile.findUnique({
        where: {
          userId: req.user.id,
        },
      });

    if (!student) {
      return res.status(404).json({
        message:
          "Student profile not found.",
      });
    }

    // Get student's attendance records
    const attendances =
      await prisma.attendance.findMany({
        where: {
          studentId: student.userId,
        },
        include: {
          attendanceSession: {
            include: {
              teacherAssignment: {
                include: {
                  teacher: {
                    include: {
                      user: true,
                    },
                  },
                  subject: true,
                  section: true,
                },
              },
            },
          },
        },
        orderBy: {
          scanTime: "desc",
        },
      });

    res.json({
      total: attendances.length,
      attendances,
    });
  }
);

module.exports = {
  scanAttendance,
  markManualAttendance,
  getSessionAttendance,
  getMyAttendance,
};