import api from "./api";

// ======================================
// Recruiter Dashboard
// ======================================
export const recruiterDashboard = async (
  userId
) => {
  const { data } = await api.get(
    `/recruiter/dashboard/${userId}`
  );

  return data;
};

// Backward Compatibility
export const getDashboard =
  recruiterDashboard;

// ======================================
// Recruiter Profile
// ======================================
export const getRecruiterProfile =
  async (userId) => {
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
    const { data } = await api.post(
      `/recruiter/${userId}`,
      body
    );

    return data;
  };

// ======================================
// Company Profile
// ======================================
export const getCompanyProfile =
  getRecruiterProfile;

export const saveCompanyProfile =
  saveRecruiterProfile;