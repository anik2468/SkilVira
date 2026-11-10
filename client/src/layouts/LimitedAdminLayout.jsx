import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiLogOut,
  FiShield,
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiClipboard,
  FiBarChart2,
  FiUserCheck,
  FiMenu,
  FiX,
} from "react-icons/fi";

const LimitedAdminLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const logout = () => {
    ["token", "accessToken", "user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/admin/login", { replace: true });
  };

  const links = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
    { label: "Recruiters", path: "/admin/recruiters", icon: <FiBriefcase /> },
    { label: "Ambassadors", path: "/admin/ambassadors", icon: <FiAward /> },
    { label: "Internships", path: "/admin/internships", icon: <FiClipboard /> },
    { label: "Applications", path: "/admin/applications", icon: <FiUserCheck /> },
    { label: "Certificates", path: "/admin/certificates", icon: <FiAward /> },
    { label: "Courses & Lessons", path: "/admin/courses", icon: <FiBookOpen /> },
    { label: "Course Analytics", path: "/admin/course-analytics", icon: <FiBarChart2 /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-100 px-6 py-6">
          <div className="text-2xl font-black">
            <span className="text-[#D4AF37]">Skil</span>
            <span className="text-slate-900">vira</span>
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
            Admin Panel
          </p>
        </div>

        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#9A7B14]">
              <FiShield size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {user.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500">Platform Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "bg-[#FFF8E7] text-[#9A7B14]"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <span className="font-black text-slate-900">
            Skil<span className="text-[#D4AF37]">Vira</span> Admin
          </span>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LimitedAdminLayout;
