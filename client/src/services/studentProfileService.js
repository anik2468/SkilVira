import api from "./api";

// ===============================
// Get Student Profile
// ===============================
export const getStudentProfile = async (userId) => {
  const { data } = await api.get(
    `/student-profile/${userId}`
  );

  return data;
};

// ===============================
// Create Student Profile
// ===============================
export const createStudentProfile = async (body) => {
  const { data } = await api.post(
    "/student-profile",
    body
  );

  return data;
};

// ===============================
// Update Student Profile
// ===============================
export const updateStudentProfile = async (
  userId,
  body
) => {
  const { data } = await api.put(
    `/student-profile/${userId}`,
    body
  );

  return data;
};