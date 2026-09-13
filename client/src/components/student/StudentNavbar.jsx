import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiBell,
  FiChevronDown,
  FiEdit,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import NotificationBell from "../NotificationBell";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    loadUser();

    const handleStorage = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const loadUser = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      setUser(storedUser);
    } catch (error) {
      console.error("Failed to load student user:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    setProfileOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  const firstLetter = (
    user?.name ||
    "Student"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 hidden border-b border-gray-200 bg-white lg:block">
      <div className="flex min-h-[78px] items-center justify-between gap-6 px-6">
        {/* Left */}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Student Portal
          </p>

          <h2 className="mt-1 truncate text-2xl font-bold text-gray-900">
            Welcome
            {user?.name ? `, ${user.name}` : ", Student"} 👋
          </h2>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Notification */}
          <div className="relative">
            <NotificationBell />
          </div>

          {/* Divider */}
          <div className="hidden h-9 w-px bg-gray-200 sm:block" />

          {/* Profile */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-gray-50"
              aria-expanded={profileOpen}
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 font-bold text-[#9B7B16]">
                {firstLetter}
              </div>

              {/* User info */}
              <div className="hidden text-left xl:block">
                <p className="max-w-[150px] truncate text-sm font-bold text-gray-900">
                  {user?.name || "Student"}
                </p>

                <p className="max-w-[150px] truncate text-xs text-gray-500">
                  {user?.email || "Student Account"}
                </p>
              </div>

              <FiChevronDown
                size={17}
                className={`text-gray-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                {/* Dropdown Header */}
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 font-bold text-[#9B7B16]">
                      {firstLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">
                        {user?.name || "Student"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user?.email || "Student Account"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="p-2">
                  <ProfileMenuItem
                    icon={<FiUser />}
                    label="My Profile"
                    to="/student/profile"
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    icon={<FiEdit />}
                    label="Edit Profile"
                    to="/student/profile/edit"
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    icon={<FiBell />}
                    label="Notifications"
                    to="/student/notifications"
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    icon={<FiSettings />}
                    label="Settings"
                    to="/student/settings"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                      <FiLogOut size={16} />
                    </span>

                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const ProfileMenuItem = ({
  icon,
  label,
  to,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#D4AF37]/10 hover:text-[#8B6E12]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </span>

      {label}
    </Link>
  );
};

export default StudentNavbar;