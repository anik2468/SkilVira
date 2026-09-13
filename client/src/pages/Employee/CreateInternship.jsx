import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  FiBriefcase,
  FiGlobe,
  FiImage,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiTag,
  FiMonitor,
  FiDollarSign,
  FiFileText,
  FiAward,
  FiCheckCircle,
  FiArrowLeft,
  FiSend,
  FiPlus,
  FiInfo,
} from "react-icons/fi";

const CreateInternship = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "SkilVira",
    companyLogo: "",
    internshipImage: "",
    companyWebsite: "",
    title: "",
    category: "",
    internshipType: "Internship",
    workMode: "Online",
    location: "",
    duration: "",
    price: "",
    openings: 1,
    lastDate: "",
    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
    perks: "",
    benefits:
      "Certificate, Internship Report, Attendance Report",
  });

  const changeHandler = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const skills = form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const benefits = form.benefits
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const perks = form.perks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await api.post(
        "/internships/skilvira/create",
        {
          ...form,
          price: String(form.price),
          openings:
            Number(form.openings) || 1,
          skills,
          benefits,
          perks,
          sourceType: "skilvira",
        }
      );

      window.alert(
        "SkilVira Internship Published Successfully."
      );

      navigate(
        "/employee/internships"
      );
    } catch (err) {
      console.error(
        "Create internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create internship."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/employee/internships"
                )
              }
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={16} />
              Back to Internships
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiBriefcase size={13} />
              SkilVira Opportunity
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Create Internship
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Publish a SkilVira internship with complete opportunity,
              eligibility, pricing and benefit information.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] text-white">
            <FiSend size={22} />
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="space-y-6"
      >
        {/* Basic Information */}
        <FormSection
          icon={<FiBriefcase size={20} />}
          title="Basic Information"
          description="Set the core details students will see first."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Name"
              name="company"
              value={form.company}
              onChange={changeHandler}
              placeholder="SkilVira"
              required
            />

            <Field
              label="Internship Title"
              name="title"
              value={form.title}
              onChange={changeHandler}
              placeholder="Full Stack Web Development Internship"
              required
            />

            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={changeHandler}
              placeholder="Web Development"
              required
              icon={<FiTag size={16} />}
            />

            <Field
              label="Company Website"
              name="companyWebsite"
              value={form.companyWebsite}
              onChange={changeHandler}
              placeholder="https://..."
              icon={<FiGlobe size={16} />}
            />

            <SelectField
              label="Internship Type"
              name="internshipType"
              value={form.internshipType}
              onChange={changeHandler}
            >
              <option value="Internship">
                Internship
              </option>
              <option value="Full Time">
                Full Time
              </option>
              <option value="Part Time">
                Part Time
              </option>
            </SelectField>

            <SelectField
              label="Work Mode"
              name="workMode"
              value={form.workMode}
              onChange={changeHandler}
              icon={<FiMonitor size={16} />}
            >
              <option value="Online">
                Online
              </option>
              <option value="Offline">
                Offline
              </option>
              <option value="Hybrid">
                Hybrid
              </option>
            </SelectField>

            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={changeHandler}
              placeholder="Remote / Patna / Delhi"
              required
              icon={<FiMapPin size={16} />}
            />

            <Field
              label="Duration"
              name="duration"
              value={form.duration}
              onChange={changeHandler}
              placeholder="3 Months"
              required
            />
          </div>
        </FormSection>

        {/* Media */}
        <FormSection
          icon={<FiImage size={20} />}
          title="Branding & Media"
          description="Add the visual assets associated with the opportunity."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Logo URL"
              name="companyLogo"
              value={form.companyLogo}
              onChange={changeHandler}
              placeholder="https://..."
              icon={<FiImage size={16} />}
            />

            <Field
              label="Internship Banner URL"
              name="internshipImage"
              value={form.internshipImage}
              onChange={changeHandler}
              placeholder="https://..."
              icon={<FiImage size={16} />}
            />
          </div>

          <div className="mt-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
            <div className="flex items-start gap-3">
              <FiInfo
                size={17}
                className="mt-0.5 shrink-0 text-[#D4AF37]"
              />

              <p className="text-sm leading-6 text-gray-600">
                Use valid image URLs supported by your current
                internship data flow. Uploaded media can be integrated
                later without changing this form structure.
              </p>
            </div>
          </div>
        </FormSection>

        {/* Commercial */}
        <FormSection
          icon={<FiDollarSign size={20} />}
          title="Availability & Pricing"
          description="Configure seats, pricing and application deadline."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="Price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={changeHandler}
              placeholder="499"
              required
              icon={<FiDollarSign size={16} />}
            />

            <Field
              label="Openings"
              name="openings"
              type="number"
              min="1"
              value={form.openings}
              onChange={changeHandler}
              placeholder="1"
              icon={<FiUsers size={16} />}
            />

            <Field
              label="Application Last Date"
              name="lastDate"
              type="date"
              value={form.lastDate}
              onChange={changeHandler}
              required
              icon={<FiCalendar size={16} />}
            />
          </div>
        </FormSection>

        {/* Skills */}
        <FormSection
          icon={<FiTag size={20} />}
          title="Skills & Benefits"
          description="Define the skills and benefits connected to the internship."
        >
          <TextAreaField
            label="Required Skills"
            name="skills"
            value={form.skills}
            onChange={changeHandler}
            placeholder="React, Node.js, MongoDB, JavaScript"
            helper="Separate multiple skills with commas."
          />

          <TextAreaField
            label="Benefits"
            name="benefits"
            value={form.benefits}
            onChange={changeHandler}
            placeholder="Certificate, Internship Report"
            helper="Separate multiple benefits with commas."
          />

          <TextAreaField
            label="Perks"
            name="perks"
            value={form.perks}
            onChange={changeHandler}
            placeholder="Mentorship, Flexible Schedule, Project Experience"
            helper="Separate multiple perks with commas."
          />
        </FormSection>

        {/* Content */}
        <FormSection
          icon={<FiFileText size={20} />}
          title="Internship Details"
          description="Write the information students need before applying."
        >
          <div className="space-y-5">
            <TextAreaField
              label="Description"
              name="description"
              value={form.description}
              onChange={changeHandler}
              placeholder="Describe the internship, learning opportunity and overall experience."
              rows={6}
              required
            />

            <TextAreaField
              label="Responsibilities"
              name="responsibilities"
              value={form.responsibilities}
              onChange={changeHandler}
              placeholder="Build features, collaborate with the team, complete assigned projects..."
              rows={5}
            />

            <TextAreaField
              label="Requirements"
              name="requirements"
              value={form.requirements}
              onChange={changeHandler}
              placeholder="Basic programming knowledge, communication skills..."
              rows={5}
              required
            />
          </div>
        </FormSection>

        {/* Benefits Preview */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiAward size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Publication Checklist
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review the essential information before publishing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            <ChecklistItem
              label="Title"
              completed={Boolean(
                form.title.trim()
              )}
            />

            <ChecklistItem
              label="Category"
              completed={Boolean(
                form.category.trim()
              )}
            />

            <ChecklistItem
              label="Duration"
              completed={Boolean(
                form.duration.trim()
              )}
            />

            <ChecklistItem
              label="Description"
              completed={Boolean(
                form.description.trim()
              )}
            />

            <ChecklistItem
              label="Requirements"
              completed={Boolean(
                form.requirements.trim()
              )}
            />

            <ChecklistItem
              label="Last Date"
              completed={Boolean(
                form.lastDate
              )}
            />

            <ChecklistItem
              label="Price"
              completed={Boolean(
                form.price !== ""
              )}
            />

            <ChecklistItem
              label="Location"
              completed={Boolean(
                form.location.trim()
              )}
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/employee/internships"
              )
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <FiRefreshCw
                  size={17}
                  className="animate-spin"
                />
                Publishing...
              </>
            ) : (
              <>
                <FiSend size={17} />
                Publish Internship
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// =====================================================
// FORM SECTION
// =====================================================

const FormSection = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};


// =====================================================
// FIELD
// =====================================================

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  icon,
}) => {
  return (
    <div>
      <label
        htmlFor={`internship-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
            {icon}
          </span>
        )}

        <input
          id={`internship-${name}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10 ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
};


// =====================================================
// SELECT
// =====================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  children,
  icon,
}) => {
  return (
    <div>
      <label
        htmlFor={`internship-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
            {icon}
          </span>
        )}

        <select
          id={`internship-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10 ${
            icon ? "pl-11" : ""
          }`}
        >
          {children}
        </select>
      </div>
    </div>
  );
};


// =====================================================
// TEXT AREA
// =====================================================

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  helper,
}) => {
  return (
    <div className="mb-5 last:mb-0">
      <label
        htmlFor={`internship-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        id={`internship-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
      />

      {helper && (
        <p className="mt-1.5 text-xs text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
};


// =====================================================
// CHECKLIST ITEM
// =====================================================

const ChecklistItem = ({
  label,
  completed,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          completed
            ? "bg-green-50 text-green-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        <FiCheckCircle size={17} />
      </div>

      <span
        className={`text-sm font-semibold ${
          completed
            ? "text-gray-800"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default CreateInternship;