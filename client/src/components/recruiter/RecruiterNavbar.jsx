import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

const RecruiterNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-30 flex min-h-[80px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden min-w-0 md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B58A18]">
            SkilVira
          </p>

          <p className="truncate text-lg font-black text-slate-900">
            Recruiter Portal
          </p>
        </div>

        <div className="relative hidden w-full max-w-sm lg:block">
          <FiSearch
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search internships, students..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/recruiter/dashboard")
          }
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7]"
          aria-label="Notifications"
        >
          <FiBell size={19} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] sm:gap-3 sm:px-3"
            aria-expanded={menuOpen}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="h-9 w-9 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-black text-black">
                {initials || "R"}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-black text-slate-900">
                {displayName}
              </p>

              <p className="text-[11px] font-semibold text-slate-400">
                Recruiter
              </p>
            </div>

            <FiChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/recruiter/profile");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <FiUser size={17} />
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/recruiter/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <FiSettings size={17} />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RecruiterNavbar;