import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRole,
}) => {
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "Invalid user data in localStorage:",
      error
    );

    user = null;
  }

  // ======================================
  // Not Logged In
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
  // Role Protection
  // ======================================

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ======================================
  // Account Approval Protection
  // Recruiter / Ambassador
  // ======================================

  if (
    (user.role === "recruiter" ||
      user.role === "ambassador") &&
    user.isApproved === false
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-2xl text-[#D4AF37]">
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
  // Account Disabled
  // ======================================

  if (
    user.isActive === false ||
    user.status === "blocked" ||
    user.status === "suspended"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Account Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your account is currently inactive or
            restricted. Please contact the SkilVira team
            for assistance.
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