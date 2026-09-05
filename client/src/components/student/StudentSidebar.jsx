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
} from "react-icons/fi";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    {
      title: "Dashboard",
      path: "/student/dashboard",
      icon: <FiHome />,
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
      <nav className="flex-1 space-y-2 p-4">

        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-[#D4AF37] text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.title}</span>

          </NavLink>
        ))}

      </nav>

      {/* Profile Strength */}
      <div className="mx-4 mb-4 rounded-2xl bg-slate-800 p-4">

        <div className="mb-2 flex justify-between">

          <span className="text-sm">
            Profile Strength
          </span>

          <span className="font-bold text-[#D4AF37]">
            10%
          </span>

        </div>

        <div className="h-2 rounded-full bg-slate-700">

          <div
            className="h-2 rounded-full bg-[#D4AF37]"
            style={{ width: "10%" }}
          />

        </div>

        <p className="mt-3 text-xs text-slate-400">
          Complete your profile to improve your chances of getting shortlisted.
        </p>

      </div>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold transition hover:bg-red-600"
        >
          <FiLogOut />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default StudentSidebar;