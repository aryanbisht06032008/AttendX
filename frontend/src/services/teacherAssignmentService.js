import api from "./api";

export const getTeacherAssignments = async () => {
  const response = await api.get("/teacher-assignments");
  return response.data;
};

export const createTeacherAssignment = async (data) => {
  const response = await api.post(
    "/teacher-assignments",
    data
  );

  return response.data;
};

export const deleteTeacherAssignment = async (id) => {
  const response = await api.delete(
    `/teacher-assignments/${id}`
  );

  return response.data;
};