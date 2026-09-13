import api from "./api";


// =====================================================
// STUDENT PROFILE SERVICE
// =====================================================


// ======================================
// Get Profile
// Existing function preserved
// ======================================

export const getStudentProfile = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/student-profile/${userId}`
  );

  return data;
};


// ======================================
// Create / Update Profile
// Existing function preserved
// ======================================

export const saveStudentProfile = async (
  userId,
  body
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "Profile data is required"
    );
  }

  const { data } = await api.post(
    `/student-profile/${userId}`,
    body
  );

  return data;
};


// ======================================
// Delete Profile
// Existing function preserved
// ======================================

export const deleteStudentProfile = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.delete(
    `/student-profile/${userId}`
  );

  return data;
};


// =====================================================
// PROFILE HELPERS
// =====================================================


// ======================================
// Get Logged-in Student Profile
// ======================================

export const getMyStudentProfile = async () => {
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  const userId =
    user?.id ||
    user?._id ||
    user?.userId;

  if (!userId) {
    throw new Error(
      "Logged-in student ID not found"
    );
  }

  return getStudentProfile(userId);
};


// ======================================
// Save Logged-in Student Profile
// ======================================

export const saveMyStudentProfile = async (
  body
) => {
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  const userId =
    user?.id ||
    user?._id ||
    user?.userId;

  if (!userId) {
    throw new Error(
      "Logged-in student ID not found"
    );
  }

  return saveStudentProfile(
    userId,
    body
  );
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getStudentProfile,
  saveStudentProfile,
  deleteStudentProfile,
  getMyStudentProfile,
  saveMyStudentProfile,
};