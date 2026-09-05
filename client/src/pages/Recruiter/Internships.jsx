import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUsers,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

import {
  getRecruiterInternships,
  deleteInternship,
} from "../../services/internshipService";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const res = await getRecruiterInternships();

      setInternships(res.internships || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    try {
      await deleteInternship(id);

      setInternships((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log(err);
      alert("Unable to delete internship.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            My Internships
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all posted internships.
          </p>

        </div>

        <Link
          to="/recruiter/internships/create"
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"
        >
          <FiPlus />
          Post Internship
        </Link>

      </div>

      {internships.length === 0 ? (

        <div className="rounded-2xl bg-white p-16 text-center shadow">

          <h2 className="text-3xl font-bold">
            No Internship Posted
          </h2>

          <p className="mt-3 text-gray-500">
            Start by creating your first internship.
          </p>

        </div>

      ) : (

        <div className="grid gap-6">

          {internships.map((item) => (

            <div
              key={item._id}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-[#D4AF37]">
                    {item.company}
                  </p>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    item.status === "Closed"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-gray-600">

                <div className="flex items-center gap-2">
                  <FiMapPin />
                  {item.location}
                </div>

                <div className="flex items-center gap-2">
                  <FiClock />
                  {item.duration}
                </div>

                <div className="flex items-center gap-2">
                  <FiUsers />
                  {item.applicants || 0} Applicants
                </div>

                <div className="flex items-center gap-2">
                  <FiEye />
                  {item.views || 0} Views
                </div>

              </div>

              <div className="mt-8 flex gap-4">

                <Link
                  to={`/recruiter/internships/edit/${item._id}`}
                  className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#D4AF37]"
                >
                  <FiEdit2 />
                  Edit
                </Link>

                <button
                  onClick={() => remove(item._id)}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
                >
                  <FiTrash2 />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Internships;