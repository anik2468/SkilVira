const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
      />
    </div>
  );
};

export default Textarea;