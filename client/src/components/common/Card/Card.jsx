import clsx from "clsx";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className,
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
        "rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-xl",
        paddings[padding],
        className
      )}
    >
      {(title || subtitle || actions) && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-2xl font-bold text-slate-900">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {actions}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
