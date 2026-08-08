const crypto = require("crypto");
const QRCode = require("qrcode");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const {
  DEFAULT_ALLOWED_RADIUS_METERS,
} = require("../utils/distance");

/**
 * ============================================
 * GET MY ACTIVE ATTENDANCE SESSION
 * ============================================
 *
 * Used when teacher refreshes dashboard.
 *
 * It finds the teacher's currently active session
 * and generates the QR image again from the saved
 * qrToken.
 */
const getMyActiveSession = asyncHandler(async (req, res) => {
  // Find logged-in teacher profile
  const teacher = await prisma.teacherProfile.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher profile not found.",
    });
  }

  // Find active attendance session for this teacher
  const session = await prisma.attendanceSession.findFirst({
    where: {
      status: "ACTIVE",

      teacherAssignment: {
        teacherId: teacher.userId,
      },
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

    orderBy: {
      createdAt: "desc",
    },
  });

  // No active session
  if (!session) {
    return res.json({
      session: null,
      qrCode: null,
    });
  }

  // Generate QR image again using saved token
  const qrCode = await QRCode.toDataURL(session.qrToken);

  return res.json({
    session,
    qrCode,
  });
});

/**
 * ============================================
 * START ATTENDANCE SESSION
 * ============================================
 */
const startAttendanceSession = asyncHandler(async (req, res) => {
  const {
    teacherAssignmentId,
    latitude,
    longitude,
    allowedRadiusMeters,
  } = req.body;

  if (!teacherAssignmentId) {
    return res.status(400).json({
      message: "Teacher assignment ID is required.",
    });
  }

  // Teacher location is required so students can be verified
  // to be within range of the teacher when they scan.
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({
      message:
        "Teacher location is required to start an attendance session. Please allow location access and try again.",
    });
  }

  // Optional per-session radius chosen by the teacher. Defaults to
  // DEFAULT_ALLOWED_RADIUS_METERS when not provided.
  let radius = DEFAULT_ALLOWED_RADIUS_METERS;

  if (allowedRadiusMeters !== undefined && allowedRadiusMeters !== null) {
    const parsedRadius = Number(allowedRadiusMeters);

    if (
      !Number.isInteger(parsedRadius) ||
      parsedRadius <= 0 ||
      parsedRadius > 10000
    ) {
      return res.status(400).json({
        message:
          "Allowed radius must be a positive number of meters (max 10000).",
      });
    }

    radius = parsedRadius;
  }

  // Find assignment
  const assignment = await prisma.teacherAssignment.findUnique({
    where: {
      id: teacherAssignmentId,
    },

    include: {
      teacher: {
        include: {
          user: true,
        },
      },
      subject: true,
      section: true,
    },
  });

  if (!assignment) {
    return res.status(404).json({
      message: "Teacher assignment not found.",
    });
  }

  // Make sure logged-in teacher owns this assignment
  if (assignment.teacherId !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to use this assignment.",
    });
  }

  // Check if active session already exists
  const existingSession =
    await prisma.attendanceSession.findFirst({
      where: {
        teacherAssignmentId,
        status: "ACTIVE",
      },
    });

  if (existingSession) {
    return res.status(400).json({
      message: "An attendance session is already active.",
    });
  }

  // Generate secure QR token
  const qrToken = crypto
    .randomBytes(32)
    .toString("hex");

  // Generate QR image
  const qrImage = await QRCode.toDataURL(qrToken);

  // Create attendance session
  const session =
    await prisma.attendanceSession.create({
      data: {
        teacherAssignmentId,
        qrToken,
        startTime: new Date(),
        status: "ACTIVE",
        teacherLatitude: latitude,
        teacherLongitude: longitude,
        allowedRadiusMeters: radius,
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

  return res.status(201).json({
    message:
      "Attendance session started successfully.",

    session,

    qrCode: qrImage,
  });
});

/**
 * ============================================
 * END ATTENDANCE SESSION
 * ============================================
 */
const endAttendanceSession = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    // Find session
    const session =
      await prisma.attendanceSession.findUnique({
        where: {
          id,
        },

        include: {
          teacherAssignment: true,
        },
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Attendance session not found.",
      });
    }

    // Check teacher ownership
    if (
      session.teacherAssignment.teacherId !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to end this session.",
      });
    }

    // Check already closed
    if (session.status === "CLOSED") {
      return res.status(400).json({
        message:
          "Attendance session already closed.",
      });
    }

    // Close session
    const updatedSession =
      await prisma.attendanceSession.update({
        where: {
          id,
        },

        data: {
          status: "CLOSED",
          endTime: new Date(),
        },
      });

    return res.json({
      message:
        "Attendance session ended successfully.",

      session: updatedSession,
    });
  }
);

/**
 * ============================================
 * GET ALL ATTENDANCE SESSIONS
 * ============================================
 */
const getAttendanceSessions = asyncHandler(
  async (req, res) => {
    const sessions =
      await prisma.attendanceSession.findMany({
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

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(sessions);
  }
);

/**
 * Get QR Code for an existing attendance session
 */
const getSessionQRCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the session
  const session = await prisma.attendanceSession.findUnique({
    where: {
      id,
    },
    include: {
      teacherAssignment: {
        include: {
          subject: true,
          section: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return res.status(404).json({
      message: "Attendance session not found.",
    });
  }

  // Check session is still active
  if (session.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Attendance session is no longer active.",
    });
  }

  // Generate QR image from stored QR token
  const qrCode = await QRCode.toDataURL(
    session.qrToken
  );

  res.json({
    session,
    qrCode,
  });
});

module.exports = {
  startAttendanceSession,
  endAttendanceSession,
  getMyActiveSession,
  getAttendanceSessions,
  getSessionQRCode,
};