const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const studentSchema = require("../validations/studentValidation");

const {
  createStudent,
  getStudents,
} = require("../controllers/studentController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(studentSchema),
  createStudent
);

router.get(
  "/",
  authMiddleware,
  getStudents
);

module.exports = router;