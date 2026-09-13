import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiBriefcase,
  FiFileText,
  FiHeart,
  FiUser,
  FiEdit,
  FiBell,
  FiSettings,
  FiLogOut,
  FiBookOpen,
  FiClock,
  FiAward,
  FiFolder,
  FiChevronRight,
} from "react-icons/fi";

import { getDashboardStats } from "../../services/dashboardService";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadProfileStrength();
  }, []);

  const loadProfileStrength = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const userId = user?.id || user?._id;

      if (!userId) {
        setProfileCompletion(0);
        return;
      }

      const response = await getDashboardStats(userId);

      const completion = Number(
        response?.stats?.profileCompletion || 0
      );

      setProfileCompletion(
        Math.max(0, Math.min(100, completion))
      );
    } catch (error) {
      console.error(
        "Failed to load profile completion:",
        error
      );
      setProfileCompletion(0);
    } finally {
      setLoadingProfile(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const menu = [
    {
      title: "Dashboard",
      path: "/student/dashboard",
      icon: <FiHome />,
    },

    {
      title: "My Courses",
      path: "/student/my-courses",
      icon: <FiBookOpen />,
    },

    {
      title: "Browse Internships",
      path: "/student/internships",
      icon: <FiBriefcase />,
    },

    {
      title: "My Applications",
      path: "/student/applications",
      icon: <FiFileText />,
    },

    {
      title: "My Status",
      path: "/student/status",
      icon: <FiClock />,
    },

    {
      title: "Offer Letters",
      path: "/student/offer-letters",
      icon: <FiFileText />,
    },

    {
      title: "Certificates",
      path: "/student/certificates",
      icon: <FiAward />,
    },

    {
      title: "My Documents",
      path: "/student/my-documents",
      icon: <FiFolder />,
    },

    {
      title: "Saved Internships",
      path: "/student/saved",
      icon: <FiHeart />,
    },

    {
      title: "My Profile",
      path: "/student/profile",
      icon: <FiUser />,
    },

    {
      title: "Edit Profile",
      path: "/student/profile/edit",
      icon: <FiEdit />,
    },

    {
      title: "Notifications",
      path: "/student/notifications",
      icon: <FiBell />,
    },

    {
      title: "Settings",
      path: "/student/settings",
      icon: <FiSettings />,
    },
  ];

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-[#0F172A] text-white">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold">
          Skil<span className="text-[#D4AF37]">Vira</span>
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Student Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              [
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#D4AF37] text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}

                <span className="flex w-6 shrink-0 justify-center text-lg">
                  {item.icon}
                </span>

                <span className="flex-1 truncate">
                  {item.title}
                </span>

                <FiChevronRight
                  size={14}
                  className={
                    isActive
                      ? "opacity-100"
                      : "opacity-0 transition group-hover:opacity-50"
                  }
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Strength */}
      <div className="mx-4 mb-4 rounded-2xl bg-slate-800 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            Profile Strength
          </span>

          <span className="font-bold text-[#D4AF37]">
            {loadingProfile ? "..." : `${profileCompletion}%`}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-[#D4AF37] transition-all duration-500"
            style={{
              width: `${profileCompletion}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Complete your profile to improve your chances of
          getting shortlisted.
        </p>

        {profileCompletion < 100 && (
          <NavLink
            to="/student/profile/edit"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-yellow-300"
          >
            Complete Profile
            <FiChevronRight size={13} />
          </NavLink>
        )}

        {profileCompletion >= 100 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-400">
            <span>✓</span>
            Profile complete
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-600 active:scale-[0.98]"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;