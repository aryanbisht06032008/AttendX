import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // =====================================
  // TEACHER ASSIGNMENTS
  // =====================================

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [assignmentLoading, setAssignmentLoading] = useState(true);

  // =====================================
  // ATTENDANCE SESSION
  // =====================================

  const [session, setSession] = useState(null);
  const [qrCode, setQrCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================
  // ATTENDANCE RECORDS
  // =====================================

  const [attendances, setAttendances] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  // =====================================
  // STUDENTS
  // =====================================

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================
  // GET TEACHER ASSIGNMENTS
  // =====================================

  const getMyAssignments = async () => {
    try {
      setAssignmentLoading(true);

      const response = await api.get("/teachers/my-assignments");

      const data = response.data || [];

      setAssignments(data);

      // Automatically select assignment if only one exists
      if (data.length === 1) {
        setSelectedAssignment(data[0].id);
      }
    } catch (error) {
      console.error(
        "Failed to fetch assignments:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to fetch teacher assignments."
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  // =====================================
  // GET STUDENTS FOR ATTENDANCE
  // =====================================

  const getStudentsForAttendance = async () => {
    if (!session) {
      return;
    }

    try {
      setStudentsLoading(true);

      const response = await api.get(
        `/students/attendance/${session.id}`
      );

      setStudents(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch students:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to fetch students for attendance."
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  // =====================================
  // GET ACTIVE SESSION
  // =====================================

  const getActiveSession = async () => {
    try {
      const response = await api.get(
        "/attendance-sessions/active"
      );

      const activeSession =
        response.data?.session;

      if (!activeSession) {
        setSession(null);
        setQrCode("");
        return;
      }

      // Restore active session
      setSession(activeSession);

      // Restore selected assignment
      if (
        activeSession.teacherAssignmentId
      ) {
        setSelectedAssignment(
          activeSession.teacherAssignmentId
        );
      }

      // Backend may return QR code
      if (response.data?.qrCode) {
        setQrCode(response.data.qrCode);
      } else if (activeSession.qrToken) {
        // Generate QR from stored token using backend endpoint
        try {
          const qrResponse = await api.get(
            `/attendance-sessions/${activeSession.id}/qr`
          );

          if (qrResponse.data?.qrCode) {
            setQrCode(
              qrResponse.data.qrCode
            );
          }
        } catch (qrError) {
          console.error(
            "Failed to restore QR code:",
            qrError
          );
        }
      }

      // Load attendance records automatically
      await getAttendanceRecords(
        activeSession.id,
        false
      );

      // Load students automatically
      await getStudentsForAttendanceForSession(
        activeSession.id
      );
    } catch (error) {
      console.error(
        "Failed to fetch active attendance session:",
        error
      );

      // Don't show error when there simply isn't
      // an active session
      if (
        error.response?.status !== 404
      ) {
        setMessage(
          error.response?.data?.message ||
            "Failed to restore attendance session."
        );
      }
    }
  };

  // =====================================
  // GET STUDENTS FOR SPECIFIC SESSION
  // =====================================

  const getStudentsForAttendanceForSession =
    async (sessionId) => {
      if (!sessionId) {
        return;
      }

      try {
        setStudentsLoading(true);

        const response = await api.get(
          `/students/attendance/${sessionId}`
        );

        setStudents(response.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch students:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Failed to fetch students for attendance."
        );
      } finally {
        setStudentsLoading(false);
      }
    };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    const loadDashboard = async () => {
      await getMyAssignments();
      await getActiveSession();
    };

    loadDashboard();
  }, []);

  // =====================================
  // START ATTENDANCE
  // =====================================

  const startAttendance = async (
    assignmentId
  ) => {
    if (!assignmentId) {
      setMessage(
        "Please select a subject and section."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/attendance-sessions/start",
        {
          teacherAssignmentId:
            assignmentId,
        }
      );

      const newSession =
        response.data?.session;

      if (!newSession) {
        throw new Error(
          "Session was not returned by server."
        );
      }

      setSession(newSession);

      // QR returned when session starts
      setQrCode(
        response.data?.qrCode || ""
      );

      // Reset old records
      setAttendances([]);
      setStudents([]);

      setShowAttendance(false);

      setMessage(
        "Attendance session started successfully."
      );

      // Load students for this session
      await getStudentsForAttendanceForSession(
        newSession.id
      );
    } catch (error) {
      console.error(
        "START ATTENDANCE ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to start attendance session."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // END ATTENDANCE
  // =====================================

  const endAttendance = async () => {
    if (!session) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post(
        `/attendance-sessions/end/${session.id}`
      );

      setMessage(
        "Attendance session ended successfully."
      );

      setSession(null);
      setQrCode("");
      setAttendances([]);
      setStudents([]);
      setShowAttendance(false);
      setSelectedAssignment("");
    } catch (error) {
      console.error(
        "END ATTENDANCE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to end attendance session."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GET ATTENDANCE RECORDS
  // =====================================

  const getAttendanceRecords = async (
    sessionId = session?.id,
    show = true
  ) => {
    if (!sessionId) {
      return;
    }

    try {
      setAttendanceLoading(true);

      if (show) {
        setMessage("");
      }

      const response = await api.get(
        `/attendance/session/${sessionId}`
      );

      setAttendances(
        response.data?.attendances || []
      );

      if (show) {
        setShowAttendance(true);
      }
    } catch (error) {
      console.error(
        "Failed to fetch attendance records:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to fetch attendance records."
      );
    } finally {
      setAttendanceLoading(false);
    }
  };

  // =====================================
  // MARK MANUAL ATTENDANCE
  // =====================================

  const markManualAttendance = async (
    studentId,
    status
  ) => {
    if (!session) {
      setMessage(
        "No active attendance session."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/attendance/manual",
        {
          attendanceSessionId:
            session.id,

          studentId,

          status,
        }
      );

      setMessage(
        response.data?.message ||
          "Attendance marked successfully."
      );

      // Refresh records
      await getAttendanceRecords(
        session.id,
        true
      );

      // Refresh students
      await getStudentsForAttendanceForSession(
        session.id
      );
    } catch (error) {
      console.error(
        "Manual attendance error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to mark attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-app p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-amber-600">
              AttendX Teacher Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-800">
              Teacher Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Start an attendance session and display
              the QR code for students.
            </p>

          </div>

          <div className="flex items-center gap-4">

            {/* User Information */}

            <div className="hidden text-right sm:block">

              <p className="font-semibold text-gray-800">
                {user?.name || "Teacher"}
              </p>

              <p className="text-sm text-gray-500">
                {user?.role || "TEACHER"}
              </p>

            </div>

            {/* Logout Button */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-red-50
                px-4
                py-3
                font-semibold
                text-red-600
                transition
                hover:bg-red-100
                hover:text-red-700
              "
            >
              <FaSignOutAlt />

              <span>
                Logout
              </span>
            </button>

          </div>

        </div>


        {/* =====================================
            START SESSION
        ===================================== */}

        {!session && (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

            <h2 className="mb-4 text-xl font-semibold">
              Start Attendance
            </h2>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Subject & Section
            </label>

            {assignmentLoading ? (

              <p className="mb-4 text-gray-500">
                Loading your assignments...
              </p>

            ) : assignments.length === 0 ? (

              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                No active teacher assignments found.
              </div>

            ) : (

              <select
                value={selectedAssignment}
                onChange={(e) =>
                  setSelectedAssignment(
                    e.target.value
                  )
                }
                className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15"
              >

                <option value="">
                  -- Select Subject & Section --
                </option>

                {assignments.map(
                  (assignment) => (

                    <option
                      key={assignment.id}
                      value={assignment.id}
                    >
                      {assignment.subject
                        ?.name ||
                        "Unknown Subject"}{" "}
                      - Section{" "}
                      {assignment.section
                        ?.name ||
                        assignment.section
                          ?.code ||
                        "Unknown"}
                    </option>

                  )
                )}

              </select>

            )}

            <button
              onClick={() =>
                startAttendance(
                  selectedAssignment
                )
              }
              disabled={
                loading ||
                !selectedAssignment
              }
              className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-glow disabled:pointer-events-none disabled:opacity-50"
            >
              {loading
                ? "Starting..."
                : "Start Attendance"}
            </button>

          </div>
        )}


        {/* =====================================
            ACTIVE SESSION
        ===================================== */}

        {session && (

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-card">

            <h2 className="mb-2 font-display text-2xl font-bold text-emerald-600">
              Attendance Session Active
            </h2>

            <p className="mb-6 text-gray-600">
              Students can scan this QR code
              to mark their attendance.
            </p>


            {/* QR CODE */}

            {qrCode ? (

              <div className="mb-6 flex justify-center">

                <img
                  src={qrCode}
                  alt="Attendance QR Code"
                  className="h-72 w-72 rounded-2xl border-4 border-white bg-white p-3 shadow-glow-sm"
                />

              </div>

            ) : (

              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                QR Code is being restored...
              </div>

            )}


            {/* SESSION INFORMATION */}

            <div className="mx-auto max-w-xl text-left">

              <p className="mb-2 text-sm text-gray-500">
                Subject
              </p>

              <p className="mb-4 font-semibold">
                {session.teacherAssignment
                  ?.subject?.name ||
                  "—"}
              </p>


              <p className="mb-2 text-sm text-gray-500">
                Section
              </p>

              <p className="mb-4 font-semibold">
                {session.teacherAssignment
                  ?.section?.name ||
                  session.teacherAssignment
                    ?.section?.code ||
                  "—"}
              </p>


              <p className="mb-2 text-sm text-gray-500">
                Session ID
              </p>

              <p className="mb-6 break-all rounded-xl bg-slate-100 p-3 font-mono text-xs">
                {session.id}
              </p>

            </div>


            {/* BUTTONS */}

            <div className="flex flex-col justify-center gap-4 sm:flex-row">

              <button
                onClick={() =>
                  getAttendanceRecords()
                }
                disabled={
                  attendanceLoading
                }
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 font-semibold text-white shadow-[0_4px_14px_-6px_rgb(16_185_129/0.5)] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
              >
                {attendanceLoading
                  ? "Loading..."
                  : "View Attendance"}
              </button>


              <button
                onClick={endAttendance}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3 font-semibold text-white shadow-[0_4px_14px_-6px_rgb(225_29_72/0.5)] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading
                  ? "Ending..."
                  : "End Attendance Session"}
              </button>

            </div>

          </div>

        )}


        {/* =====================================
            ATTENDANCE RECORDS
        ===================================== */}

        {showAttendance && session && (

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Attendance Records
                </h2>

                <p className="mt-1 text-gray-500">
                  Total Records:{" "}
                  <span className="font-semibold text-green-600">
                    {attendances.length}
                  </span>
                </p>

              </div>

              <button
                onClick={() =>
                  getAttendanceRecords()
                }
                disabled={
                  attendanceLoading
                }
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Refresh
              </button>

            </div>


            {attendances.length === 0 ? (

              <div className="py-12 text-center">

                <p className="text-gray-500">
                  No students have marked attendance yet.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b bg-slate-50/80">

                      <th className="px-4 py-3">
                        Student Name
                      </th>

                      <th className="px-4 py-3">
                        Enrollment Number
                      </th>

                      <th className="px-4 py-3">
                        Roll Number
                      </th>

                      <th className="px-4 py-3">
                        Scan Time
                      </th>

                      <th className="px-4 py-3">
                        Status
                      </th>

                      <th className="px-4 py-3">
                        Method
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {attendances.map(
                      (attendance) => (<tr key={attendance.id}
                          className="border-b transition hover:bg-slate-50"
                        >

                          <td className="px-4 py-4 font-medium">
                            {attendance.student
                              ?.user?.name ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            {attendance.student
                              ?.enrollmentNumber ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            {attendance.student
                              ?.rollNumber ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            {attendance.scanTime
                              ? new Date(
                                  attendance.scanTime
                                ).toLocaleString()
                              : "—"}
                          </td>

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                attendance.status ===
                                "PRESENT"
                                  ? "bg-green-100 text-green-700"
                                  : attendance.status ===
                                    "LATE"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {attendance.status}
                            </span>

                          </td>

                          <td className="px-4 py-4">
                            {attendance.method}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}


        {/* =====================================
            MANUAL ATTENDANCE
        ===================================== */}

        {showAttendance && session && (

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Manual Attendance
            </h2>

            {studentsLoading ? (

              <p className="text-gray-500">
                Loading students...
              </p>

            ) : students.length === 0 ? (

              <p className="text-gray-500">
                No students found for this section.
              </p>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b bg-slate-50/80">

                      <th className="px-4 py-3">
                        Student Name
                      </th>

                      <th className="px-4 py-3">
                        Enrollment Number
                      </th>

                      <th className="px-4 py-3">
                        Roll Number
                      </th>

                      <th className="px-4 py-3">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map(
                      (student) => {

                        const existingAttendance =
                          attendances.find(
                            (attendance) =>
                              attendance.studentId ===
                              student.userId
                          );

                        return (

                          <tr
                            key={student.userId}
                            className="border-b transition hover:bg-slate-50"
                          >

                            <td className="px-4 py-4 font-medium">
                              {student.user
                                ?.name ||
                                "—"}
                            </td>

                            <td className="px-4 py-4">
                              {student.enrollmentNumber ||
                                "—"}
                            </td>

                            <td className="px-4 py-4">
                              {student.rollNumber ||
                                "—"}
                            </td>

                            <td className="px-4 py-4">

                              {existingAttendance ? (

                                <div className="flex items-center gap-3">

                                  <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                      existingAttendance.status ===
                                      "PRESENT"
                                        ? "bg-green-100 text-green-700"
                                        : existingAttendance.status ===
                                          "LATE"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {
                                      existingAttendance.status
                                    }
                                  </span>

                                  <span className="text-xs text-gray-500">
                                    {
                                      existingAttendance.method
                                    }
                                  </span>

                                </div>

                              ) : (

                                <div className="flex flex-wrap gap-2">

                                  <button
                                    onClick={() =>
                                      markManualAttendance(
                                        student.userId,
                                        "PRESENT"
                                      )
                                    }
                                    disabled={
                                      loading
                                    }
                                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                  >
                                    Present
                                  </button>


                                  <button
                                    onClick={() =>
                                      markManualAttendance(
                                        student.userId,
                                        "LATE"
                                      )
                                    }
                                    disabled={
                                      loading
                                    }
                                    className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600 disabled:opacity-50"
                                  >
                                    Late
                                  </button>


                                  <button
                                    onClick={() =>
                                      markManualAttendance(
                                        student.userId,
                                        "ABSENT"
                                      )
                                    }
                                    disabled={
                                      loading
                                    }
                                    className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                                  >
                                    Absent
                                  </button>

                                </div>

                              )}

                            </td>

                          </tr>

                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}


        {/* =====================================
            MESSAGE
        ===================================== */}

        {message && (

          <div className="mt-6 rounded-xl border border-slate-200/70 bg-white p-4 text-center shadow-soft">

            <p className="text-gray-700">
              {message}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;