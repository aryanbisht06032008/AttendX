const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const sectionSchema = require("../validations/sectionValidation");

const {
  createSection,
  getSections,
} = require("../controllers/sectionController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(sectionSchema),
  createSection
);

router.get(
  "/",
  authMiddleware,
  getSections
);

module.exports = router;