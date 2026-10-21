import { API_URL } from "./urlConfig.js";
import axios from "axios";


// =====================================================
// AXIOS API INSTANCE
// =====================================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    API_URL,

  withCredentials: true,

  timeout: 15000,
});


// =====================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// Handle unauthorized session
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error?.response?.status;

    if (status === 401) {
      console.warn(
        "Authentication expired or unauthorized."
      );

      // Do not force redirect from API layer.
      // ProtectedRoute / individual pages can handle navigation.
    }

    return Promise.reject(error);
  }
);


export default api;