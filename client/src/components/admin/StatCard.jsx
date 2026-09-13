import clsx from "clsx";
import {
  FiArrowUpRight,
  FiActivity,
} from "react-icons/fi";

const StatCard = ({
  title,
  value,
  color = "text-slate-900",
  icon,
  description,
  trend,
  trendLabel = "from last period",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5",
        "shadow-[0_10px_35px_rgba(15,23,42,0.05)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#D4AF37]/30",
        "hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]",
        className
      )}
    >
      {/* Gold accent */}
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#E8CF72] to-transparent opacity-80" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {title}
            </span>
          </div>

          <h2
            className={clsx(
              "mt-3 text-3xl font-black tracking-tight sm:text-4xl",
              color
            )}
          >
            {value ?? "0"}
          </h2>

          {description && (
            <p className="mt-2 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}

          {trend !== undefined && trend !== null && (
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
                <FiArrowUpRight size={13} />
                {trend}
              </span>

              <span className="text-xs font-medium text-slate-400">
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#9A7B14] transition-transform duration-300 group-hover:scale-105">
          {icon || <FiActivity size={19} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;