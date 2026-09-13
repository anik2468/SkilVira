import api from "./api";


// =====================================================
// RECRUITER SERVICE
// =====================================================


// ======================================
// Recruiter Dashboard
// ======================================

export const recruiterDashboard = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/recruiter/dashboard/${userId}`
  );

  return data;
};


// ======================================
// Backward Compatibility
// ======================================

export const getDashboard =
  recruiterDashboard;


// ======================================
// Recruiter Profile
// ======================================

export const getRecruiterProfile =
  async (userId) => {
    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    const { data } = await api.get(
      `/recruiter/${userId}`
    );

    return data;
  };


// ======================================
// Save Recruiter Profile
// ======================================

export const saveRecruiterProfile =
  async (userId, body) => {
    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    if (!body) {
      throw new Error(
        "Recruiter profile data is required"
      );
    }

    const { data } = await api.post(
      `/recruiter/${userId}`,
      body
    );

    return data;
  };


// ======================================
// Company Profile
// Existing aliases preserved
// ======================================

export const getCompanyProfile =
  getRecruiterProfile;

export const saveCompanyProfile =
  saveRecruiterProfile;


// =====================================================
// RECRUITER INTERNSHIP HELPERS
// =====================================================


// ======================================
// Get Recruiter's Internships
// ======================================

export const getMyRecruiterInternships =
  async (recruiterId) => {
    if (!recruiterId) {
      throw new Error(
        "Recruiter ID is required"
      );
    }

    const { data } = await api.get(
      `/internships/recruiter/${recruiterId}`
    );

    return data;
  };


// ======================================
// Get Recruiter Applications
// ======================================

export const getMyRecruiterApplications =
  async (recruiterId) => {
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
// Recruiter Application Stats
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


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  recruiterDashboard,
  getDashboard,

  getRecruiterProfile,
  saveRecruiterProfile,

  getCompanyProfile,
  saveCompanyProfile,

  getMyRecruiterInternships,
  getMyRecruiterApplications,
  getRecruiterApplicationStats,
};