import api from "./api";

// ======================================
// Get All Users
// ======================================
export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// ======================================
// Pending Recruiters
// ======================================
export const getPendingRecruiters = async () => {
  const { data } = await api.get(
    "/users/recruiters/pending"
  );
  return data;
};

// ======================================
// Approve Recruiter
// ======================================
export const approveRecruiter = async (
  id
) => {
  const { data } = await api.put(
    `/users/recruiters/approve/${id}`
  );
  return data;
};

// ======================================
// Reject Recruiter
// ======================================
export const rejectRecruiter = async (
  id
) => {
  const { data } = await api.put(
    `/users/recruiters/reject/${id}`
  );
  return data;
};

// ======================================
// Block User
// ======================================
export const blockUser = async (id) => {
  const { data } = await api.put(
    `/users/block/${id}`
  );
  return data;
};

// ======================================
// Unblock User
// ======================================
export const unblockUser = async (
  id
) => {
  const { data } = await api.put(
    `/users/unblock/${id}`
  );
  return data;
};

// ======================================
// Delete User
// ======================================
export const deleteUser = async (id) => {
  const { data } = await api.delete(
    `/users/${id}`
  );
  return data;
};