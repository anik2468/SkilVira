import { FiUserPlus, FiSearch, FiFileText, FiAward } from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus size={38} />,
    title: "Create Account",
    desc: "Sign up as a Student or Recruiter in just a few steps.",
  },
  {
    icon: <FiSearch size={38} />,
    title: "Find Internship",
    desc: "Browse verified internships based on your interests.",
  },
  {
    icon: <FiFileText size={38} />,
    title: "Apply Easily",
    desc: "Apply with your profile and track application status.",
  },
  {
    icon: <FiAward size={38} />,
    title: "Get Certified",
    desc: "Complete your internship and receive a verified certificate.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#FAFAFA] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#111827]">
            How Skilvira Works
          </h2>

          <p className="mt-3 text-gray-500">
            Start your internship journey in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#D4AF37]">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-gray-500">
                {step.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;