import { Link } from "react-router-dom";

const universities = [
  {
    id: 1,
    name: "Government Engineering College Sheikhpura",
    location: "Sheikhpura, Bihar",
    students: "650+",
    internships: "48",
    logo: "https://placehold.co/100x100?text=GEC",
  },
  {
    id: 2,
    name: "NIT Patna",
    location: "Patna, Bihar",
    students: "1200+",
    internships: "132",
    logo: "https://placehold.co/100x100?text=NIT",
  },
  {
    id: 3,
    name: "IIT Patna",
    location: "Patna, Bihar",
    students: "950+",
    internships: "210",
    logo: "https://placehold.co/100x100?text=IIT",
  },
];

const PartnerUniversities = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Partner Universities
          </h2>

          <p className="mt-4 text-gray-600">
            Colleges connected with SkilVira to help students discover internships.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {universities.map((college) => (
            <div
              key={college.id}
              className="rounded-3xl bg-white p-8 shadow transition hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={college.logo}
                alt={college.name}
                className="mx-auto h-20 w-20 rounded-full"
              />

              <h3 className="mt-6 text-center text-xl font-bold">
                {college.name}
              </h3>

              <p className="mt-2 text-center text-gray-500">
                {college.location}
              </p>

              <div className="mt-6 flex justify-between text-center">
                <div>
                  <h4 className="text-2xl font-bold text-[#D4AF37]">
                    {college.students}
                  </h4>
                  <p className="text-sm text-gray-500">Students</p>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-[#D4AF37]">
                    {college.internships}
                  </h4>
                  <p className="text-sm text-gray-500">Internships</p>
                </div>
              </div>

              <Link
                to={`/universities/${college.id}`}
                className="mt-8 block rounded-xl bg-[#D4AF37] py-3 text-center font-semibold text-white hover:opacity-90"
              >
                View University
              </Link>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;