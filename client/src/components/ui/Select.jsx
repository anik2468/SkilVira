import clsx from "clsx";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  error = "",
  helperText = "",
  disabled = false,
  className = "",
  selectClassName = "",
  ...props
}) => {
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

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
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
          "text-sm font-semibold text-slate-900",
          "outline-none transition-all duration-200",
          "shadow-sm",
          "focus:ring-4",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/15",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          selectClassName
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}

        {options.map((option, index) => {
          const isObject =
            typeof option === "object" &&
            option !== null;

          const optionValue = isObject
            ? option.value
            : option;

          const optionLabel = isObject
            ? option.label
            : option;

          return (
            <option
              key={`${optionValue}-${index}`}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>

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

export default Select;