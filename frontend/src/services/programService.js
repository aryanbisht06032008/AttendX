import api from "./api";

// Get all programs
export const getPrograms = async () => {
  const response = await api.get("/programs");
  return response.data;
};

// Create a new program
export const createProgram = async (programData) => {
  const response = await api.post("/programs", programData);
  return response.data;
};

// Get a single program
export const getProgramById = async (id) => {
  const response = await api.get(`/programs/${id}`);
  return response.data;
};

// Update a program
export const updateProgram = async (id, programData) => {
  const response = await api.put(
    `/programs/${id}`,
    programData
  );

  return response.data;
};

// Deactivate a program
export const deleteProgram = async (id) => {
  const response = await api.delete(
    `/programs/${id}`
  );

  return response.data;
};