import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}) => {
  const styles = {
    primary:
      "bg-[#D4AF37] text-black hover:bg-[#E1C14E] shadow-sm hover:shadow-md",

    outline:
      "border border-[#D4AF37]/50 bg-white text-[#9A7B14] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",

    secondary:
      "bg-black text-white hover:bg-slate-800 shadow-sm",

    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",

    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm",

    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  };

  const isDisabled =
    disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3",
        "font-black tracking-tight",
        "transition-all duration-200",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:hover:translate-y-0 disabled:hover:shadow-none",
        styles[variant] ||
          styles.primary,
        fullWidth && "w-full",
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