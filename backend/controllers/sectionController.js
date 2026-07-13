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

  const sections = await prisma.section.findMany({
    where: {
      isActive: true,
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

module.exports = {
  createSection,
  getSections,
};