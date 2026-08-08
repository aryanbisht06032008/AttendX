const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
// override: true ensures .env values (e.g. PORT) win over
// environment variables inherited from the OS shell, which may
// set PORT to something unexpected (e.g. 59830).
require("dotenv").config({ override: true });

const authRoutes = require("./routes/authRoutes");

const app = express();
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherAssignmentRoutes = require("./routes/teacherAssignmentRoutes");
const attendanceSessionRoutes = require("./routes/attendanceSessionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const programRoutes = require("./routes/programRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.use("/api/programs", programRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teacher-assignments", teacherAssignmentRoutes);
app.use("/api/attendance-sessions", attendanceSessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/users", userRoutes);

// Error middleware should always be last
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

