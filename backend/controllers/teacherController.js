const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

// ==========================================
// GET ALL TEACHERS
// ==========================================
const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(teachers);
  } catch (error) {
    console.error("GET TEACHERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch teachers.",
    });
  }
};


// ==========================================
// GET TEACHER BY ID
// ==========================================
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher =
      await prisma.teacherProfile.findUnique({
        where: {
          userId: id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found.",
      });
    }

    res.json(teacher);
  } catch (error) {
    console.error("GET TEACHER ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch teacher.",
    });
  }
};


// ==========================================
// CREATE TEACHER
// ==========================================
const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      departmentId,
      designation,
      highestQualification,
      joiningDate,
      primaryPhone,
      alternatePhone,
    } = req.body;


    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !employeeId ||
      !departmentId ||
      !designation ||
      !highestQualification ||
      !joiningDate ||
      !primaryPhone
    ) {
      return res.status(400).json({
        message:
          "Please fill all required teacher fields.",
      });
    }


    // Check if email already exists
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "A user with this email already exists.",
      });
    }


    // Check employee ID
    const existingTeacher =
      await prisma.teacherProfile.findUnique({
        where: {
          employeeId,
        },
      });

    if (existingTeacher) {
      return res.status(400).json({
        message:
          "Employee ID already exists.",
      });
    }


    // Check department
    const department =
      await prisma.department.findUnique({
        where: {
          id: departmentId,
        },
      });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }


    // Check active department
    if (!department.isActive) {
      return res.status(400).json({
        message:
          "Cannot assign teacher to an inactive department.",
      });
    }


    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);


    // Create User + TeacherProfile
    const teacher =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "TEACHER",

          teacherProfile: {
            create: {
              employeeId,
              departmentId,
              designation,
              highestQualification,

              joiningDate:
                new Date(joiningDate),

              primaryPhone,
              alternatePhone:
                alternatePhone || null,
            },
          },
        },

        include: {
          teacherProfile: {
            include: {
              department: true,
            },
          },
        },
      });


    res.status(201).json({
      message:
        "Teacher created successfully.",

      teacher,
    });

  } catch (error) {
    console.error(
      "CREATE TEACHER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create teacher.",

      error: error.message,
    });
  }
};


// ==========================================
// UPDATE TEACHER
// ==========================================
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      employeeId,
      departmentId,
      designation,
      highestQualification,
      joiningDate,
      primaryPhone,
      alternatePhone,
    } = req.body;

    // Find teacher
    const teacher =
      await prisma.teacherProfile.findUnique({
        where: {
          userId: id,
        },
      });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found.",
      });
    }

    // Update teacher
    const updatedTeacher =
      await prisma.teacherProfile.update({
        where: {
          userId: id,
        },

        data: {
          employeeId,

          designation,

          highestQualification,

          joiningDate:
            new Date(joiningDate),

          primaryPhone,

          alternatePhone:
            alternatePhone || null,

          // Update department relation
          department: {
            connect: {
              id: departmentId,
            },
          },

          // Update User
          user: {
            update: {
              name,
              email,
            },
          },
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

    res.json({
      message:
        "Teacher updated successfully.",

      teacher:
        updatedTeacher,
    });

  } catch (error) {

    console.error(
      "UPDATE TEACHER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update teacher.",

      error:
        error.message,
    });
  }
};


// ==========================================
// DEACTIVATE TEACHER
// ==========================================
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher =
      await prisma.teacherProfile.findUnique({
        where: {
          userId: id,
        },
      });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found.",
      });
    }

    await prisma.teacherProfile.update({
      where: {
        userId: id,
      },

      data: {
        isActive: false,
      },
    });

    res.json({
      message:
        "Teacher deactivated successfully.",
    });
  } catch (error) {
    console.error(
      "DEACTIVATE TEACHER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to deactivate teacher.",
      error: error.message,
    });
  }
};

// ==========================================
// GET LOGGED-IN TEACHER ASSIGNMENTS
// ==========================================
const getMyAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const assignments =
      await prisma.teacherAssignment.findMany({
        where: {
          teacherId,
          isActive: true,
        },
        include: {
          subject: true,
          section: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(assignments);
  } catch (error) {
    console.error(
      "GET MY ASSIGNMENTS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch teacher assignments.",
    });
  }
};
// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getMyAssignments,
};