const express = require("express");

const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} = require("../controllers/programController");

const router = express.Router();

// Create Program
router.post("/", createProgram);

// Get All Programs
router.get("/", getPrograms);

// Get Program By ID
router.get("/:id", getProgramById);

// Update Program
router.put("/:id", updateProgram);

// Deactivate Program
router.delete("/:id", deleteProgram);

module.exports = router;