import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

import { getInternshipById } from "../../services/internshipService";
import ApplyInternshipModal from "../../components/student/ApplyInternshipModal";

const InternshipDetails = () => {
  const { id } = useParams();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadInternship();
  }, []);

  const loadInternship = async () => {
    try {
      const data = await getInternshipById(id);
      setInternship(data.internship);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xl">
        Loading...
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="p-8 text-center">
        Internship not found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">

        {/* Header */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <h1 className="text-4xl font-bold">
            {internship.title}
          </h1>

          <p className="mt-2 text-xl text-[#D4AF37]">
            {internship.company}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-gray-600">

            <span className="flex items-center gap-2">
              <FiMapPin />
              {internship.location}
            </span>

            <span className="flex items-center gap-2">
              <FiClock />
              {internship.duration}
            </span>

            <span className="flex items-center gap-2">
              <FiDollarSign />
              {internship.stipend}
            </span>

            <span className="flex items-center gap-2">
              <FiCalendar />
              Last Date:{" "}
              {new Date(
                internship.lastDate
              ).toLocaleDateString()}
            </span>

          </div>

        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Description
          </h2>

          <p className="leading-8 text-gray-600">
            {internship.description}
          </p>

        </div>

        {/* Requirements */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Requirements
          </h2>

          <p className="leading-8 text-gray-600">
            {internship.requirements}
          </p>

        </div>

        {/* Skills */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Skills Required
          </h2>

          <div className="flex flex-wrap gap-3">

            {internship.skills?.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        {/* Perks */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Perks
          </h2>

          <p className="leading-8 text-gray-600">
            {internship.perks}
          </p>

        </div>

        {/* Apply Button */}
        <div className="flex justify-end">

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Apply Now
          </button>

        </div>

      </div>

      {/* Apply Modal */}
      {showModal && (
        <ApplyInternshipModal
          internshipId={internship._id}
          studentId={user?.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default InternshipDetails;