import clsx from "clsx";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  required = false,
  error = "",
  helperText = "",
  disabled = false,
  resize = "vertical",
  className = "",
  textareaClassName = "",
  ...props
}) => {
  const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <div className={clsx("flex w-full flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-bold text-slate-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-[#C29B22]">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${name}-error`
            : helperText
              ? `${name}-helper`
              : undefined
        }
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3",
          "text-sm font-medium leading-6 text-slate-900",
          "placeholder:text-slate-400",
          "outline-none transition-all duration-200",
          "shadow-sm",
          "focus:ring-4",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/15",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          resizeStyles[resize] || resizeStyles.vertical,
          textareaClassName
        )}
        {...props}
      />

      {error ? (
        <p
          id={`${name}-error`}
          className="text-xs font-semibold text-red-500"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${name}-helper`}
          className="text-xs text-slate-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Textarea;