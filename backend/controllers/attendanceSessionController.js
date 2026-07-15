const crypto = require("crypto");
const QRCode = require("qrcode");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");


/**
 * Start Attendance Session
 */
const startAttendanceSession = asyncHandler(async (req, res) => {
  const { teacherAssignmentId } = req.body;

  // Check Assignment
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

  // Check if an active session already exists
  const existingSession = await prisma.attendanceSession.findFirst({
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

  // Generate Secure QR Token
  const qrToken = crypto.randomBytes(32).toString("hex");

  const qrImage = await QRCode.toDataURL(qrToken);

  const session = await prisma.attendanceSession.create({
    data: {
      teacherAssignmentId,
      qrToken,
      startTime: new Date(),
      status: "ACTIVE",
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

  res.status(201).json({
    message: "Attendance session started successfully.",
    session,
    qrCode: qrImage,
  });
});

/**
 * End Attendance Session
 */
const endAttendanceSession = asyncHandler(async (req, res) => {
  const session = await prisma.attendanceSession.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!session) {
    return res.status(404).json({
      message: "Attendance session not found.",
    });
  }

  if (session.status === "CLOSED") {
    return res.status(400).json({
      message: "Attendance session already closed.",
    });
  }

  const updatedSession = await prisma.attendanceSession.update({
    where: {
      id: req.params.id,
    },
    data: {
      status: "CLOSED",
      endTime: new Date(),
    },
  });

  res.json({
    message: "Attendance session ended successfully.",
    session: updatedSession,
  });
});

/**
 * Get All Sessions
 */
const getAttendanceSessions = asyncHandler(async (req, res) => {
  const sessions = await prisma.attendanceSession.findMany({
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

  res.json(sessions);
});

module.exports = {
  startAttendanceSession,
  endAttendanceSession,
  getAttendanceSessions,
};