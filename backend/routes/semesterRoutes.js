const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const semesterSchema = require("../validations/semesterValidation");

const {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
} = require("../controllers/semesterController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(semesterSchema),
  createSemester
);

router.get("/", authMiddleware, getSemesters);

router.get("/:id", authMiddleware, getSemesterById);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(semesterSchema),
  updateSemester
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteSemester
);

module.exports = router;