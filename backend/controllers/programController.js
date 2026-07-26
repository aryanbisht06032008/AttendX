const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");


/**
 * Create Program
 */
const createProgram = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE PROGRAM REQUEST");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      name,
      code,
      duration,
      semesters,
      departmentId,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !code ||
      duration === undefined ||
      duration === null ||
      !semesters ||
      !departmentId
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        receivedData: req.body,
      });
    }

    // Check if program code already exists
    const existingProgram = await prisma.program.findUnique({
      where: {
        code: String(code).trim(),
      },
    });

    if (existingProgram) {
      return res.status(400).json({
        message: "Program code already exists.",
      });
    }

    // Check department exists
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    // Create program
    const program = await prisma.program.create({
      data: {
        name: String(name).trim(),
        code: String(code).trim(),
        duration: Number(duration),
        semesters: Number(semesters),
        departmentId: departmentId,
      },
      include: {
        department: true,
      },
    });

    console.log("PROGRAM CREATED SUCCESSFULLY:");
    console.log(program);

    return res.status(201).json({
      message: "Program created successfully.",
      program,
    });

  } catch (error) {
    console.error("=================================");
    console.error("CREATE PROGRAM ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      message: "Failed to create program.",
      error: error.message,
    });
  }
};



/**
 * Get All Programs
 */
const getPrograms = asyncHandler(async (req, res) => {
  const programs = await prisma.program.findMany({
    include: {
      department: true,
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
    name,
    code,
    duration,
    semesters,
    departmentId,
  } = req.body;

  const existingProgram = await prisma.program.findUnique({
    where: { id },
  });

  if (!existingProgram) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  const updatedProgram = await prisma.program.update({
    where: { id },
    data: {
      name,
      code,
      duration: Number(duration),
      semesters: Number(semesters),
      departmentId,
    },
  });

  res.json({
    message: "Program updated successfully.",
    program: updatedProgram,
  });
});

/**
 * Deactivate Program
 */
const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingProgram = await prisma.program.findUnique({
    where: { id },
  });

  if (!existingProgram) {
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
    message: "Program deactivated successfully.",
  });
});

module.exports = {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};