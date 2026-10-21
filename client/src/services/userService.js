import api from "./api";

// =====================================================
// USER SERVICE
// =====================================================

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const getUserById = async (id) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const getPendingRecruiters = async () => {
  const { data } = await api.get(
    "/users/recruiters/pending"
  );

  return data;
};

export const approveRecruiter = async (id) => {
  if (!id) {
    throw new Error("Recruiter ID is required.");
  }

  const { data } = await api.put(
    `/users/recruiters/approve/${id}`
  );

  return data;
};

export const rejectRecruiter = async (id) => {
  if (!id) {
    throw new Error("Recruiter ID is required.");
  }

  const { data } = await api.put(
    `/users/recruiters/reject/${id}`
  );

  return data;
};

export const blockUser = async (id) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const { data } = await api.put(
    `/users/block/${id}`
  );

  return data;
};

export const unblockUser = async (id) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const { data } = await api.put(
    `/users/unblock/${id}`
  );

  return data;
};

export const deleteUser = async (id) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const { data } = await api.delete(
    `/users/${id}`
  );

  return data;
};

// Update supported profile fields only.
// Role and account status cannot be changed here.
export const updateUser = async (id, body) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  if (!body || typeof body !== "object") {
    throw new Error("Profile data is required.");
  }

  const { data } = await api.put(
    `/users/${id}`,
    body
  );

  return data;
};

export const getUsersByRole = async (role) => {
  if (!role) {
    throw new Error("Role is required.");
  }

  const { data } = await api.get(
    `/users/role/${encodeURIComponent(role)}`
  );

  return data;
};

export const changeUserStatus = async (
  id,
  status
) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  const { data } = await api.put(
    `/users/${id}/status`,
    { status }
  );

  return data;
};

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
};