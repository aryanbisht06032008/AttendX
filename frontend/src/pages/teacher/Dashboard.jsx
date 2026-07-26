import { useEffect, useState } from "react";
import api from "../../api/axios";

function Dashboard() {
  // =====================================
  // TEACHER ASSIGNMENTS
  // =====================================

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState("");

  const [assignmentLoading, setAssignmentLoading] =
    useState(true);

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
  const [attendanceLoading, setAttendanceLoading] =
    useState(false);

  const [showAttendance, setShowAttendance] =
    useState(false);

  // =====================================
  // STUDENTS
  // =====================================

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] =
    useState(false);

  // =====================================
  // GET TEACHER ASSIGNMENTS
  // =====================================

  const getMyAssignments = async () => {
    try {
      setAssignmentLoading(true);

      const response = await api.get(
        "/teachers/my-assignments"
      );

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Start an attendance session and display
            the QR code for students.
          </p>
        </div>


        {/* =====================================
            START SESSION
        ===================================== */}

        {!session && (
          <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-semibold mb-4">
              Start Attendance
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject & Section
            </label>

            {assignmentLoading ? (
              <p className="text-gray-500 mb-4">
                Loading your assignments...
              </p>
            ) : assignments.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4 mb-4">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
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
          <div className="bg-white rounded-xl shadow-md p-6 text-center">

            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Attendance Session Active
            </h2>

            <p className="text-gray-600 mb-6">
              Students can scan this QR code
              to mark their attendance.
            </p>


            {/* QR CODE */}

            {qrCode ? (
              <div className="flex justify-center mb-6">
                <img
                  src={qrCode}
                  alt="Attendance QR Code"
                  className="w-72 h-72 border p-4 rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4 mb-6">
                QR Code is being restored...
              </div>
            )}


            {/* SESSION INFORMATION */}

            <div className="text-left max-w-xl mx-auto">

              <p className="text-sm text-gray-500 mb-2">
                Subject
              </p>

              <p className="font-semibold mb-4">
                {session.teacherAssignment
                  ?.subject?.name ||
                  "—"}
              </p>


              <p className="text-sm text-gray-500 mb-2">
                Section
              </p>

              <p className="font-semibold mb-4">
                {session.teacherAssignment
                  ?.section?.name ||
                  session.teacherAssignment
                    ?.section?.code ||
                  "—"}
              </p>


              <p className="text-sm text-gray-500 mb-2">
                Session ID
              </p>

              <p className="font-mono text-xs break-all bg-gray-100 p-3 rounded-lg mb-6">
                {session.id}
              </p>

            </div>


            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() =>
                  getAttendanceRecords()
                }
                disabled={
                  attendanceLoading
                }
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {attendanceLoading
                  ? "Loading..."
                  : "View Attendance"}
              </button>


              <button
                onClick={endAttendance}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
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
          <div className="bg-white rounded-xl shadow-md mt-8 p-6">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Attendance Records
                </h2>

                <p className="text-gray-500 mt-1">
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
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Refresh
              </button>

            </div>


            {attendances.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No students have marked attendance yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b bg-gray-50">

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
                      (attendance) => (
                        <tr
                          key={attendance.id}
                          className="border-b hover:bg-gray-50"
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
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="bg-white rounded-xl shadow-md mt-8 p-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
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
                    <tr className="border-b bg-gray-50">

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
                            className="border-b"
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
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                                <div className="flex gap-2">

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
                                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
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
                                    className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
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
                                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
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
          <div className="mt-6 bg-white rounded-lg shadow p-4 text-center">

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