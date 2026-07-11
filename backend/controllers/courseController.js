const courseSchema = require("../validations/courseValidation");
const prisma = require("../config/prisma");

/**
 * Create Course
 */
const createCourse = async (req, res) => {
    try {
        const { name, code, durationYears, totalSemesters } = req.body;

        const { error } = courseSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const existingCourse = await prisma.course.findUnique({
            where: { code },
        });

        if (existingCourse) {
            return res.status(400).json({
                message: "Course code already exists.",
            });
        }

        const course = await prisma.course.create({
            data: {
                name,
                code,
                durationYears,
                totalSemesters,
            },
        });

        res.status(201).json({
            message: "Course created successfully.",
            course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            orderBy: {
                name: "asc",
            },
        });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found.",
            });
        }

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, durationYears, totalSemesters } = req.body;

        const course = await prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found.",
            });
        }

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
                name,
                code,
                durationYears,
                totalSemesters,
            },
        });

        res.json({
            message: "Course updated successfully.",
            course: updatedCourse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found.",
            });
        }

        await prisma.course.update({
            where: { id },
            data: {
                isActive: false,
            },
        });

        res.json({
            message: "Course deactivated successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};



module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};