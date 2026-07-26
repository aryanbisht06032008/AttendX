const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const attendanceSchema = require("../validations/attendanceValidation");

const {
  scanAttendance,
  markManualAttendance,
  getSessionAttendance,
  getMyAttendance,
} = require("../controllers/attendanceController");

// =====================================
// STUDENT SCANS QR
// =====================================

router.post(
  "/scan",
  authMiddleware,
  authorize("STUDENT"),
  validate(attendanceSchema),
  scanAttendance
);

// =====================================
// TEACHER / ADMIN MARK MANUAL ATTENDANCE
// =====================================

router.post(
  "/manual",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  markManualAttendance
);

// =====================================
// STUDENT VIEW OWN ATTENDANCE
// =====================================

router.get(
  "/my",
  authMiddleware,
  authorize("STUDENT"),
  getMyAttendance
);

// =====================================
// TEACHER / ADMIN VIEW SESSION ATTENDANCE
// =====================================

router.get(
  "/session/:sessionId",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getSessionAttendance
);

module.exports = router;