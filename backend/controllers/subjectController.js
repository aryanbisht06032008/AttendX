const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Subject
 */
const createSubject = asyncHandler(async (req, res) => {
  const { semesterId, name, code, credits, type } = req.body;

  const semester = await prisma.semester.findUnique({
    where: { id: semesterId },
  });

  if (!semester) {
    return res.status(404).json({
      message: "Semester not found.",
    });
  }

  const existing = await prisma.subject.findUnique({
    where: { code },
  });

  if (existing) {
    return res.status(400).json({
      message: "Subject code already exists.",
    });
  }

  const subject = await prisma.subject.create({
    data: {
      semesterId,
      name,
      code,
      credits,
      type,
    },
    include: {
      semester: true,
    },
  });

  res.status(201).json({
    message: "Subject created successfully.",
    subject,
  });
});

/**
 * Get All Subjects
 */
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await prisma.subject.findMany({
    where: {
      isActive: true,
    },
    include: {
      semester: {
        include: {
          program: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(subjects);
});

/**
 * Get Subject By ID
 */
const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      semester: {
        include: {
          program: true,
        },
      },
    },
  });

  if (!subject) {
    return res.status(404).json({
      message: "Subject not found.",
    });
  }

  res.json(subject);
});

/**
 * Update Subject
 */
const updateSubject = asyncHandler(async (req, res) => {
  const { semesterId, name, code, credits, type } = req.body;

  const subject = await prisma.subject.update({
    where: {
      id: req.params.id,
    },
    data: {
      semesterId,
      name,
      code,
      credits,
      type,
    },
  });

  res.json({
    message: "Subject updated successfully.",
    subject,
  });
});

/**
 * Soft Delete Subject
 */
const deleteSubject = asyncHandler(async (req, res) => {
  await prisma.subject.update({
    where: {
      id: req.params.id,
    },
    data: {
      isActive: false,
    },
  });

  res.json({
    message: "Subject deleted successfully.",
  });
});

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};