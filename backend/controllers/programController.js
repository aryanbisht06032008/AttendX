const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const createProgram = asyncHandler(async (req, res) => {
  const {
    departmentId,
    courseId,
    name,
    code,
    totalSeats,
  } = req.body;

  // Check Department
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

  // Check Course
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    return res.status(404).json({
      message: "Course not found.",
    });
  }

  // Check Duplicate Code
  const existingProgram = await prisma.program.findUnique({
    where: {
      code,
    },
  });

  if (existingProgram) {
    return res.status(400).json({
      message: "Program code already exists.",
    });
  }

  // Create Program
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

module.exports = {
  createProgram,
};