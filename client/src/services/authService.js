import api from "./api";


// =====================================================
// AUTH SERVICE
// =====================================================


// ======================================
// Login
// ======================================

export const login = async (body) => {
  if (!body) {
    throw new Error(
      "Login data is required"
    );
  }

  const { data } = await api.post(
    "/auth/login",
    body
  );

  return data;
};


// ======================================
// Register
// ======================================

export const register = async (body) => {
  if (!body) {
    throw new Error(
      "Registration data is required"
    );
  }

  const { data } = await api.post(
    "/auth/register",
    body
  );

  return data;
};


// ======================================
// Logout
// ======================================

export const logout = async () => {
  try {
    const { data } = await api.post(
      "/auth/logout"
    );

    return data;
  } catch (error) {
    // Local session can still be cleared even
    // when backend logout endpoint is unavailable.
    console.error(
      "Logout API error:",
      error?.response?.data || error.message
    );

    return {
      success: true,
      message: "Logged out locally",
    };
  }
};


// ======================================
// Get Current User
// ======================================

export const getCurrentUser = async () => {
  const { data } = await api.get(
    "/auth/me"
  );

  return data;
};


// ======================================
// Forgot Password
// ======================================

export const forgotPassword = async (
  email
) => {
  if (!email) {
    throw new Error(
      "Email is required"
    );
  }

  const { data } = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return data;
};


// ======================================
// Reset Password
// ======================================

export const resetPassword = async (
  token,
  password
) => {
  if (!token) {
    throw new Error(
      "Reset token is required"
    );
  }

  if (!password) {
    throw new Error(
      "Password is required"
    );
  }

  const { data } = await api.post(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );

  return data;
};


// ======================================
// Change Password
// ======================================

export const changePassword = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Password data is required"
    );
  }

  const { data } = await api.put(
    "/auth/change-password",
    body
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
};