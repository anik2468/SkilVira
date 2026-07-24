import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import {
  updateInternship,
} from "../../services/internshipService";

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

const EditInternshipModal = ({
  internship,
  onClose,
  onSuccess,
}) => {

  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    internshipType: "",
    mode: "",
    location: "",
    duration: "",
    stipend: "",
    lastDate: "",
    skills: "",
    description: "",
    requirements: "",
    perks: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (internship) {

      setForm({
        ...internship,

        lastDate: internship.lastDate
          ? internship.lastDate.substring(0,10)
          : "",

        skills: internship.skills
          ? internship.skills.join(", ")
          : "",
      });

    }

  }, [internship]);

  const handleChange = (e) => {

    setForm((prev)=>({

      ...prev,

      [e.target.name]:e.target.value,

    }));

  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await updateInternship(internship._id, {
      ...form,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });

    alert("Internship updated successfully.");

    onSuccess();
    onClose();
  } catch (error) {
    console.error(error);
    alert("Failed to update internship.");
  } finally {
    setLoading(false);
  }
};
return (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-6">

    <div className="mx-auto my-10 w-full max-w-5xl rounded-2xl bg-white p-8 shadow-2xl">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Edit Internship
        </h2>

        <button
          onClick={onClose}
          className="text-2xl font-bold"
        >
          ✕
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-5"
      >

        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          required
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
          required
        />

        <Input
          label="Duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <Input
          label="Stipend"
          name="stipend"
          value={form.stipend}
          onChange={handleChange}
          required
        />

        <Input
          type="date"
          label="Last Date"
          name="lastDate"
          value={form.lastDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Skills"
          name="skills"
          value={form.skills}
          onChange={handleChange}
        />

        <div className="col-span-2">

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

        </div>

        <div className="col-span-2">

          <Textarea
            label="Requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
          />

        </div>

        <div className="col-span-2">

          <Textarea
            label="Perks"
            name="perks"
            value={form.perks}
            onChange={handleChange}
          />

        </div>

        <div className="col-span-2 mt-4 flex justify-end gap-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"
          >
            {loading ? "Updating..." : "Update Internship"}
          </button>

        </div>

      </form>

    </div>

  </div>
);

};

export default EditInternshipModal;