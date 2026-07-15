const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Student Scan QR
 */
const scanAttendance = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;

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
  });

  if (!session) {
    return res.status(400).json({
      message: "Invalid or expired QR Code.",
    });
  }

  // Check duplicate attendance
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      attendanceSessionId: session.id,
      studentId: student.userId,
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
    },
  });

  res.status(201).json({
    message: "Attendance marked successfully.",
    attendance,
  });
});

module.exports = {
  scanAttendance,
};