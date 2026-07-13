const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Student
 */
const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    programId,
    sectionId,
    enrollmentNumber,
    rollNumber,
    admissionYear,
    guardianName,
    guardianPhone,
    address,
    dateOfBirth,
  } = req.body;

  // Check Program
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    return res.status(404).json({
      message: "Program not found.",
    });
  }

  // Check Section
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    return res.status(404).json({
      message: "Section not found.",
    });
  }

  // Check Email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists.",
    });
  }

  // Check Enrollment Number
  const existingStudent = await prisma.studentProfile.findUnique({
    where: {
      enrollmentNumber,
    },
  });

  if (existingStudent) {
    return res.status(400).json({
      message: "Enrollment number already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    const profile = await tx.studentProfile.create({
      data: {
        userId: user.id,
        programId,
        sectionId,
        enrollmentNumber,
        rollNumber,
        admissionYear,
        guardianName,
        guardianPhone,
        address,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    return {
      user,
      profile,
    };
  });

  res.status(201).json({
    message: "Student created successfully.",
    student,
  });
});

/**
 * Get All Students
 */
const getStudents = asyncHandler(async (req, res) => {
  const students = await prisma.studentProfile.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: true,
      program: true,
      section: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(students);
});

module.exports = {
  createStudent,
  getStudents,
};