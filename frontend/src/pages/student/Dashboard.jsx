import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your attendance and view your attendance history.
          </p>

        </div>


        {/* ================= ATTENDANCE ACTIONS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ================= QR SCANNER ================= */}

          <div className="bg-white rounded-xl shadow-md p-8">

            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-5">
              📷
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Scan Attendance
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              Scan the QR code displayed by your teacher
              to mark your attendance.
            </p>

            <button
              onClick={() =>
                window.location.href = "/student/attendance-scanner"
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Scan Attendance QR
            </button>

          </div>


          {/* ================= ATTENDANCE HISTORY ================= */}

          <div className="bg-white rounded-xl shadow-md p-8">

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-5">
              📋
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Attendance History
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              View your attendance records, status,
              subjects, teachers and attendance percentage.
            </p>

            <button
              onClick={() =>
                window.location.href = "/student/attendance-history"
              }
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              View Attendance History
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;