import api from "./api";

// ======================================
// Public
// ======================================

// All Internships
export const getInternships = async (params = {}) => {
  const { data } = await api.get("/internships", {
    params,
  });

  return data;
};

// Internship Details
export const getInternshipById = async (id) => {
  const { data } = await api.get(
    `/internships/${id}`
  );

  return data;
};

// ======================================
// Recruiter
// ======================================

// Recruiter's Internships
export const getRecruiterInternships = async (
  recruiterId
) => {
  const { data } = await api.get(
    `/internships/recruiter/${recruiterId}`
  );

  return data;
};

// Create Internship
export const createInternship = async (body) => {
  const { data } = await api.post(
    "/internships",
    body
  );

  return data;
};

// Update Internship
export const updateInternship = async (
  id,
  body
) => {
  const { data } = await api.put(
    `/internships/${id}`,
    body
  );

  return data;
};

// Delete Internship
export const deleteInternship = async (id) => {
  const { data } = await api.delete(
    `/internships/${id}`
  );

  return data;
};

// ======================================
// Admin
// ======================================

// Approve Internship
export const approveInternship = async (id) => {
  const { data } = await api.put(
    `/internships/approve/${id}`
  );

  return data;
};

// Reject Internship
export const rejectInternship = async (id) => {
  const { data } = await api.put(
    `/internships/reject/${id}`
  );

  return data;
};

// Feature Internship
export const featureInternship = async (id) => {
  const { data } = await api.put(
    `/internships/feature/${id}`
  );

  return data;
};