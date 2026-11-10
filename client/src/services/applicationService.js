import api from "./api";

const isLimitedAdminPanel = () =>
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin");


// =====================================================
// APPLICATION SERVICE
// =====================================================


// =====================================================
// STUDENT
// =====================================================


// ======================================
// Apply Internship
// ======================================

export const applyInternship = async (body) => {
  if (!body) {
    throw new Error(
      "Application data is required"
    );
  }

  const { data } = await api.post(
    "/applications/apply",
    body
  );

  return data;
};


// ======================================
// Student Applications
// ======================================

export const getMyApplications = async (
  studentId
) => {
  if (!studentId) {
    throw new Error(
      "Student ID is required"
    );
  }

  const { data } = await api.get(
    `/applications/student/${studentId}`
  );

  return data;
};


// ======================================
// Get Logged-in Student Applications
// ======================================

export const getMyStudentApplications = async () => {
  const { data } = await api.get(
    "/applications/me"
  );

  return data;
};


// ======================================
// Single Student Application
// ======================================

export const getMyApplicationById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Application ID is required"
    );
  }

  const { data } = await api.get(
    `/applications/details/${id}`
  );

  return data;
};


// ======================================
// Withdraw Application
// ======================================

export const withdrawApplication = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Application ID is required"
    );
  }

  const { data } = await api.delete(
    `/applications/${id}`
  );

  return data;
};


// =====================================================
// RECRUITER
// =====================================================


// ======================================
// Recruiter Applications
// ======================================

export const getRecruiterApplications = async (
  recruiterId
) => {
  if (!recruiterId) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.get(
    `/applications/recruiter/${recruiterId}`
  );

  return data;
};


// ======================================
// Recruiter Dashboard Stats
// ======================================

export const getRecruiterApplicationStats =
  async (recruiterId) => {
    if (!recruiterId) {
      throw new Error(
        "Recruiter ID is required"
      );
    }

    const { data } = await api.get(
      `/applications/recruiter/stats/${recruiterId}`
    );

    return data;
  };


// ======================================
// Single Application
// ======================================

export const getApplicationDetails =
  async (id) => {
    if (!id) {
      throw new Error(
        "Application ID is required"
      );
    }

    const endpoint = isLimitedAdminPanel()
      ? `/admin/applications/${id}`
      : `/applications/details/${id}`;
    const { data } = await api.get(endpoint);

    return data;
  };


// ======================================
// Update Application Status
// ======================================

export const updateApplicationStatus =
  async (id, body) => {
    if (!id) {
      throw new Error(
        "Application ID is required"
      );
    }

    if (!body) {
      throw new Error(
        "Application status data is required"
      );
    }

    if (isLimitedAdminPanel()) {
      const { data } = await api.patch(`/admin/applications/${id}/status`, body);
      return data;
    }

    const { data } = await api.put(`/applications/status/${id}`, body);

    return data;
  };


// =====================================================
// ADMIN / EMPLOYEE / CONTROL
// =====================================================


// ======================================
// All Applications
// ======================================

export const getAllApplications =
  async () => {
    const endpoint = isLimitedAdminPanel() ? "/admin/applications" : "/applications";
    const { data } = await api.get(endpoint);

    return data;
  };


// ======================================
// Delete Application
// ======================================

export const deleteApplication = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Application ID is required"
    );
  }

  const { data } = await api.delete(
    `/applications/${id}`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Student
  applyInternship,
  getMyApplications,
  getMyStudentApplications,
  getMyApplicationById,
  withdrawApplication,

  // Recruiter
  getRecruiterApplications,
  getRecruiterApplicationStats,
  getApplicationDetails,
  updateApplicationStatus,

  // Admin / Employee / Control
  getAllApplications,
  deleteApplication,
};