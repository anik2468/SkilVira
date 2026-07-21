import {
  FiShield,
  FiBriefcase,
  FiAward,
  FiUsers,
} from "react-icons/fi";

const features = [
  {
    icon: <FiShield size={34} />,
    title: "Verified Companies",
    desc: "Apply only to trusted and verified recruiters.",
  },
  {
    icon: <FiBriefcase size={34} />,
    title: "Real Internships",
    desc: "Remote, Hybrid and On-site opportunities.",
  },
  {
    icon: <FiAward size={34} />,
    title: "Verified Certificates",
    desc: "Receive industry-ready certificates after completion.",
  },
  {
    icon: <FiUsers size={34} />,
    title: "Career Community",
    desc: "Connect with students, mentors and recruiters.",
  },
];

const WhySkilvira = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Why Choose Skilvira?
          </h2>

          <p className="mt-3 text-gray-500">
            Everything you need to build your career in one platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 text-[#D4AF37]">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhySkilvira;