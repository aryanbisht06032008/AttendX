import api from "./api";

// ===============================
// ATTENDANCE SESSION
// ===============================

// Start attendance session
export const startAttendanceSession = async (
  teacherAssignmentId
) => {
  const response = await api.post(
    "/attendance-sessions/start",
    {
      teacherAssignmentId,
    }
  );

  return response.data;
};

// End attendance session
export const endAttendanceSession = async (
  sessionId
) => {
  const response = await api.post(
    `/attendance-sessions/end/${sessionId}`
  );

  return response.data;
};

// Get all attendance sessions
export const getAttendanceSessions = async () => {
  const response = await api.get(
    "/attendance-sessions"
  );

  return response.data;
};


// ===============================
// ATTENDANCE
// ===============================

// Student scans QR
export const scanAttendance = async (
  qrToken
) => {
  const response = await api.post(
    "/attendance/scan",
    {
      qrToken,
    }
  );

  return response.data;
};

// Get attendance for a session
export const getSessionAttendance = async (
  sessionId
) => {
  const response = await api.get(
    `/attendance/session/${sessionId}`
  );

  return response.data;
};