import clsx from "clsx";

const Card = ({
  children,
  className = "",
  title,
  subtitle,
  actions,
  hover = false,
  padding = "md",
  ...props
}) => {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-200/80 bg-white",
        "shadow-[0_8px_30px_rgba(15,23,42,0.05)]",
        "transition-all duration-200",
        hover &&
          "hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:shadow-[0_16px_40px_rgba(212,175,55,0.10)]",
        paddingStyles[padding] || paddingStyles.md,
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-sm leading-6 text-slate-500">
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