const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} = require("../controllers/courseController");

router.post(
    "/",
    authMiddleware,
    authorize("ADMIN"),
    createCourse
);

router.get("/", authMiddleware, authorize("ADMIN"), getCourses);

router.get("/:id", authMiddleware, authorize("ADMIN"), getCourseById);

router.put("/:id", authMiddleware, authorize("ADMIN"), updateCourse);

router.delete("/:id", authMiddleware, authorize("ADMIN"), deleteCourse);

module.exports = router;