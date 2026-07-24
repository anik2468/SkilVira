import api from "./api";

export const getInternships = async () => {
  const { data } = await api.get("/internships");
  return data;
};

export const getInternship = async (id) => {
  const { data } = await api.get(`/internships/${id}`);
  return data;
};

export const createInternship = async (body) => {
  const { data } = await api.post("/internships", body);
  return data;
};

export const updateInternship = async (id, body) => {
  const { data } = await api.put(`/internships/${id}`, body);
  return data;
};

export const deleteInternship = async (id) => {
  const { data } = await api.delete(`/internships/${id}`);
  return data;
};
export const getInternshipById = async (id) => {
  const { data } = await api.get(`/internships/${id}`);
  return data;
};