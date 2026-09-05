import api from "./api";


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
// Delete User
// ======================================
export const deleteUser = async (id) => {

  const { data } = await api.delete(
    `/control/users/${id}`
  );

  return data;

};




// ======================================
// Block User
// ======================================
export const blockUser = async (id) => {

  const { data } = await api.put(
    `/control/users/${id}/block`
  );

  return data;

};




// ======================================
// Unblock User
// ======================================
export const unblockUser = async (id) => {

  const { data } = await api.put(
    `/control/users/${id}/unblock`
  );

  return data;

};




// ======================================
// Internships
// ======================================
export const getInternships = async () => {

  const { data } = await api.get(
    "/control/internships"
  );

  return data;

};


export const approveInternship = async (id) => {

  const { data } = await api.put(
    `/control/internships/${id}/approve`
  );

  return data;

};


export const rejectInternship = async (id) => {

  const { data } = await api.put(
    `/control/internships/${id}/reject`
  );

  return data;

};




// ======================================
// Recruiters
// ======================================
export const approveRecruiter = async (id) => {

  const { data } = await api.put(
    `/control/recruiters/${id}/approve`
  );

  return data;

};


export const rejectRecruiter = async (id) => {

  const { data } = await api.put(
    `/control/recruiters/${id}/reject`
  );

  return data;

};