import React from "react";
import { Navigate, useLocation } from "react-router-dom";


// =====================================================
// PROTECTED ROUTE
// =====================================================

const ProtectedRoute = ({
  children,
  allowedRole,
  allowedRoles,
}) => {
  const location = useLocation();

  let user = null;

  // ======================================
  // Read Logged-in User
  // ======================================

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );

    user = null;
  }


  // ======================================
  // Authentication Check
  // ======================================

  if (!user) {
    return (
      <Navigate
        to="/choose-role"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  // ======================================
  // Token Check
  // ======================================

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to="/choose-role"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  // ======================================
  // Allowed Roles
  // ======================================

  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRole
    ? [allowedRole]
    : [];


  // ======================================
  // Role Check
  // ======================================

  if (
    roles.length > 0 &&
    !roles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // ======================================
  // Recruiter / Ambassador Approval
  // ======================================

  if (
    (user.role === "recruiter" ||
      user.role === "ambassador") &&
    user.isApproved === false
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-2xl">
            ⏳
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Account Under Review
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your account has been registered successfully
            and is waiting for approval from the SkilVira
            team.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");

              sessionStorage.removeItem("token");
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("user");

              window.location.href = "/";
            }}
            className="mt-6 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  // ======================================
  // Inactive / Suspended Account
  // ======================================

  if (
    user.isActive === false ||
    user.status === "blocked" ||
    user.status === "suspended"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Account Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your account is currently inactive or restricted.
            Please contact the SkilVira team for assistance.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");

              sessionStorage.removeItem("token");
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("user");

              window.location.href = "/";
            }}
            className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  // ======================================
  // Authorized
  // ======================================

  return children;
};


export default ProtectedRoute;