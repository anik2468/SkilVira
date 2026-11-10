import api from "./api";

// =====================================================
// CONTROL / ADMIN SERVICE
// =====================================================

const validateId = (id, label = "ID") => {
  if (!id) {
    throw new Error(`${label} is required.`);
  }
};

const getUserList = (response) => {
  if (Array.isArray(response?.users)) {
    return response.users;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const isLimitedAdminPanel = () =>
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin");

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboardStats = async () => {
  const { data } = await api.get(
    "/control/dashboard"
  );

  return data;
};

// =====================================================
// USERS
// =====================================================

export const getUsers = async () => {
  const endpoint = isLimitedAdminPanel() ? "/admin/users" : "/control/users";
  const { data } = await api.get(endpoint);
  return data;
};

export const getUserById = async (id) => {
  validateId(id, "User ID");

  const { data } = await api.get(
    `/users/${id}`
  );

  return data;
};

export const deleteUser = async (id) => {
  validateId(id, "User ID");
  if (isLimitedAdminPanel()) {
    throw new Error("Only Super Admin can permanently delete user accounts.");
  }
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const blockUser = async (id) => {
  validateId(id, "User ID");
  if (isLimitedAdminPanel()) {
    const { data } = await api.patch(`/admin/users/${id}`, { status: "blocked" });
    return data;
  }
  const { data } = await api.put(`/users/block/${id}`);
  return data;
};

export const unblockUser = async (id) => {
  validateId(id, "User ID");
  if (isLimitedAdminPanel()) {
    const { data } = await api.patch(`/admin/users/${id}`, { status: "active" });
    return data;
  }
  const { data } = await api.put(`/users/unblock/${id}`);
  return data;
};

// =====================================================
// INTERNSHIPS
// =====================================================

export const getInternships = async (params = {}) => {
  const { data } = await api.get(
    "/internships",
    { params }
  );

  return data;
};

export const approveInternship = async (id) => {
  validateId(id, "Internship ID");
  const endpoint = isLimitedAdminPanel()
    ? `/admin/internships/${id}/approve`
    : `/control/internships/${id}/approve`;
  const { data } = await api.put(endpoint);
  return data;
};

export const rejectInternship = async (id) => {
  validateId(id, "Internship ID");
  const endpoint = isLimitedAdminPanel()
    ? `/admin/internships/${id}/reject`
    : `/control/internships/${id}/reject`;
  const { data } = await api.put(endpoint);
  return data;
};

export const deleteInternship = async (id) => {
  validateId(id, "Internship ID");

  const { data } = await api.delete(
    `/internships/${id}`
  );

  return data;
};

// =====================================================
// RECRUITERS
// =====================================================

export const approveRecruiter = async (id) => {
  validateId(id, "Recruiter ID");
  const endpoint = isLimitedAdminPanel()
    ? `/admin/recruiters/${id}/approve`
    : `/users/recruiters/approve/${id}`;
  const { data } = await api.put(endpoint);
  return data;
};

export const rejectRecruiter = async (id) => {
  validateId(id, "Recruiter ID");
  const endpoint = isLimitedAdminPanel()
    ? `/admin/recruiters/${id}/reject`
    : `/users/recruiters/reject/${id}`;
  const { data } = await api.put(endpoint);
  return data;
};

export const getRecruiters = async () => {
  const { data } = await api.get(
    "/users/role/recruiter"
  );

  return {
    ...data,
    recruiters: getUserList(data),
  };
};

// =====================================================
// STUDENTS
// =====================================================

export const getStudents = async () => {
  const { data } = await api.get(
    "/users/role/student"
  );

  return {
    ...data,
    students: getUserList(data),
  };
};

export const deleteStudent = async (id) => {
  validateId(id, "Student ID");
  return deleteUser(id);
};

// =====================================================
// APPLICATIONS
// =====================================================

export const getApplications = async () => {
  const { data } = await api.get(
    "/applications"
  );

  return data;
};

export const updateApplicationStatus = async (
  id,
  body
) => {
  validateId(id, "Application ID");

  if (!body || typeof body !== "object") {
    throw new Error("Application status data is required.");
  }

  const { data } = await api.put(
    `/applications/status/${id}`,
    body
  );

  return data;
};

// =====================================================
// CERTIFICATES
// =====================================================

export const getCertificates = async () => {
  const { data } = await api.get(
    "/certificates"
  );

  return data;
};

export const verifyCertificate = async (id) => {
  validateId(id, "Certificate ID");

  const { data } = await api.put(
    `/certificates/verify/id/${id}`
  );

  return data;
};

// =====================================================
// COLLEGES
// NOTE: The provided backend ZIP does not contain a
// mounted /api/colleges implementation. These methods
// are retained for frontend compatibility.
// =====================================================

export const getColleges = async () => {
  const { data } = await api.get("/colleges");
  return data;
};

export const deleteCollege = async (id) => {
  validateId(id, "College ID");

  const { data } = await api.delete(
    `/colleges/${id}`
  );

  return data;
};

// =====================================================
// CONTROL SETTINGS
// NOTE: A matching settings endpoint must exist in
// the backend before these calls can work.
// =====================================================

export const getControlSettings = async () => {
  const { data } = await api.get(
    "/control/settings"
  );

  return data;
};

export const updateControlSettings = async (body) => {
  if (!body || typeof body !== "object") {
    throw new Error("Settings data is required.");
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