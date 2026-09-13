import clsx from "clsx";

const SectionHeading = ({
  title,
  subtitle,
  center = true,
  eyebrow,
  titleClassName = "",
  subtitleClassName = "",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "max-w-3xl",
        center && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="mb-3 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#FFF8E7] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#9A7B14]">
          {eyebrow}
        </div>
      )}

      <h2
        className={clsx(
          "text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={clsx(
            "mt-4 text-base leading-7 text-slate-500 sm:text-lg",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;