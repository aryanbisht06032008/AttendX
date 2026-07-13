const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const subjectSchema = require("../validations/subjectValidation");

const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(subjectSchema),
  createSubject
);

router.get(
  "/",
  authMiddleware,
  getSubjects
);

router.get(
  "/:id",
  authMiddleware,
  getSubjectById
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(subjectSchema),
  updateSubject
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteSubject
);

module.exports = router;