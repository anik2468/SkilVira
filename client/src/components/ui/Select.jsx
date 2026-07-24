const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;