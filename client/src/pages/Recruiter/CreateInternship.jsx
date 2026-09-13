import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiImage,
  FiMapPin,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUpload,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { createInternship } from "../../services/internshipService";
import api from "../../services/api";

const GOLD = "#D4AF37";

const CreateInternship = () => {
  const navigate = useNavigate();

  let storedUser = null;

  try {
    storedUser = JSON.parse(
      localStorage.getItem("user")
    );
  } catch (error) {
    console.error("User parse error:", error);
  }

  const [form, setForm] = useState({
    recruiter:
      storedUser?.id ||
      storedUser?._id ||
      "",

    company: "",
    companyWebsite: "",
    companyLogo: "",
    internshipImage: "",

    title: "",
    category: "Software Development",
    internshipType: "Internship",
    workMode: "Remote",
    location: "",

    duration: "",
    stipend: "",
    openings: 1,
    lastDate: "",

    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
    perks: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [skillInput, setSkillInput] =
    useState("");

  const [skillList, setSkillList] =
    useState([]);

  const update = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    const alreadyExists = skillList.some(
      (skill) =>
        skill.toLowerCase() ===
        value.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkillList((prev) => [
      ...prev,
      value,
    ]);

    setSkillInput("");

    setForm((prev) => ({
      ...prev,
      skills: [...skillList, value].join(", "),
    }));
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills =
      skillList.filter(
        (skill) => skill !== skillToRemove
      );

    setSkillList(updatedSkills);

    setForm((prev) => ({
      ...prev,
      skills: updatedSkills.join(", "),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const uploadFile = async (
    event,
    field,
    setUploadingState,
    successMessage
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingState(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const response =
        await api.post(
          "/upload/avatar",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const uploadedUrl =
        response?.data?.url ||
        response?.data?.data?.url ||
        response?.data?.path ||
        response?.data?.data?.path ||
        "";

      if (!uploadedUrl) {
        throw new Error(
          "Upload succeeded but no image URL was returned."
        );
      }

      setForm((prev) => ({
        ...prev,
        [field]: uploadedUrl,
      }));

      setSuccess(successMessage);
    } catch (err) {
      console.error(
        "Image upload error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploadingState(false);
      event.target.value = "";
    }
  };

  const uploadBanner = (event) =>
    uploadFile(
      event,
      "internshipImage",
      setUploading,
      "Internship banner uploaded successfully."
    );

  const uploadCompanyLogo = (event) =>
    uploadFile(
      event,
      "companyLogo",
      setUploadingLogo,
      "Company logo uploaded successfully."
    );

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Internship title is required."
      );
      return;
    }

    if (!form.company.trim()) {
      setError(
        "Company name is required."
      );
      return;
    }

    if (
      !form.description.trim()
    ) {
      setError(
        "Internship description is required."
      );
      return;
    }

    if (
      Number(form.openings) < 1
    ) {
      setError(
        "Openings must be at least 1."
      );
      return;
    }

    try {
      setLoading(true);

      const finalSkills =
        skillList.length > 0
          ? skillList
          : form.skills
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean);

      await createInternship({
        ...form,

        recruiter:
          form.recruiter ||
          storedUser?.id ||
          storedUser?._id ||
          "",

        openings: Number(
          form.openings
        ),

        skills: finalSkills,
      });

      setSuccess(
        "Internship created successfully and sent for approval."
      );

      setTimeout(() => {
        navigate(
          "/recruiter/internships"
        );
      }, 900);
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

  const bannerUrl = form.internshipImage
    ? form.internshipImage.startsWith(
        "http"
      )
      ? form.internshipImage
      : `http://localhost:5000${form.internshipImage}`
    : "";

  const logoUrl = form.companyLogo
    ? form.companyLogo.startsWith("http")
      ? form.companyLogo
      : `http://localhost:5000${form.companyLogo}`
    : "";

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
            >
              <FiArrowLeft />
              Back
            </button>

            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiBriefcase size={21} />
              </div>

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Recruiter Workspace
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                  Post New Internship
                </h1>
              </div>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Create a clear and complete internship listing to
              attract relevant student talent.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiX className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-6"
        >
          {/* Media */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="Visual Identity"
              title="Internship media"
              description="Use clear branding and a professional banner."
            />

            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

              {/* Banner */}
              <div>
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Internship Banner
                </label>

                <div className="relative min-h-[240px] overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8]">
                  {bannerUrl ? (
                    <>
                      <img
                        src={bannerUrl}
                        alt="Internship banner"
                        className="h-[240px] w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 backdrop-blur-sm">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-gray-800">
                          <FiUpload />
                          Replace Banner

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                              uploadBanner
                            }
                            disabled={
                              uploading
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[240px] flex-col items-center justify-center p-6 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                        style={{
                          backgroundColor:
                            GOLD,
                        }}
                      >
                        <FiImage
                          size={25}
                        />
                      </div>

                      <p className="mt-4 text-sm font-black text-gray-800">
                        Upload internship banner
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG or WEBP • Max 5 MB
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-black"
                        style={{
                          backgroundColor:
                            GOLD,
                        }}
                      >
                        <FiUpload />
                        {uploading
                          ? "Uploading..."
                          : "Choose Image"}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            uploadBanner
                          }
                          disabled={
                            uploading
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Logo */}
              <div>
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Company Logo
                </label>

                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] p-6 text-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company logo"
                      className="h-28 w-28 rounded-3xl border border-gray-200 bg-white object-contain p-3 shadow-sm"
                    />
                  ) : (
                    <div
                      className="flex h-28 w-28 items-center justify-center rounded-3xl text-black"
                      style={{
                        backgroundColor:
                          GOLD,
                      }}
                    >
                      <FiBriefcase
                        size={38}
                      />
                    </div>
                  )}

                  <p className="mt-4 text-sm font-black text-gray-800">
                    Company branding
                  </p>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
                  >
                    <FiUpload />

                    {uploadingLogo
                      ? "Uploading..."
                      : "Upload Logo"}

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        uploadCompanyLogo
                      }
                      disabled={
                        uploadingLogo
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Details */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="01 — Basic Information"
              title="Internship details"
              description="Give candidates the information they need at first glance."
            />

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="Internship Title"
                name="title"
                value={form.title}
                onChange={update}
                placeholder="e.g. Full Stack Development Intern"
                required
                icon={<FiBriefcase />}
              />

              <Field
                label="Company Name"
                name="company"
                value={form.company}
                onChange={update}
                placeholder="e.g. SkilVira Technologies"
                required
                icon={<FiBriefcase />}
              />

              <Field
                label="Company Website"
                name="companyWebsite"
                value={form.companyWebsite}
                onChange={update}
                placeholder="https://example.com"
                icon={<FiGlobe />}
              />

              <SelectField
                label="Category"
                name="category"
                value={form.category}
                onChange={update}
                options={[
                  "Software Development",
                  "Web Development",
                  "AI/ML",
                  "Cyber Security",
                  "Data Science",
                  "UI/UX",
                  "Cloud Computing",
                  "DevOps",
                  "Product Management",
                  "Marketing",
                  "Finance",
                  "Human Resources",
                  "Other",
                ]}
              />

              <SelectField
                label="Internship Type"
                name="internshipType"
                value={form.internshipType}
                onChange={update}
                options={[
                  "Internship",
                  "Full Time",
                  "Part Time",
                  "Contract",
                  "Apprenticeship",
                ]}
              />

              <SelectField
                label="Work Mode"
                name="workMode"
                value={form.workMode}
                onChange={update}
                options={[
                  "Remote",
                  "Hybrid",
                  "Onsite",
                ]}
              />

              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={update}
                placeholder="e.g. Patna, Bihar"
                icon={<FiMapPin />}
              />

              <Field
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={update}
                placeholder="e.g. 3 Months"
                icon={<FiClock />}
              />
            </div>
          </section>

          {/* Compensation & dates */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="02 — Opportunity Details"
              title="Compensation & availability"
              description="Set clear expectations for candidates."
            />

            <div className="grid gap-5 md:grid-cols-3">

              <Field
                label="Stipend"
                name="stipend"
                value={form.stipend}
                onChange={update}
                placeholder="e.g. ₹10,000 / month"
                icon={<FiDollarSign />}
              />

              <Field
                label="Openings"
                name="openings"
                type="number"
                min="1"
                value={form.openings}
                onChange={update}
                placeholder="1"
                icon={<FiUsers />}
              />

              <Field
                label="Application Last Date"
                name="lastDate"
                type="date"
                value={form.lastDate}
                onChange={update}
                icon={<FiCalendar />}
              />
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="03 — Candidate Profile"
              title="Skills & technologies"
              description="Add technologies and skills relevant to this opportunity."
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiPlus
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={17}
                />

                <input
                  value={skillInput}
                  onChange={(e) =>
                    setSkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSkillKeyDown
                  }
                  placeholder="Add a skill, e.g. React"
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={addSkill}
                className="rounded-2xl px-5 py-3 text-sm font-black text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                Add Skill
              </button>
            </div>

            {skillList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skillList.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(
                            skill
                          )
                        }
                        className="text-gray-400 hover:text-red-600"
                      >
                        <FiX />
                      </button>
                    </span>
                  )
                )}
              </div>
            )}

            {skillList.length === 0 && (
              <div className="mt-4">
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={update}
                  rows={2}
                  placeholder="Or enter comma-separated skills: React, Node.js, MongoDB"
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>
            )}
          </section>

          {/* Content */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="04 — Opportunity Content"
              title="Internship description"
              description="Write a detailed and useful internship listing."
            />

            <div className="space-y-5">
              <TextareaField
                label="Description"
                name="description"
                value={form.description}
                onChange={update}
                rows={7}
                required
                placeholder="Describe the internship, learning opportunity, company environment and what candidates can expect..."
              />

              <TextareaField
                label="Responsibilities"
                name="responsibilities"
                value={form.responsibilities}
                onChange={update}
                rows={6}
                placeholder="List the key responsibilities and day-to-day work..."
              />

              <TextareaField
                label="Requirements"
                name="requirements"
                value={form.requirements}
                onChange={update}
                rows={6}
                placeholder="Mention academic, technical and other eligibility requirements..."
              />

              <TextareaField
                label="Perks & Benefits"
                name="perks"
                value={form.perks}
                onChange={update}
                rows={5}
                placeholder="e.g. Certificate, Letter of Recommendation, mentorship, flexible timing..."
              />
            </div>
          </section>

          {/* Review */}
          <section className="overflow-hidden rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Final Review
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Ready to submit your internship?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Once submitted, the internship will follow the platform's
                  approval workflow before becoming publicly available.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  <FiArrowLeft />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiSave />

                  {loading
                    ? "Publishing..."
                    : "Publish Internship"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <div className="mb-6">
      <p
        className="text-xs font-black uppercase tracking-[0.18em]"
        style={{
          color: GOLD,
        }}
      >
        {eyebrow}
      </p>

      <h2 className="mt-1 text-2xl font-black text-gray-950">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon,
  min,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
        {icon && (
          <span className="text-gray-400">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
      />
    </div>
  );
};

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-gray-800">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-[#D4AF37] focus:bg-white"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </div>
  );
};

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-gray-800">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-y rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
      />
    </div>
  );
};

export default CreateInternship;