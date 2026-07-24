import { useState } from "react";
import { applyInternship } from "../../services/applicationService";

const ApplyInternshipModal = ({
  internshipId,
  studentId,
  onClose,
}) => {
  const [form, setForm] = useState({
    resume: "",
    coverLetter: "",
    portfolio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await applyInternship({
        student: studentId,
        internship: internshipId,
        resume: form.resume,
        coverLetter: form.coverLetter,
        portfolio: form.portfolio,
      });

      alert("Application submitted successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold">
          Apply Internship
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="resume"
            placeholder="Resume URL"
            value={form.resume}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

          <textarea
            name="coverLetter"
            placeholder="Cover Letter"
            rows="5"
            value={form.coverLetter}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            name="portfolio"
            placeholder="Portfolio / GitHub"
            value={form.portfolio}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"
            >
              {loading ? "Submitting..." : "Apply"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ApplyInternshipModal;