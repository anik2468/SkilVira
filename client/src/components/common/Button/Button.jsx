import clsx from "clsx";

const variants = {
  primary:
    "bg-[#D4AF37] hover:bg-[#B89329] text-white",

  secondary:
    "bg-[#0F172A] hover:bg-slate-800 text-white",

  outline:
    "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white",

  danger:
    "bg-red-500 hover:bg-red-600 text-white",

  success:
    "bg-green-500 hover:bg-green-600 text-white",

  ghost:
    "hover:bg-slate-100 text-slate-700",
};

const sizes = {
  sm: "px-4 py-2 text-sm",

  md: "px-6 py-3",

  lg: "px-8 py-4 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={clsx(
        "rounded-2xl font-semibold transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;