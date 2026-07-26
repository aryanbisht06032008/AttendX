const express = require("express");

const {
  getUsers,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/:id", getUserById);

module.exports = router;