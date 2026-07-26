const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

/**
 * ============================================
 * CREATE STUDENT
 * ============================================
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

  // ============================================
  // CHECK PROGRAM
  // ============================================

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

  // ============================================
  // CHECK SECTION
  // ============================================

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

  // ============================================
  // CHECK EMAIL
  // ============================================

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

  // ============================================
  // CHECK ENROLLMENT NUMBER
  // ============================================

  const existingStudent =
    await prisma.studentProfile.findUnique({
      where: {
        enrollmentNumber,
      },
    });

  if (existingStudent) {
    return res.status(400).json({
      message: "Enrollment number already exists.",
    });
  }

  // ============================================
  // HASH PASSWORD
  // ============================================

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // ============================================
  // CREATE USER + STUDENT PROFILE
  // ============================================

  const student = await prisma.$transaction(
    async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      const profile =
        await tx.studentProfile.create({
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
    }
  );

  res.status(201).json({
    message: "Student created successfully.",
    student,
  });
});

/**
 * ============================================
 * GET ALL STUDENTS
 * ============================================
 */
const getStudents = asyncHandler(async (req, res) => {
  const students =
    await prisma.studentProfile.findMany({
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

/**
 * ============================================
 * GET STUDENTS BY SECTION
 * ============================================
 */
const getStudentsBySection = asyncHandler(
  async (req, res) => {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        message: "Section ID is required.",
      });
    }

    const students =
      await prisma.studentProfile.findMany({
        where: {
          sectionId,
          isActive: true,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          program: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },

          section: {
            select: {
              id: true,
              name: true,
              batchYear: true,
            },
          },
        },

        orderBy: {
          rollNumber: "asc",
        },
      });

    res.json(students);
  }
);

/**
 * ============================================
 * GET STUDENTS FOR ATTENDANCE SESSION
 * ============================================
 *
 * Used by teacher to get all active students
 * belonging to the section of the active
 * attendance session.
 *
 * GET:
 * /api/students/attendance/:sessionId
 *
 * Example:
 * /api/students/attendance/abc123
 *
 * ============================================
 */
const getStudentsForAttendance = asyncHandler(
  async (req, res) => {
    const { sessionId } = req.params;

    // ============================================
    // CHECK SESSION ID
    // ============================================

    if (!sessionId) {
      return res.status(400).json({
        message: "Attendance session ID is required.",
      });
    }

    // ============================================
    // FIND ATTENDANCE SESSION
    // ============================================

    const session =
      await prisma.attendanceSession.findUnique({
        where: {
          id: sessionId,
        },

        include: {
          teacherAssignment: true,
        },
      });

    if (!session) {
      return res.status(404).json({
        message: "Attendance session not found.",
      });
    }

    // ============================================
    // CHECK TEACHER ASSIGNMENT
    // ============================================

    if (!session.teacherAssignment) {
      return res.status(404).json({
        message:
          "Teacher assignment not found for this session.",
      });
    }

    // ============================================
    // GET STUDENTS FROM SESSION SECTION
    // ============================================

    const students =
      await prisma.studentProfile.findMany({
        where: {
          sectionId:
            session.teacherAssignment.sectionId,

          isActive: true,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          program: true,

          section: true,
        },

        orderBy: {
          rollNumber: "asc",
        },
      });

    // ============================================
    // RETURN STUDENTS
    // ============================================

    res.json(students);
  }
);

/**
 * ============================================
 * UPDATE STUDENT
 * ============================================
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

  // ============================================
  // FIND STUDENT
  // ============================================

  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId: id,
      },

      include: {
        user: true,
      },
    });

  if (!student) {
    return res.status(404).json({
      message: "Student not found.",
    });
  }

  // ============================================
  // CHECK PROGRAM
  // ============================================

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

  // ============================================
  // CHECK SECTION
  // ============================================

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

  // ============================================
  // CHECK EMAIL
  // ============================================

  const existingUser =
    await prisma.user.findFirst({
      where: {
        email,

        NOT: {
          id,
        },
      },
    });

  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists.",
    });
  }

  // ============================================
  // CHECK ENROLLMENT NUMBER
  // ============================================

  const existingEnrollment =
    await prisma.studentProfile.findFirst({
      where: {
        enrollmentNumber,

        NOT: {
          userId: id,
        },
      },
    });

  if (existingEnrollment) {
    return res.status(400).json({
      message: "Enrollment number already exists.",
    });
  }

  // ============================================
  // UPDATE USER + PROFILE
  // ============================================

  const updatedStudent =
    await prisma.$transaction(async (tx) => {
      const userData = {
        name,
        email,
      };

      // Only update password if provided
      if (password) {
        userData.password =
          await bcrypt.hash(password, 10);
      }

      // Update user
      const user = await tx.user.update({
        where: {
          id,
        },

        data: userData,
      });

      // Update student profile
      const profile =
        await tx.studentProfile.update({
          where: {
            userId: id,
          },

          data: {
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

  // ============================================
  // RESPONSE
  // ============================================

  res.json({
    message: "Student updated successfully.",

    student: updatedStudent,
  });
});

/**
 * ============================================
 * EXPORT CONTROLLERS
 * ============================================
 */
module.exports = {
  createStudent,
  getStudents,
  getStudentsBySection,
  getStudentsForAttendance,
  updateStudent,
};