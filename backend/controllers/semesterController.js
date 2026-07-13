const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Semester
 */
const createSemester = asyncHandler(async (req, res) => {
  const { programId, semesterNumber } = req.body;

  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  const existingSemester = await prisma.semester.findFirst({
    where: {
      programId,
      semesterNumber,
    },
  });

  if (existingSemester) {
    return res.status(400).json({
      message: "Semester already exists for this program.",
    });
  }

  const semester = await prisma.semester.create({
    data: {
      programId,
      semesterNumber,
    },
    include: {
      program: true,
    },
  });

  res.status(201).json({
    message: "Semester created successfully.",
    semester,
  });
});

/**
 * Get All Semesters
 */
const getSemesters = asyncHandler(async (req, res) => {
  const semesters = await prisma.semester.findMany({
    where: {
      isActive: true,
    },
    include: {
      program: true,
    },
    orderBy: {
      semesterNumber: "asc",
    },
  });

  res.json(semesters);
});

/**
 * Get Semester By ID
 */
const getSemesterById = asyncHandler(async (req, res) => {
  const semester = await prisma.semester.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      program: true,
    },
  });

  if (!semester) {
    return res.status(404).json({
      message: "Semester not found.",
    });
  }

  res.json(semester);
});

/**
 * Update Semester
 */
const updateSemester = asyncHandler(async (req, res) => {
  const { programId, semesterNumber } = req.body;

  const semester = await prisma.semester.update({
    where: {
      id: req.params.id,
    },
    data: {
      programId,
      semesterNumber,
    },
  });

  res.json({
    message: "Semester updated successfully.",
    semester,
  });
});

/**
 * Soft Delete Semester
 */
const deleteSemester = asyncHandler(async (req, res) => {
  await prisma.semester.update({
    where: {
      id: req.params.id,
    },
    data: {
      isActive: false,
    },
  });

  res.json({
    message: "Semester deleted successfully.",
  });
});

module.exports = {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
};