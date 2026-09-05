const InfoItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-gray-900">
        {value || "Not Added"}
      </h3>

    </div>
  );
};

export default InfoItem;