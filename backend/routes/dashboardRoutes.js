const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  adminDashboard,
  teacherDashboard,
  studentDashboard,
} = require("../controllers/dashboardController");


router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  adminDashboard
);

router.get(
  "/teacher",
  authMiddleware,
  authorize("TEACHER"),
  teacherDashboard
);

router.get(
  "/student",
  authMiddleware,
  authorize("STUDENT"),
  studentDashboard
);

module.exports = router;