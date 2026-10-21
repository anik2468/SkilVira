import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiAward,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiActivity,
  FiCreditCard,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user?.role || "admin";

  const menus = [
    {
      name: "Dashboard",
      icon: <FiGrid />,
      path: "/control/dashboard",
    },
    {
      name: "Courses",
      icon: <FiBookOpen />,
      path: "/control/courses",
    },
    {
      name: "Certificate Templates",
      icon: <FiAward />,
      path: "/control/certificate-templates",
    },
    {
      name: "Internships",
      icon: <FiBriefcase />,
      path: "/control/internships",
    },
    {
      name: "Recruiters",
      icon: <FiUserCheck />,
      path: "/control/recruiters",
    },
    {
      name: "Students",
      icon: <FiUsers />,
      path: "/control/students",
    },
    {
      name: "Applications",
      icon: <FiFileText />,
      path: "/control/applications",
    },
    {
      name: "Certificates",
      icon: <FiAward />,
      path: "/control/certificates",
    },
    {
      name: "Colleges",
      icon: <FiBookOpen />,
      path: "/control/colleges",
    },
    {
      name: "Create User",
      icon: <FiUsers />,
      path: "/control/create-user",
    },
    {
      name: "Employees",
      icon: <FiUsers />,
      path: "/control/employees",
    },
    {
      name: "Employee Activity",
      icon: <FiActivity />,
      path: "/control/employee-activity",
    },
    {
      name: "User Management",
      icon: <FiUsers />,
      path: "/control/users",
    },
    {
      name: "Companies",
      icon: <FiBriefcase />,
      path: "/control/companies",
    },
    {
      name: "Universities",
      icon: <FiBookOpen />,
      path: "/control/universities",
    },
    {
      name: "Communities",
      icon: <FiUsers />,
      path: "/control/communities",
    },
    {
      name: "Ambassador Approval",
      icon: <FiUsers />,
      path: "/control/ambassadors",
    },
    {
      name: "Recruiter Approval",
      icon: <FiUserCheck />,
      path: "/control/recruiter-approval",
    },
    {
      name: "Internship Approval",
      icon: <FiBriefcase />,
      path: "/control/internships/approval",
    },
    {
      name: "Create Internship",
      icon: <FiBriefcase />,
      path: "/control/internships/create",
    },
    {
      name: "Payment Verification",
      icon: <FiCreditCard />,
      path: "/control/payment-verification",
    },
    {
      name: "Payment Settings",
      icon: <FiSettings />,
      path: "/control/payment-settings",
    },
    {
      name: "Offer Letter Templates",
      icon: <FiFileText />,
      path: "/control/offer-letter-templates",
    },
    {
      name: "Offer Letter Verification",
      icon: <FiCheckCircle />,
      path: "/control/offer-letters/verification",
    },
    {
      name: "Employee Certificate Templates",
      icon: <FiAward />,
      path: "/control/employee-certificate-templates",
    },
    {
      name: "Certificate Verification",
      icon: <FiAward />,
      path: "/control/certificates/verification",
    },
    {
      name: "Report Verification",
      icon: <FiFileText />,
      path: "/control/reports/verification",
    },
    {
      name: "Report Templates",
      icon: <FiFileText />,
      path: "/control/report-templates",
    },
    {
      name: "Referral Discount & Commission",
      icon: <FiBookOpen />,
      path: "/control/referral-settings",
    },
    {
      name: "Contact & Support Settings",
      icon: <FiSettings />,
      path: "/control/contact-settings",
    },
    {
      name: "Settings",
      icon: <FiSettings />,
      path: "/control/settings",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
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
              <span className="text-[#D4AF37]">
                Skil
              </span>
              <span className="text-slate-900">
                vira
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile Close */}
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
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Management
          </p>

          <div className="space-y-1.5">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
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
                      <span className="ml-auto h-2 w-2 rounded-full bg-[#D4AF37]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-2xl bg-[#FCFBF5] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] font-black text-black">
                {(
                  user?.name ||
                  user?.fullName ||
                  "A"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                  {user?.name ||
                    user?.fullName ||
                    "Administrator"}
                </p>

                <p className="truncate text-xs font-medium capitalize text-slate-400">
                  {role}
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