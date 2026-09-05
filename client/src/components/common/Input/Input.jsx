import clsx from "clsx";

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">

      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">

        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          className={clsx(
            "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error
              ? "border-red-500 focus:border-red-500"
              : "focus:border-[#D4AF37]",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}

      </div>

      {helperText && !error && (
        <p className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;