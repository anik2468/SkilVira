import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiCheckCircle,
  FiLogOut,
  FiX,
  FiCreditCard,
  FiAward,
  FiSettings,
  FiFilePlus,
  FiClipboard,
  FiLayers,
} from "react-icons/fi";

const menuSections = [
  {
    title: "Workspace",
    items: [
      {
        name: "Dashboard",
        path: "/employee/dashboard",
        icon: <FiGrid />,
      },
      {
        name: "Recruiter Approval",
        path: "/employee/recruiters",
        icon: <FiCheckCircle />,
      },
      {
        name: "Ambassador Approval",
        path: "/employee/ambassadors",
        icon: <FiUsers />,
      },
      {
        name: "Internship Approval",
        path: "/employee/internships",
        icon: <FiBriefcase />,
      },
    ],
  },

  {
    title: "Verification",
    items: [
      {
        name: "Payment Verification",
        path: "/employee/payment-verification",
        icon: <FiCreditCard />,
      },
      {
        name: "Offer Letter Verification",
        path: "/employee/offer-letters/verification",
        icon: <FiFileText />,
      },
      {
        name: "Certificate Verification",
        path: "/employee/certificates/verification",
        icon: <FiAward />,
      },
      {
        name: "Report Verification",
        path: "/employee/reports/verification",
        icon: <FiClipboard />,
      },
    ],
  },

  {
    title: "Templates",
    items: [
      {
        name: "Certificate Templates",
        path: "/employee/certificate-templates",
        icon: <FiLayers />,
      },
      {
        name: "Offer Letter Templates",
        path: "/employee/offer-letter-templates",
        icon: <FiFilePlus />,
      },
      {
        name: "Report Templates",
        path: "/employee/report-templates",
        icon: <FiFileText />,
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        name: "Course Management",
        path: "/employee/courses",
        icon: <FiBookOpen />,
      },
      {
        name: "Course Analytics",
        path: "/employee/course-analytics",
        icon: <FiBookOpen />,
      },
      {
        name: "Users",
        path: "/employee/users",
        icon: <FiUsers />,
      },
      {
        name: "Companies",
        path: "/employee/companies",
        icon: <FiBriefcase />,
      },
      {
        name: "Universities",
        path: "/employee/universities",
        icon: <FiBookOpen />,
      },
      {
        name: "Communities",
        path: "/employee/communities",
        icon: <FiUsers />,
      },
    ],
  },

  {
    title: "Settings",
    items: [
      {
        name: "Profile",
        path: "/employee/profile",
        icon: <FiUser />,
      },
    ],
  },
];

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Employee";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          border-r border-slate-200 bg-white
          shadow-[8px_0_35px_rgba(15,23,42,0.05)]
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
        <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-[#D4AF37]">Skil</span>
              <span className="text-slate-900">vira</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Employee Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-7">
            {menuSections.map((section) => (
              <div key={section.title}>
                <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {section.title}
                </p>

                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        [
                          "group flex items-center gap-3 rounded-2xl px-4 py-3",
                          "text-sm font-bold transition-all duration-200",
                          isActive
                            ? "bg-[#FFF8E7] text-[#9A7B14] shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`
                              flex h-9 w-9 shrink-0 items-center justify-center
                              rounded-xl transition-all duration-200
                              ${
                                isActive
                                  ? "bg-[#D4AF37] text-black shadow-sm"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                              }
                            `}
                          >
                            {item.icon}
                          </span>

                          <span className="truncate">
                            {item.name}
                          </span>

                          {isActive && (
                            <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#D4AF37]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-2xl bg-[#FCFBF5] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-black text-black">
                {initials || "E"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                  {displayName}
                </p>

                <p className="text-xs font-semibold capitalize text-slate-400">
                  Employee
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <FiLogOut size={17} />
            </span>

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;