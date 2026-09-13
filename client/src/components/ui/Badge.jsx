import clsx from "clsx";

const Badge = ({
  children,
  variant = "gold",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variants = {
    gold: "bg-[#FFF8E7] text-[#9A7B14] border-[#E8D79A]",
    dark: "bg-slate-900 text-white border-slate-800",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-5 py-2 text-sm",
  };

  const dots = {
    gold: "bg-[#D4AF37]",
    dark: "bg-white",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-slate-500",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border font-bold",
        "whitespace-nowrap",
        "transition-colors duration-200",
        variants[variant] || variants.gold,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            dots[variant] || dots.gold
          )}
          aria-hidden="true"
        />
      )}

      {children}
    </span>
  );
};

export default Badge;