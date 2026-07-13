const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Teacher Assignment
 */
const createTeacherAssignment = asyncHandler(async (req, res) => {
  const { teacherId, subjectId, sectionId } = req.body;

  // Check Teacher
  const teacher = await prisma.teacherProfile.findUnique({
    where: {
      userId: teacherId,
    },
  });

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found.",
    });
  }

  // Check Subject
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });

  if (!subject) {
    return res.status(404).json({
      message: "Subject not found.",
    });
  }

  // Check Section
  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    return res.status(404).json({
      message: "Section not found.",
    });
  }

  // Check Duplicate
  const existing = await prisma.teacherAssignment.findFirst({
    where: {
      teacherId,
      subjectId,
      sectionId,
    },
  });

  if (existing) {
    return res.status(400).json({
      message: "Teacher assignment already exists.",
    });
  }

  const assignment = await prisma.teacherAssignment.create({
    data: {
      teacherId,
      subjectId,
      sectionId,
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

  res.status(201).json({
    message: "Teacher assigned successfully.",
    assignment,
  });
});

/**
 * Get All Assignments
 */
const getTeacherAssignments = asyncHandler(async (req, res) => {
  const assignments = await prisma.teacherAssignment.findMany({
    where: {
      isActive: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(assignments);
});

/**
 * Delete Assignment (Soft Delete)
 */
const deleteTeacherAssignment = asyncHandler(async (req, res) => {
  await prisma.teacherAssignment.update({
    where: {
      id: req.params.id,
    },
    data: {
      isActive: false,
    },
  });

  res.json({
    message: "Assignment deleted successfully.",
  });
});

module.exports = {
  createTeacherAssignment,
  getTeacherAssignments,
  deleteTeacherAssignment,
};