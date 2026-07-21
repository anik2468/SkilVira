import {
  FiCode,
  FiCpu,
  FiSmartphone,
  FiPenTool,
  FiCloud,
  FiShield,
  FiDatabase,
  FiBarChart2,
} from "react-icons/fi";

const categories = [
  {
    icon: <FiCode size={36} />,
    title: "Web Development",
    jobs: "850+ Internships",
  },
  {
    icon: <FiCpu size={36} />,
    title: "AI & Machine Learning",
    jobs: "420+ Internships",
  },
  {
    icon: <FiSmartphone size={36} />,
    title: "App Development",
    jobs: "300+ Internships",
  },
  {
    icon: <FiPenTool size={36} />,
    title: "UI / UX Design",
    jobs: "260+ Internships",
  },
  {
    icon: <FiCloud size={36} />,
    title: "Cloud Computing",
    jobs: "180+ Internships",
  },
  {
    icon: <FiShield size={36} />,
    title: "Cyber Security",
    jobs: "210+ Internships",
  },
  {
    icon: <FiDatabase size={36} />,
    title: "Data Science",
    jobs: "390+ Internships",
  },
  {
    icon: <FiBarChart2 size={36} />,
    title: "Digital Marketing",
    jobs: "500+ Internships",
  },
];

const PopularCategories = () => {
  return (
    <section className="bg-[#FAFAFA] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#111827]">
            Popular Categories
          </h2>

          <p className="mt-4 text-gray-500">
            Explore internships by your favourite domain.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-[#111827]">
                {item.title}
              </h3>

              <p className="mt-3 text-gray-500">
                {item.jobs}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default PopularCategories;