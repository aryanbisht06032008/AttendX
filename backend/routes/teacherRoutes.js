const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const teacherSchema = require("../validations/teacherValidation");

const {
  createTeacher,
  getTeachers,
} = require("../controllers/teacherController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(teacherSchema),
  createTeacher
);

router.get(
  "/",
  authMiddleware,
  getTeachers
);

module.exports = router;