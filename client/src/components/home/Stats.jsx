import {
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiBookOpen />,
    title: "Partner Colleges",
    value: "Coming Soon",
  },
  {
    icon: <FiBriefcase />,
    title: "Live Internships",
    value: "Launching Soon",
  },
  {
    icon: <FiUsers />,
    title: "Student Community",
    value: "Join Early",
  },
  {
    icon: <FiShield />,
    title: "Verified Platform",
    value: "100% Free",
  },
];

const Stats = () => {
  return (
    <div className="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 text-3xl text-[#D4AF37]">
            {item.icon}
          </div>

          <h3 className="text-lg font-bold text-[#111827]">
            {item.title}
          </h3>

          <p className="mt-2 text-[#D4AF37] font-semibold">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;