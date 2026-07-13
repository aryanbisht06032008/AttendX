const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const teacherAssignmentSchema = require("../validations/teacherAssignmentValidation");

const {
  createTeacherAssignment,
  getTeacherAssignments,
  deleteTeacherAssignment,
} = require("../controllers/teacherAssignmentController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(teacherAssignmentSchema),
  createTeacherAssignment
);

router.get(
  "/",
  authMiddleware,
  getTeacherAssignments
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteTeacherAssignment
);

module.exports = router;