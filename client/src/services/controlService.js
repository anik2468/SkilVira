import api from "./api";


// =====================================================
// CONTROL / ADMIN SERVICE
// =====================================================


// ======================================
// Control Dashboard
// ======================================

export const getDashboardStats = async () => {
  const { data } = await api.get(
    "/control/dashboard"
  );

  return data;
};


// ======================================
// Users
// ======================================

export const getUsers = async () => {
  const { data } = await api.get(
    "/control/users"
  );

  return data;
};


// ======================================
// Get User By ID
// ======================================

export const getUserById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/control/users/${id}`
  );

  return data;
};


// ======================================
// Delete User
// ======================================

export const deleteUser = async (
  id
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.delete(
    `/control/users/${id}`
  );

  return data;
};


// ======================================
// Block User
// ======================================

export const blockUser = async (
  id
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.put(
    `/control/users/${id}/block`
  );

  return data;
};


// ======================================
// Unblock User
// ======================================

export const unblockUser = async (
  id
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.put(
    `/control/users/${id}/unblock`
  );

  return data;
};


// =====================================================
// INTERNSHIPS
// =====================================================


// ======================================
// Get Internships
// ======================================

export const getInternships = async () => {
  const { data } = await api.get(
    "/control/internships"
  );

  return data;
};


// ======================================
// Approve Internship
// ======================================

export const approveInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/control/internships/${id}/approve`
  );

  return data;
};


// ======================================
// Reject Internship
// ======================================

export const rejectInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/control/internships/${id}/reject`
  );

  return data;
};


// ======================================
// Delete Internship
// ======================================

export const deleteInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.delete(
    `/control/internships/${id}`
  );

  return data;
};


// =====================================================
// RECRUITERS
// =====================================================


// ======================================
// Approve Recruiter
// ======================================

export const approveRecruiter = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.put(
    `/control/recruiters/${id}/approve`
  );

  return data;
};


// ======================================
// Reject Recruiter
// ======================================

export const rejectRecruiter = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.put(
    `/control/recruiters/${id}/reject`
  );

  return data;
};


// ======================================
// Get Recruiters
// ======================================

export const getRecruiters = async () => {
  const { data } = await api.get(
    "/control/recruiters"
  );

  return data;
};


// =====================================================
// STUDENTS
// =====================================================


// ======================================
// Get Students
// ======================================

export const getStudents = async () => {
  const { data } = await api.get(
    "/control/students"
  );

  return data;
};


// ======================================
// Delete Student
// ======================================

export const deleteStudent = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Student ID is required"
    );
  }

  const { data } = await api.delete(
    `/control/students/${id}`
  );

  return data;
};


// =====================================================
// APPLICATIONS
// =====================================================


// ======================================
// Get Applications
// ======================================

export const getApplications = async () => {
  const { data } = await api.get(
    "/control/applications"
  );

  return data;
};


// ======================================
// Update Application Status
// ======================================

export const updateApplicationStatus =
  async (
    id,
    body
  ) => {
    if (!id) {
      throw new Error(
        "Application ID is required"
      );
    }

    const { data } = await api.put(
      `/control/applications/${id}`,
      body
    );

    return data;
  };


// =====================================================
// CERTIFICATES
// =====================================================


// ======================================
// Get Certificates
// ======================================

export const getCertificates = async () => {
  const { data } = await api.get(
    "/control/certificates"
  );

  return data;
};


// ======================================
// Verify Certificate
// ======================================

export const verifyCertificate = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/control/certificates/${id}/verify`
  );

  return data;
};


// =====================================================
// UNIVERSITIES / COLLEGES
// =====================================================


// ======================================
// Get Colleges
// ======================================

export const getColleges = async () => {
  const { data } = await api.get(
    "/control/colleges"
  );

  return data;
};


// ======================================
// Delete College
// ======================================

export const deleteCollege = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.delete(
    `/control/colleges/${id}`
  );

  return data;
};


// =====================================================
// SETTINGS
// =====================================================


// ======================================
// Get Control Settings
// ======================================

export const getControlSettings = async () => {
  const { data } = await api.get(
    "/control/settings"
  );

  return data;
};


// ======================================
// Update Control Settings
// ======================================

export const updateControlSettings = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Settings data is required"
    );
  }

  const { data } = await api.put(
    "/control/settings",
    body
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getDashboardStats,

  getUsers,
  getUserById,
  deleteUser,
  blockUser,
  unblockUser,

  getInternships,
  approveInternship,
  rejectInternship,
  deleteInternship,

  approveRecruiter,
  rejectRecruiter,
  getRecruiters,

  getStudents,
  deleteStudent,

  getApplications,
  updateApplicationStatus,

  getCertificates,
  verifyCertificate,

  getColleges,
  deleteCollege,

  getControlSettings,
  updateControlSettings,
};