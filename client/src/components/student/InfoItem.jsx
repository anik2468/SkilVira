import {
  FiCheckCircle,
} from "react-icons/fi";

const InfoItem = ({
  label,
  value,
  icon: Icon,
}) => {
  const displayValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
      ? value
      : "Not Added";

  const isAdded = displayValue !== "Not Added";

  return (
    <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#D4AF37]/30 hover:bg-white hover:shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <Icon size={15} />
            </div>
          )}

          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>
        </div>

        {isAdded && (
          <FiCheckCircle
            size={17}
            className="mt-0.5 shrink-0 text-[#D4AF37]"
          />
        )}
      </div>

      <p
        className={`mt-3 break-words text-base font-semibold sm:text-lg ${
          isAdded
            ? "text-gray-900"
            : "text-gray-400"
        }`}
      >
        {displayValue}
      </p>
    </div>
  );
};

export default InfoItem;