const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  const styles = {
    primary:
      "bg-[#D4AF37] text-white hover:bg-[#c79d2d] shadow-md",

    outline:
      "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white",

    secondary:
      "bg-[#111827] text-white hover:bg-[#1f2937]",

    ghost:
      "bg-transparent text-[#111827] hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-6
        py-3
        font-semibold
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;