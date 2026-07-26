const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Section
 */
const createSection = asyncHandler(async (req, res) => {

  const {
    programId,
    name,
    batchYear,
    maxStrength,
  } = req.body;

  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
  });

  if (!program) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }
  const existingSection = await prisma.section.findFirst({
    where: {
      programId,
      batchYear,
      name,
    },
  });

  if (existingSection) {
    return res.status(400).json({
      message: "Section already exists for this program and batch.",
    });
  }
  const section = await prisma.section.create({
    data: {
      programId,
      name,
      batchYear,
      maxStrength,
    },
    include: {
      program: true,
    },
  });

  res.status(201).json({
    message: "Section created successfully.",
    section,
  });

});

/**
 * Get All Sections
 */
const getSections = asyncHandler(async (req, res) => {
  const { programId } = req.query;

  const sections = await prisma.section.findMany({
    where: {
      isActive: true,

      ...(programId && {
        programId,
      }),
    },

    include: {
      program: true,
    },

    orderBy: {
      batchYear: "desc",
    },
  });

  res.json(sections);
});

/**
 * Get Students by Section
 */
const getSectionStudents = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  // Check if section exists
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

  // Get all students in this section
  const students = await prisma.studentProfile.findMany({
    where: {
      sectionId,
    },
    include: {
      user: true,
      program: true,
      section: true,
    },
    orderBy: {
      rollNumber: "asc",
    },
  });

  res.json(students);
});

module.exports = {
  createSection,
  getSections,
  getSectionStudents,
};