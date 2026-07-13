const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Program
 */
const createProgram = asyncHandler(async (req, res) => {
  const {
    departmentId,
    courseId,
    name,
    code,
    totalSeats,
  } = req.body;

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    return res.status(404).json({
      message: "Department not found.",
    });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return res.status(404).json({
      message: "Course not found.",
    });
  }

  const existingProgram = await prisma.program.findUnique({
    where: { code },
  });

  if (existingProgram) {
    return res.status(400).json({
      message: "Program code already exists.",
    });
  }

  const program = await prisma.program.create({
    data: {
      departmentId,
      courseId,
      name,
      code,
      totalSeats,
    },
    include: {
      department: true,
      course: true,
    },
  });

  res.status(201).json({
    message: "Program created successfully.",
    program,
  });
});

/**
 * Get All Programs
 */
const getPrograms = asyncHandler(async (req, res) => {
  const programs = await prisma.program.findMany({
    include: {
      department: true,
      course: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(programs);
});

/**
 * Get Program By ID
 */
const getProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      department: true,
      course: true,
    },
  });

  if (!program) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  res.json(program);
});

/**
 * Update Program
 */
const updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    departmentId,
    courseId,
    name,
    code,
    totalSeats,
  } = req.body;

  const existing = await prisma.program.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  const updated = await prisma.program.update({
    where: { id },
    data: {
      departmentId,
      courseId,
      name,
      code,
      totalSeats,
    },
    include: {
      department: true,
      course: true,
    },
  });

  res.json({
    message: "Program updated successfully.",
    program: updated,
  });
});

/**
 * Soft Delete
 */
const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.program.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  await prisma.program.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  res.json({
    message: "Program deleted successfully.",
  });
});

module.exports = {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};