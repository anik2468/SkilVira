import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiBriefcase />,
    label: "Internships",
    value: "Real Opportunities",
    note: "Discover & apply",
  },
  {
    icon: <FiBookOpen />,
    label: "Courses",
    value: "Industry Focused",
    note: "Learn practical skills",
  },
  {
    icon: <FiUsers />,
    label: "Student Network",
    value: "Growing",
    note: "Learn together",
  },
  {
    icon: <FiShield />,
    label: "Platform",
    value: "Verified & Secure",
    note: "Built with trust",
  },
];

const Stats = () => {
  return (
    <div className="mt-9 grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-5"
        >
          {/* Top accent */}
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent opacity-70" />

          {/* Icon */}
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16] transition-transform duration-300 group-hover:scale-105">
              {item.icon}
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
              0{index + 1}
            </span>
          </div>

          {/* Content */}
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {item.label}
            </p>

            <h3 className="mt-1 text-sm font-black leading-5 text-slate-950 sm:text-base">
              {item.value}
            </h3>

            <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-400 sm:text-xs">
              {item.note}
            </p>
          </div>

          {/* Bottom indicator */}
          <div className="mt-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="h-px flex-1 bg-slate-100" />

            {index === 3 && (
              <FiAward
                size={12}
                className="text-[#D4AF37]"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;