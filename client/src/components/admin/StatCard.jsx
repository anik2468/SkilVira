const StatCard = ({ title, value, color }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md border">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
};

export default StatCard;