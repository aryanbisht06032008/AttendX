const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Teacher
 */
const createTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    departmentId,
    employeeId,
    designation,
    highestQualification,
    joiningDate,
    primaryPhone,
    alternatePhone,
  } = req.body;

  // Check department
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

  // Check email
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists.",
    });
  }

  // Check employee id
  const existingTeacher = await prisma.teacherProfile.findUnique({
    where: {
      employeeId,
    },
  });

  if (existingTeacher) {
    return res.status(400).json({
      message: "Employee ID already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const teacher = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
      },
    });

    const profile = await tx.teacherProfile.create({
      data: {
        userId: user.id,
        departmentId,
        employeeId,
        designation,
        highestQualification,
        joiningDate: new Date(joiningDate),
        primaryPhone,
        alternatePhone,
      },
    });

    return {
      user,
      profile,
    };
  });

  res.status(201).json({
    message: "Teacher created successfully.",
    teacher,
  });
});

/**
 * Get All Teachers
 */
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await prisma.teacherProfile.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(teachers);
});

module.exports = {
  createTeacher,
  getTeachers,
};