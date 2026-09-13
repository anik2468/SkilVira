import clsx from "clsx";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = "",
  hover = true,
  padding = "md",
}) => {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white",
        "shadow-[0_10px_35px_rgba(15,23,42,0.05)]",
        "transition-all duration-300",
        hover &&
          "hover:-translate-y-1 hover:border-[#D4AF37]/25 hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]",
        paddings[padding] || paddings.md,
        className
      )}
    >
      {/* Subtle top accent */}
      {(title || subtitle || actions) && (
        <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      )}

      {(title || subtitle || actions) && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;