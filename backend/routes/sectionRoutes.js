const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const sectionSchema = require("../validations/sectionValidation");

const {
  createSection,
  getSections,
  getSectionStudents,
} = require("../controllers/sectionController");

// =====================================
// CREATE SECTION
// =====================================

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(sectionSchema),
  createSection
);

// =====================================
// GET ALL ACTIVE SECTIONS
// =====================================

router.get(
  "/",
  authMiddleware,
  getSections
);

// =====================================
// GET STUDENTS IN A SECTION
// =====================================

router.get(
  "/:sectionId/students",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getSectionStudents
);

module.exports = router;