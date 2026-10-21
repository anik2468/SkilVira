import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";

const SearchBar = () => {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = [role.trim(), location.trim()]
      .filter(Boolean)
      .join(" ");
    navigate(
      query
        ? `/student/courses?search=${encodeURIComponent(query)}`
        : "/courses"
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mt-8 w-full max-w-3xl"
    >
      <div className="relative rounded-[26px] border border-slate-200 bg-white/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-3">
        {/* Top accent */}
        <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* ROLE / SKILL */}
          <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-transparent px-4 transition-all duration-200 hover:border-slate-200 hover:bg-[#FCFCF9] focus-within:border-[#D4AF37]/40 focus-within:bg-[#FCFCF9]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 transition-transform duration-200 group-focus-within:scale-105">
              <FiSearch
                size={19}
                className="text-[#B28F16]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Find course or skill
              </label>

              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Course, skill or category"
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden h-10 w-px bg-slate-200 md:block" />

          {/* LOCATION */}
          <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-transparent px-4 transition-all duration-200 hover:border-slate-200 hover:bg-[#FCFCF9] focus-within:border-[#D4AF37]/40 focus-within:bg-[#FCFCF9]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 transition-transform duration-200 group-focus-within:scale-105">
              <FiMapPin
                size={19}
                className="text-[#B28F16]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Topic or level
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. beginner, frontend"
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="submit"
            className="group flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 text-sm font-black text-black shadow-[0_10px_30px_rgba(212,175,55,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E1C14E] hover:shadow-[0_14px_35px_rgba(212,175,55,0.28)] active:translate-y-0 md:px-7"
          >
            <span>Search</span>

            <FiArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Bottom hints */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
          <p className="text-[10px] font-semibold text-slate-400">
            Search courses by title, category or skill
          </p>

          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#B28F16]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            Discover your next step
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;