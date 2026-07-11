const authorize = require("../middleware/roleMiddleware");
const express = require("express");


const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// Create Department
router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createDepartment
);

// Get All Departments
router.get(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  getDepartments
);

// Get Department By ID
router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  getDepartmentById
);

// Update Department
router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  updateDepartment
);

// Soft Delete Department
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteDepartment
);
module.exports = router;