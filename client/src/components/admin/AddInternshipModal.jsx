import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { createInternship } from "../../services/internshipService";

const initialState = {
  title: "",
  company: "",
  category: "",
  internshipType: "Technical",
  mode: "Remote",
  location: "",
  duration: "",
  stipend: "",
  lastDate: "",
  skills: "",
  description: "",
  requirements: "",
  perks: "",
};

const AddInternshipModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

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
  "Technical",
  "Non Technical",
];
const modes = [
  "Remote",
  "Hybrid",
  "Onsite",
];
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

      await createInternship({
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      alert("Internship Added Successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add internship");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-5">
      <div className="mx-auto my-10 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Add Internship
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >
<Input
  label="Internship Title"
  name="title"
  value={form.title}
  onChange={handleChange}
  placeholder="Frontend Developer"
/>

<Input
  label="Company"
  name="company"
  value={form.company}
  onChange={handleChange}
  placeholder="Google"
/>

<Select
  label="Category"
  name="category"
  value={form.category}
  onChange={handleChange}
  options={categories}
/>

<Select
  label="Internship Type"
  name="internshipType"
  value={form.internshipType}
  onChange={handleChange}
  options={internshipTypes}
/>

<Select
  label="Mode"
  name="mode"
  value={form.mode}
  onChange={handleChange}
  options={modes}
/>

<Input
  label="Location"
  name="location"
  value={form.location}
  onChange={handleChange}
/>

<Input
  label="Duration"
  name="duration"
  value={form.duration}
  onChange={handleChange}
/>

<Input
  label="Stipend"
  name="stipend"
  value={form.stipend}
  onChange={handleChange}
/>

<Input
  type="date"
  label="Last Date"
  name="lastDate"
  value={form.lastDate}
  onChange={handleChange}
/>

<Input
  label="Skills"
  name="skills"
  value={form.skills}
  onChange={handleChange}
  placeholder="React, Node, MongoDB"
/>

<Textarea
  label="Description"
  name="description"
  value={form.description}
  onChange={handleChange}
/>

<Textarea
  label="Requirements"
  name="requirements"
  value={form.requirements}
  onChange={handleChange}
/>

<Textarea
  label="Perks"
  name="perks"
  value={form.perks}
  onChange={handleChange}
/>

          <div className="col-span-2 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-white"
            >
              {loading ? "Saving Internship......" : "Save Internship"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddInternshipModal;