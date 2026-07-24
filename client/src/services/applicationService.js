import api from "./api";

export const applyInternship = async (body) => {
  const { data } = await api.post("/applications", body);
  return data;
};

export const getMyApplications = async (studentId) => {
  const { data } = await api.get(`/applications/student/${studentId}`);
  return data;
};