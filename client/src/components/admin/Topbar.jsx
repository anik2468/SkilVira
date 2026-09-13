import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Administrator";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[82px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] hover:text-slate-900 lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>

        <div className="min-w-0">
          <p className="hidden text-xs font-black uppercase tracking-[0.18em] text-[#B58A18] sm:block">
            SkilVira
          </p>

          <h1 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <FiSearch
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search..."
            className="h-11 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/control/settings")}
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] hover:text-slate-900"
          aria-label="Notifications"
        >
          <FiBell size={19} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#D4AF37]" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] sm:gap-3 sm:px-3"
            aria-expanded={menuOpen}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-black text-black">
              {initials || "A"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-black text-slate-900">
                {displayName}
              </p>

              <p className="text-[11px] font-semibold capitalize text-slate-400">
                {user?.role || "admin"}
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
                  navigate("/control/profile");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <FiUser size={17} />
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/control/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <FiSettings size={17} />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
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

export default Topbar;