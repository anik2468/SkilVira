import { useEffect, useState } from "react";
import { FiUpload, FiX, FiSave } from "react-icons/fi";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

import { updateInternship } from "../../services/internshipService";
import { uploadFile } from "../../services/uploadService";

const categories = [
  "Web Development",
  "App Development",
  "AI/ML",
  "Cyber Security",
  "Data Science",
  "UI/UX",
  "Cloud",
  "DevOps",
  "Marketing",
  "HR",
];

const internshipTypes = [
  "Internship",
  "Full Time",
  "Part Time",
];

const modes = [
  "Online",
  "Offline",
  "Hybrid",
];

const statuses = [
  "Open",
  "Closed",
];

const EditInternshipModal = ({
  internship,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    internshipType: "",
    workMode: "",
    location: "",
    duration: "",
    price: "",
    lastDate: "",
    skills: "",
    description: "",
    requirements: "",
    perks: "",
    internshipImage: "",
    status: "Open",
  });

  useEffect(() => {
    if (!internship) return;

    setForm({
      title: internship.title || "",
      company: internship.company || "",
      category: internship.category || "",
      internshipType: internship.internshipType || "",
      workMode: internship.workMode || "",
      location: internship.location || "",
      duration: internship.duration || "",
      price: internship.price ?? "",
      lastDate: internship.lastDate
        ? internship.lastDate.substring(0, 10)
        : "",
      skills: Array.isArray(internship.skills)
        ? internship.skills.join(", ")
        : internship.skills || "",
      description: internship.description || "",
      requirements: internship.requirements || "",
      perks: internship.perks || "",
      internshipImage: internship.internshipImage || "",
      status: internship.status || "Open",
    });
  }, [internship]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const data = await uploadFile(file);

      setForm((prev) => ({
        ...prev,
        internshipImage: data?.url || "",
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!internship?._id) {
      alert("Internship information is missing.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        price:
          form.price === ""
            ? 0
            : Number(form.price),

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateInternship(
        internship._id,
        payload
      );

      alert("Internship updated successfully.");

      if (onSuccess) {
        await onSuccess();
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to update internship:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update internship.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!internship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B58A18]">
              Internship Management
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Edit Internship
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the internship details and publish-ready information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading || uploading}
            aria-label="Close modal"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Image */}
            <section>
              <div className="mb-4">
                <h3 className="text-base font-black text-slate-900">
                  Internship Thumbnail
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a clear image that represents this internship.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
                {form.internshipImage ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img
                      src={form.internshipImage}
                      alt="Internship thumbnail"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#B58A18]">
                        <FiUpload size={22} />
                      </div>

                      <p className="font-bold text-slate-700">
                        No thumbnail uploaded
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Upload an image below.
                      </p>
                    </div>
                  </div>
                )}

                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-3 text-sm font-black text-[#9A7B14] transition hover:border-[#D4AF37] hover:bg-[#FFF8E7]">
                  <FiUpload size={18} />

                  {uploading
                    ? "Uploading..."
                    : form.internshipImage
                      ? "Change Image"
                      : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading || loading}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </section>

            {/* Basic Information */}
            <section>
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-900">
                  Basic Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Core information visible to students and applicants.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter internship title"
                  required
                />

                <Input
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />

                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={categories}
                  placeholder="Select category"
                  required
                />

                <Select
                  label="Internship Type"
                  name="internshipType"
                  value={form.internshipType}
                  onChange={handleChange}
                  options={internshipTypes}
                  placeholder="Select type"
                  required
                />

                <Select
                  label="Work Mode"
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                  options={modes}
                  placeholder="Select work mode"
                  required
                />

                <Input
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Patna / Remote"
                />

                <Input
                  label="Duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Months"
                />

                <Input
                  type="number"
                  min="0"
                  label="Price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                />

                <Input
                  type="date"
                  label="Last Date"
                  name="lastDate"
                  value={form.lastDate}
                  onChange={handleChange}
                />

                <Select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={statuses}
                  placeholder="Select status"
                />
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-900">
                  Skills
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Separate multiple skills with commas.
                </p>
              </div>

              <Input
                label="Required Skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js"
              />
            </section>

            {/* Detailed Information */}
            <section>
              <div className="mb-5">
                <h3 className="text-base font-black text-slate-900">
                  Detailed Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the internship, requirements and benefits.
                </p>
              </div>

              <div className="space-y-5">
                <Textarea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the internship..."
                />

                <Textarea
                  label="Requirements"
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Mention eligibility and requirements..."
                />

                <Textarea
                  label="Perks"
                  name="perks"
                  value={form.perks}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Mention stipend, certificate, mentorship, etc."
                />
              </div>
            </section>
          </form>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || uploading}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-black text-black shadow-sm transition hover:bg-[#E1C14E] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <FiSave size={17} />
                Update Internship
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInternshipModal;