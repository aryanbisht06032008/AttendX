const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const attendanceSessionSchema = require("../validations/attendanceSessionValidation");

const {
  startAttendanceSession,
  endAttendanceSession,
  getAttendanceSessions,
} = require("../controllers/attendanceSessionController");

router.post(
  "/start",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  validate(attendanceSessionSchema),
  startAttendanceSession
);

router.post(
  "/end/:id",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  endAttendanceSession
);

router.get(
  "/",
  authMiddleware,
  getAttendanceSessions
);

module.exports = router;