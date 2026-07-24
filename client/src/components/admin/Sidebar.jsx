import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiAward,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const menu = [
  {
    name: "Dashboard",
    icon: <FiGrid />,
    path: "/admin/dashboard",
  },
  {
    name: "Internships",
    icon: <FiBriefcase />,
    path: "/admin/internships",
  },
  {
    name: "Students",
    icon: <FiUsers />,
    path: "/admin/students",
  },
  {
    name: "Recruiters",
    icon: <FiUsers />,
    path: "/admin/recruiters",
  },
  {
    name: "Colleges",
    icon: <FiBookOpen />,
    path: "/admin/colleges",
  },
  {
    name: "Applications",
    icon: <FiFileText />,
    path: "/admin/applications",
  },
  {
    name: "Certificates",
    icon: <FiAward />,
    path: "/admin/certificates",
  },
  {
    name: "Settings",
    icon: <FiSettings />,
    path: "/admin/settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-72 border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">
          <span className="text-[#D4AF37]">Skil</span>vira
        </h1>

        <p className="text-sm text-gray-500">
          Admin Panel
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-[#D4AF37] text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-5 w-72 px-4">
        <button className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 hover:bg-red-50">
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;