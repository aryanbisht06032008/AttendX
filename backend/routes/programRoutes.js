const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const programSchema = require("../validations/programValidation");
console.log("Program schema keys:", Object.keys(programSchema.describe().keys));

const {
  createProgram,
} = require("../controllers/programController");

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(programSchema),
  createProgram
);

module.exports = router;