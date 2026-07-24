import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import { getInternships } from "../../services/internshipService";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const data = await getInternships();
      setInternships(data.internships || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase());

      const matchesMode =
        mode === "All" || item.mode === mode;

      return matchesSearch && matchesMode;
    });
  }, [internships, search, mode]);

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold">
          Browse Internships
        </h1>

        <p className="mt-2 text-gray-500">
          Find internships that match your skills.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow md:flex-row">

        <div className="relative flex-1">

          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search internships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-[#D4AF37]"
          />

        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none"
        >
          <option>All</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>Onsite</option>
        </select>

      </div>

      {/* Internship List */}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          Loading internships...
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          No internships found.
        </div>
      ) : (
        <div className="grid gap-6">

          {filteredInternships.map((item) => (

            <div
              key={item._id}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
            >

              <div className="flex flex-col justify-between gap-6 lg:flex-row">

                <div className="space-y-3">

                  <h2 className="text-2xl font-bold">
                    {item.title}
                  </h2>

                  <p className="text-lg font-medium text-[#D4AF37]">
                    {item.company}
                  </p>

                  <div className="flex flex-wrap gap-5 text-gray-500">

                    <span className="flex items-center gap-2">
                      <FiMapPin />
                      {item.location}
                    </span>

                    <span className="flex items-center gap-2">
                      <FiClock />
                      {item.duration}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <span className="rounded-full bg-gray-100 px-3 py-1">
                      {item.mode}
                    </span>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                      {item.category}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                      {item.stipend}
                    </span>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <button className="rounded-xl border px-5 py-3 transition hover:bg-gray-100">
                    <FiBookmark />
                  </button>

                  <Link
                    to={`/student/internships/${item._id}`}
                    className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Internships;