import EditInternshipModal from "../../components/admin/EditInternshipModal";
import { useEffect, useState } from "react";
import {
  getInternships,
  deleteInternship,
} from "../../services/internshipService";

import AddInternshipModal from "../../components/admin/AddInternshipModal";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [search, setSearch] = useState("");

  const fetchInternships = async () => {
    try {
      const data = await getInternships();
      setInternships(data.internships || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this internship?"
    );

const handleEdit = (internship) => {
  setSelectedInternship(internship);
  setShowEditModal(true);
};

    if (!confirmDelete) return;

    try {
      await deleteInternship(id);

      setInternships((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <>
      <div className="p-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Internship Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all internships from one place.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white transition hover:bg-[#c49a28]"
          >
            + Add Internship
          </button>

        </div>
         <div className="mb-6 flex items-center justify-between">

  <div className="relative w-96">

    <FiSearch className="absolute left-4 top-4 text-gray-400" />

    <input
      type="text"
      placeholder="Search internship..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-xl border py-3 pl-12 pr-4 focus:border-[#D4AF37] focus:outline-none"
    />

  </div>

</div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Mode</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center"
                  >
                    Loading...
                  </td>
                </tr>

              ) : internships.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-500"
                  >
                    No internships found.
                  </td>
                </tr>

              ) : (

                internships.map((item) => (

                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-medium">
                      {item.title}
                    </td>

                    <td className="px-6 py-4">
                      {item.company}
                    </td>

                    <td className="px-6 py-4">
                      {item.mode}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {item.status}
                      </span>
                    </td>

                    <td className="space-x-3 px-6 py-4 text-center">

                    <button
                        onClick={() => handleEdit(item)}
                         className="rounded-lg p-2 hover:bg-blue-100 transition"
                 >
                            <FiEdit2 className="text-blue-600" />
                    </button>
                      <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-lg p-2 hover:bg-red-100"
                        >
                          <FiTrash2 className="text-red-600" />
                     </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <AddInternshipModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchInternships();
            setShowModal(false);
          }}
        />
      )}
      {showEditModal && selectedInternship && (
  <EditInternshipModal
    internship={selectedInternship}
    onClose={() => {
      setShowEditModal(false);
      setSelectedInternship(null);
    }}
    onSuccess={() => {
      fetchInternships();
      setShowEditModal(false);
      setSelectedInternship(null);
    }}
  />
)}
    </>
  );
};

export default Internships;