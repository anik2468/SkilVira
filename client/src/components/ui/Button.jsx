const Button = ({
  children,
  variant = "primary",
  onClick,
}) => {
  const styles = {
    primary:
      "bg-[#D4AF37] text-white hover:bg-[#c1972d]",

    outline:
      "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-6 py-3 font-semibold transition duration-300 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;