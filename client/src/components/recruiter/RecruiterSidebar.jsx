import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPlusCircle,
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiGrid,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const RecruiterSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const menu = [
    {
      title: "Dashboard",
      path: "/recruiter/dashboard",
      icon: <FiHome />,
    },
    {
      title: "Post Internship",
      path: "/recruiter/internships/create",
      icon: <FiPlusCircle />,
    },
    {
      title: "Manage Internships",
      path: "/recruiter/internships",
      icon: <FiBriefcase />,
    },
    {
      title: "Applications",
      path: "/recruiter/applications",
      icon: <FiFileText />,
    },
    {
      title: "Students",
      path: "/recruiter/students",
      icon: <FiUsers />,
    },
    {
      title: "Company Profile",
      path: "/recruiter/company",
      icon: <FiGrid />,
    },
    {
      title: "Settings",
      path: "/recruiter/settings",
      icon: <FiSettings />,
    },
  ];

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-[#0F172A] text-white">

      <div className="border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold">
          Skil<span className="text-[#D4AF37]">Vira</span>
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Recruiter Portal
        </p>
      </div>

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
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold hover:bg-red-600"
        >
          <FiLogOut />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default RecruiterSidebar;