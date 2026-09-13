import clsx from "clsx";

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">

      {label && (
        <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-600">
          {label}

          {required && (
            <span className="text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">

        {leftIcon && (
          <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "input-error"
              : helperText
              ? "input-helper"
              : undefined
          }
          className={clsx(
            "w-full rounded-2xl border bg-white px-4 py-3.5",
            "text-sm font-medium text-slate-900",
            "placeholder:text-slate-400",
            "outline-none transition-all duration-200",
            "focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 hover:border-slate-300 focus:border-[#D4AF37]",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-slate-400">
            {rightIcon}
          </div>
        )}

      </div>

      {helperText && !error && (
        <p
          id="input-helper"
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id="input-error"
          className="mt-2 text-xs font-semibold leading-5 text-red-600"
        >
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;