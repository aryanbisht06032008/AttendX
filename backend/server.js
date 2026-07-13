const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const programRoutes = require("./routes/programRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherAssignmentRoutes = require("./routes/teacherAssignmentRoutes");


// Middleware
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to AttendX!",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teacher-assignments", teacherAssignmentRoutes);

// Error middleware should always be last
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

