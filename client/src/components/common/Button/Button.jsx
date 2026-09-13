import clsx from "clsx";

const variants = {
  primary:
    "bg-[#D4AF37] text-black hover:bg-[#E1C14E] shadow-sm hover:shadow-md",

  secondary:
    "bg-black text-white hover:bg-slate-800 shadow-sm",

  outline:
    "border border-[#D4AF37]/50 bg-white text-[#9A7B14] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",

  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",

  light:
    "bg-[#FCFBF5] text-slate-800 border border-slate-200 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5",
};

const sizes = {
  sm:
    "min-h-9 px-3.5 py-2 text-xs",

  md:
    "min-h-11 px-5 py-3 text-sm",

  lg:
    "min-h-12 px-7 py-3.5 text-base",

  xl:
    "min-h-14 px-8 py-4 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) => {
  const isDisabled =
    loading || disabled;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl",
        "font-black tracking-tight",
        "transition-all duration-200",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variants[variant] ||
          variants.primary,
        sizes[size] ||
          sizes.md,
        fullWidth &&
          "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />

          <span>
            Please wait...
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;