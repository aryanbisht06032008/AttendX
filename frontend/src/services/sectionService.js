import api from "./api";

// Get sections
// If programId is provided, only sections of that program are returned
export const getSections = async (programId = null) => {
  const response = await api.get("/sections", {
    params: programId ? { programId } : {},
  });

  return response.data;
};

// Create section
export const createSection = async (sectionData) => {
  const response = await api.post(
    "/sections",
    sectionData
  );

  return response.data;
};