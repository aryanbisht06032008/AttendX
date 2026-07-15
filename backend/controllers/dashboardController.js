const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Admin Dashboard
 */
const adminDashboard = asyncHandler(async (req, res) => {

  const [
    departments,
    courses,
    programs,
    teachers,
    students,
    subjects,
    sections,
    activeSessions,
    totalSessions,
  ] = await Promise.all([

    prisma.department.count({
      where: { isActive: true },
    }),

    prisma.course.count({
      where: { isActive: true },
    }),

    prisma.program.count({
      where: { isActive: true },
    }),

    prisma.teacherProfile.count({
      where: { isActive: true },
    }),

    prisma.studentProfile.count({
      where: { isActive: true },
    }),

    prisma.subject.count({
      where: { isActive: true },
    }),

    prisma.section.count({
      where: { isActive: true },
    }),

    prisma.attendanceSession.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.attendanceSession.count(),

  ]);

  res.json({
    departments,
    courses,
    programs,
    teachers,
    students,
    subjects,
    sections,
    activeSessions,
    totalSessions,
  });

});

/**
 * Teacher Dashboard
 */
const teacherDashboard = asyncHandler(async (req, res) => {

  const teacher = await prisma.teacherProfile.findUnique({
    where: {
      userId: req.user.id,
    },
    include: {
      user: true,
    },
  });

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found.",
    });
  }

  const assignments = await prisma.teacherAssignment.findMany({
    where: {
      teacherId: teacher.userId,
      isActive: true,
    },
    include: {
      subject: true,
      section: true,
    },
  });

  const activeSessions = await prisma.attendanceSession.count({
    where: {
      status: "ACTIVE",
      teacherAssignment: {
        teacherId: teacher.userId,
      },
    },
  });

  const totalSessions = await prisma.attendanceSession.count({
    where: {
      teacherAssignment: {
        teacherId: teacher.userId,
      },
    },
  });

  res.json({
    success: true,
    dashboard: {
      teacherName: teacher.user.name,
      assignedSubjects: assignments.length,
      assignedSections: new Set(
        assignments.map(a => a.sectionId)
      ).size,
      activeSessions,
      totalSessions,
      recentAssignments: assignments,
    },
  });

});

/**
 * Student Dashboard
 */
const studentDashboard = asyncHandler(async (req, res) => {

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId: req.user.id,
    },
    include: {
      user: true,
      program: true,
      section: true,
    },
  });

  if (!student) {
    return res.status(404).json({
      message: "Student not found.",
    });
  }

  const totalClasses = await prisma.attendance.count({
    where: {
      studentId: student.userId,
    },
  });

  const presentClasses = await prisma.attendance.count({
    where: {
      studentId: student.userId,
      status: "PRESENT",
    },
  });

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Number(((presentClasses / totalClasses) * 100).toFixed(2));

  const recentAttendance = await prisma.attendance.findMany({
    where: {
      studentId: student.userId,
    },
    include: {
      attendanceSession: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  res.json({
    success: true,
    dashboard: {
      studentName: student.user.name,
      program: student.program.name,
      section: student.section.name,
      totalClasses,
      presentClasses,
      attendancePercentage,
      recentAttendance,
    },
  });

});

module.exports = {
  adminDashboard,
  teacherDashboard,
  studentDashboard,
};