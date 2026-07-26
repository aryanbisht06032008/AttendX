import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import Departments from "../pages/admin/Departments";
import Programs from "../pages/admin/Programs";
import ProtectedRoute from "./ProtectedRoute";
import Teachers from "../pages/admin/Teachers";
import Users from "../pages/admin/Users";
import Students from "../pages/admin/Students";
import Sections from "../pages/admin/Sections";
import TeacherAssignments from "../pages/admin/TeacherAssignments";
import Subjects from "../pages/admin/Subjects";
import StudentAttendance from "../pages/student/Attendance";
import AttendanceScanner from "../pages/student/AttendanceScanner";
import AttendanceHistory from "../pages/student/AttendanceHistory";


function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute role="ADMIN">
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={<Users />}
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute role="ADMIN">
              <Programs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute role="ADMIN">
              <Teachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="ADMIN">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sections"
          element={
            <ProtectedRoute role="ADMIN">
              <Sections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teacher-assignments"
          element={
            <ProtectedRoute role="ADMIN">
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute role="ADMIN">
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance-scanner"
          element={
            <ProtectedRoute role="STUDENT">
              <AttendanceScanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance-history"
          element={
            <ProtectedRoute role="STUDENT">
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

      </Routes>


    </BrowserRouter>
  );
}

export default AppRoutes;