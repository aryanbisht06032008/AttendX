const express = require("express");

const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getMyAssignments,
} = require("../controllers/teacherController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Teacher's own assignments
router.get(
  "/my-assignments",
  authMiddleware,
  authorize("TEACHER"),
  getMyAssignments
);

// Admin teacher management
router.get("/", getTeachers);

router.post("/", createTeacher);

router.get("/:id", getTeacherById);

router.put("/:id", updateTeacher);

router.delete("/:id", deleteTeacher);

module.exports = router;