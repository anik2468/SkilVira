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
  FiX,
} from "react-icons/fi";

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

const RecruiterSidebar = ({
  mobileOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Recruiter";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/", { replace: true });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          bg-[#0F172A] text-white
          shadow-[12px_0_40px_rgba(15,23,42,0.18)]
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Brand */}
        <div className="flex h-[82px] items-center justify-between border-b border-slate-700/70 px-6">
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-white">
                Skil
              </span>
              <span className="text-[#D4AF37]">
                Vira
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Recruiter Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Recruitment
          </p>

          <div className="space-y-1.5">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-2xl px-4 py-3",
                    "text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                        ${
                          isActive
                            ? "bg-black/10 text-black"
                            : "bg-slate-800 text-slate-400 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="truncate">
                      {item.title}
                    </span>

                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-black" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-slate-700/70 p-4">
          <div className="mb-3 rounded-2xl bg-slate-800/70 p-3">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-black text-black">
                  {initials || "R"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">
                  {displayName}
                </p>

                <p className="text-xs font-medium text-slate-400">
                  Recruiter
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800">
              <FiLogOut size={17} />
            </span>

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default RecruiterSidebar;