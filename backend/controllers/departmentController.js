const prisma = require("../config/prisma");

/**
 * Create Department
 */
const createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Name and code are required.",
      });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { code },
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department code already exists.",
      });
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
      },
    });

    res.status(201).json({
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get All Departments
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        name,
        code,
      },
    });

    res.json({
      message: "Department updated successfully.",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    await prisma.department.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    res.json({
      message: "Department deactivated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};