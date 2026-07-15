const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const attendanceSchema = require("../validations/attendanceValidation");

const {
  scanAttendance,
} = require("../controllers/attendanceController");

router.post(
  "/scan",
  authMiddleware,
  authorize("STUDENT"),
  validate(attendanceSchema),
  scanAttendance
);

module.exports = router;