import React from "react";

const StatCard = ({ title, value, color }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <p className="text-gray-500">{title}</p>

      <h2
        className="mt-3 text-4xl font-bold"
        style={{ color }}
      >
        {value}
      </h2>
    </div>
  );
};

export default StatCard;