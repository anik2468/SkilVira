import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import api from "../../services/api";

const initialForm = {
  college: "",
  university: "",
  collegeId: "",
  universityId: "",
  city: "",
  state: "",
  phone: "",
  bio: "",
  instagram: "",
  linkedin: "",
  github: "",
};

const fields = [
  { name: "college", label: "College Name" },
  { name: "university", label: "University Name" },
  { name: "collegeId", label: "College ID" },
  { name: "universityId", label: "University ID" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "instagram", label: "Instagram Profile", type: "url" },
  { name: "linkedin", label: "LinkedIn Profile", type: "url" },
  { name: "github", label: "GitHub Profile", type: "url" },
];

export default function AmbassadorEditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/ambassador/profile");
        const profile =
          response?.data?.profile ||
          response?.data?.data ||
          response?.data ||
          {};

        setForm((current) => ({
          ...current,
          ...Object.fromEntries(
            Object.keys(initialForm).map((key) => [
              key,
              profile[key] ?? "",
            ])
          ),
        }));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put("/ambassador/profile", form);
      navigate("/ambassador/profile");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/ambassador/profile"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"
        >
          <FiArrowLeft /> Back to Profile
        </Link>

        <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-black text-gray-950 sm:text-3xl">
            Edit Ambassador Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your college, contact information and social links.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">
                    {field.label}
                  </span>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name]}
                    onChange={handleChange}
                    maxLength={field.name === "phone" ? 20 : 200}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15"
                  />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                About Me
              </span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                placeholder="Write a short introduction..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15"
              />
              <span className="mt-1 block text-right text-xs text-gray-400">
                {form.bio.length}/1000
              </span>
            </label>

            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
              <Link
                to="/ambassador/profile"
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-black text-black hover:bg-[#c5a12f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
