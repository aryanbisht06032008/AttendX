const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const studentSchema = require("../validations/studentValidation");

const {
  getStudents,
  createStudent,
  updateStudent,
  getStudentsBySection,
  getStudentsForAttendance,
} = require("../controllers/studentController");

// =====================================
// CREATE STUDENT
// =====================================

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(studentSchema),
  createStudent
);

// =====================================
// GET ALL STUDENTS
// =====================================

router.get(
  "/",
  authMiddleware,
  getStudents
);

// =====================================
// GET STUDENTS BY SECTION
// =====================================

router.get(
  "/section/:sectionId",
  authMiddleware,
  getStudentsBySection
);

// =====================================
// GET STUDENTS FOR ATTENDANCE SESSION
// =====================================

router.get(
  "/attendance/:sessionId",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getStudentsForAttendance
);

// =====================================
// UPDATE STUDENT
// =====================================

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(studentSchema),
  updateStudent
);

module.exports = router;