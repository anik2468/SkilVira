import api from "./api";

// ======================================
// Student
// ======================================

// Apply Internship
export const applyInternship = async (body) => {
  const { data } = await api.post(
    "/applications/apply",
    body
  );

  return data;
};

// Student Applications
export const getMyApplications = async (
  studentId
) => {
  const { data } = await api.get(
    `/applications/student/${studentId}`
  );

  return data;
};

// Withdraw Application
export const withdrawApplication = async (
  id
) => {
  const { data } = await api.delete(
    `/applications/${id}`
  );

  return data;
};

// ======================================
// Recruiter
// ======================================

// Recruiter Applications
export const getRecruiterApplications = async (
  recruiterId
) => {
  const { data } = await api.get(
    `/applications/recruiter/${recruiterId}`
  );

  return data;
};

// Recruiter Dashboard Stats
export const getRecruiterApplicationStats =
  async (recruiterId) => {
    const { data } = await api.get(
      `/applications/recruiter/stats/${recruiterId}`
    );

    return data;
  };

// Single Application
export const getApplicationDetails =
  async (id) => {
    const { data } = await api.get(
      `/applications/details/${id}`
    );

    return data;
  };

// Update Status
export const updateApplicationStatus =
  async (id, body) => {
    const { data } = await api.put(
      `/applications/status/${id}`,
      body
    );

    return data;
  };

// ======================================
// Admin / Employee / Control
// ======================================

// All Applications
export const getAllApplications =
  async () => {
    const { data } = await api.get(
      "/applications"
    );

    return data;
  };