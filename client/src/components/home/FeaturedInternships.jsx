import { FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import Button from "../ui/Button";

const internships = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    stipend: "₹25,000/month",
    duration: "3 Months",
  },
  {
    title: "Backend Developer",
    company: "Microsoft",
    location: "Bangalore",
    stipend: "₹30,000/month",
    duration: "6 Months",
  },
  {
    title: "UI/UX Designer",
    company: "Amazon",
    location: "Hybrid",
    stipend: "₹20,000/month",
    duration: "4 Months",
  },
];

const FeaturedInternships = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-[#111827]">
            Featured Internships
          </h2>

          <p className="mt-3 text-gray-500">
            Apply to top internships from verified companies.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {internships.map((job, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-500">{job.company}</p>
                </div>

                <FiBookmark className="cursor-pointer text-2xl text-gray-400 hover:text-[#D4AF37]" />
              </div>

              <div className="space-y-3">

                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin />
                  {job.location}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock />
                  {job.duration}
                </div>

                <p className="font-semibold text-[#D4AF37]">
                  {job.stipend}
                </p>

              </div>

              <div className="mt-6">
                <Button>Apply Now</Button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturedInternships;