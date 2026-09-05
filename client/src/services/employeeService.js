import api from "./api";


// ================================
// Employee Dashboard
// ================================
export const getEmployeeDashboard = async (
  userId
) => {
  const { data } = await api.get(
    `/employee/dashboard/${userId}`
  );

  return data;
};


// ================================
// Pending Recruiters
// ================================
export const getPendingRecruiters = async () => {
  const { data } = await api.get(
    "/employee/recruiters/pending"
  );

  return data;
};


// ================================
// Approve Recruiter
// ================================
export const approveRecruiter = async (
  id
) => {
  const { data } = await api.put(
    `/employee/recruiters/approve/${id}`
  );

  return data;
};


// ================================
// Reject Recruiter
// ================================
export const rejectRecruiter = async (
  id
) => {
  const { data } = await api.put(
    `/employee/recruiters/reject/${id}`
  );

  return data;
};


// ================================
// Pending Internships
// ================================
export const getPendingInternships =
async () => {

  const { data } = await api.get(
    "/employee/internships/pending"
  );

  return data;
};


// ================================
// Approve Internship
// ================================
export const approveInternship = async (
  id
) => {

  const { data } = await api.put(
    `/employee/internships/approve/${id}`
  );

  return data;
};


// ================================
// Reject Internship
// ================================
export const rejectInternship = async (
  id
) => {

  const { data } = await api.put(
    `/employee/internships/reject/${id}`
  );

  return data;
};