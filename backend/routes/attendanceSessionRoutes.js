const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  startAttendanceSession,
  endAttendanceSession,
  getMyActiveSession,
  getAttendanceSessions,
  getSessionQRCode,
} = require("../controllers/attendanceSessionController");

// Start attendance session
router.post(
  "/start",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  startAttendanceSession
);

// Get currently active session for logged-in teacher
router.get(
  "/active",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getMyActiveSession
);

// Get QR code for existing active session
router.get(
  "/:id/qr",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getSessionQRCode
);

// End attendance session
router.post(
  "/end/:id",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  endAttendanceSession
);

// Get all attendance sessions
router.get(
  "/",
  authMiddleware,
  authorize("TEACHER", "ADMIN"),
  getAttendanceSessions
);

module.exports = router;