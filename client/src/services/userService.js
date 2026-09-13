import api from "./api";


// =====================================================
// USER SERVICE
// =====================================================


// ======================================
// Get All Users
// Existing function preserved
// ======================================

export const getAllUsers = async () => {
  const { data } = await api.get(
    "/users"
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
    `/users/${id}`
  );

  return data;
};


// ======================================
// Pending Recruiters
// Existing function preserved
// ======================================

export const getPendingRecruiters = async () => {
  const { data } = await api.get(
    "/users/recruiters/pending"
  );

  return data;
};


// ======================================
// Approve Recruiter
// Existing function preserved
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
    `/users/recruiters/approve/${id}`
  );

  return data;
};


// ======================================
// Reject Recruiter
// Existing function preserved
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
    `/users/recruiters/reject/${id}`
  );

  return data;
};


// ======================================
// Block User
// Existing function preserved
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
    `/users/block/${id}`
  );

  return data;
};


// ======================================
// Unblock User
// Existing function preserved
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
    `/users/unblock/${id}`
  );

  return data;
};


// ======================================
// Delete User
// Existing function preserved
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
    `/users/${id}`
  );

  return data;
};


// =====================================================
// USER MANAGEMENT HELPERS
// =====================================================


// ======================================
// Update User Profile
// ======================================

export const updateUser = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.put(
    `/users/${id}`,
    body
  );

  return data;
};


// ======================================
// Get Users By Role
// ======================================

export const getUsersByRole = async (
  role
) => {
  if (!role) {
    throw new Error(
      "Role is required"
    );
  }

  const { data } = await api.get(
    `/users/role/${role}`
  );

  return data;
};


// ======================================
// Change User Status
// ======================================

export const changeUserStatus = async (
  id,
  status
) => {
  if (!id) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.put(
    `/users/${id}/status`,
    {
      status,
    }
  );

  return data;
};


// ======================================
// Get Students
// ======================================

export const getStudents = async () => {
  const { data } = await api.get(
    "/users/students"
  );

  return data;
};


// ======================================
// Get Employees
// ======================================

export const getEmployees = async () => {
  const { data } = await api.get(
    "/users/employees"
  );

  return data;
};


// ======================================
// Get Ambassadors
// ======================================

export const getAmbassadors = async () => {
  const { data } = await api.get(
    "/users/ambassadors"
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getAllUsers,
  getUserById,

  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,

  blockUser,
  unblockUser,
  deleteUser,

  updateUser,
  getUsersByRole,
  changeUserStatus,

  getStudents,
  getEmployees,
  getAmbassadors,
};