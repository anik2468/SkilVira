import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api.js";

import {
  FiArrowRight,
  FiBookOpen,
  FiMessageCircle,
  FiBriefcase,
  FiHome,
  FiInfo,
  FiMenu,
  FiX,
  FiUsers,
} from "react-icons/fi";

const navItems = [
  { label: "Home", to: "/", icon: <FiHome /> },
  { label: "Courses", to: "/courses", icon: <FiBookOpen /> },
  { label: "Internships", to: "/internships", icon: <FiBriefcase /> },
  { label: "Contact & Support", to: "/contact", icon: <FiMessageCircle /> },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [platformLogoUrl, setPlatformLogoUrl] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/platform-settings")
      .then(({ data }) => {
        if (active) setPlatformLogoUrl(data?.settings?.platformLogoUrl || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isActive = (path) =>
    location.pathname === path;

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      {/* Gold accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            {platformLogoUrl ? (
              <img
                src={platformLogoUrl}
                alt="SkilVira logo"
                onError={() => setPlatformLogoUrl("")}
                className="h-11 max-w-[150px] object-contain"
              />
            ) : (
              <>
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] text-base font-black text-black shadow-[0_10px_25px_rgba(212,175,55,0.20)] transition-transform duration-300 group-hover:scale-105">
                  S
                  <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-black" />
                </div>
                <div className="block min-w-0">
                  <p className="text-base font-black tracking-tight text-slate-950 sm:text-xl">
                    Skil<span className="text-[#D4AF37]">Vira</span>
                  </p>
                  <p className="hidden text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 sm:block">
                    Empowering Careers
                  </p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                      isActive(item.to)
                        ? "bg-[#D4AF37]/10 text-[#8D7414]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    {item.label}

                    {isActive(item.to) && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#D4AF37]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex lg:gap-3">
            <Link
              to="/choose-role"
              className="rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 hover:text-[#9A7B14]"
            >
              Login
            </Link>

            <Link
              to="/choose-role"
              className="group flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-black shadow-[0_10px_25px_rgba(212,175,55,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1C14E] hover:shadow-[0_15px_35px_rgba(212,175,55,0.24)]"
            >
              Get Started

              <FiArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 lg:hidden"
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={open}
          >
            {open ? (
              <FiX size={20} />
            ) : (
              <FiMenu size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-slate-100 pb-5 pt-4 lg:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black ${
                    isActive(item.to)
                      ? "bg-[#D4AF37]/10 text-[#8D7414]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[#B28F16]">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/choose-role"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
              >
                Login
              </Link>

              <Link
                to="/choose-role"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-black text-black"
              >
                Get Started
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;