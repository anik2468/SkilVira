import { useEffect, useState } from "react";
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
  FiSave,
  FiUpload,
  FiUsers,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

const GOLD = "#D4AF37";

const EditInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
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

  const [form, setForm] = useState({
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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(
        "Internship ID is missing."
      );
      return;
    }

    loadInternship();
  }, [id]);

  const loadInternship = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await api.get(
          `/internships/${id}`
        );

      const internship =
        response?.data?.internship ||
        response?.data?.data ||
        response?.data ||
        null;

      if (!internship) {
        throw new Error(
          "Internship details were not returned by the server."
        );
      }

      const normalizedSkills =
        Array.isArray(
          internship?.skills
        )
          ? internship.skills
          : String(
              internship?.skills || ""
            )
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean);

      setSkillList(
        normalizedSkills
      );

      setForm({
        company:
          internship?.company || "",
        companyWebsite:
          internship?.companyWebsite ||
          internship?.website ||
          "",
        companyLogo:
          internship?.companyLogo ||
          internship?.logo ||
          "",
        internshipImage:
          internship?.internshipImage ||
          internship?.image ||
          internship?.banner ||
          "",

        title:
          internship?.title || "",
        category:
          internship?.category ||
          "Software Development",
        internshipType:
          internship?.internshipType ||
          internship?.type ||
          "Internship",
        workMode:
          internship?.workMode ||
          "Remote",
        location:
          internship?.location || "",

        duration:
          internship?.duration || "",
        stipend:
          internship?.stipend || "",
        openings:
          internship?.openings ?? 1,
        lastDate:
          formatDateForInput(
            internship?.lastDate
          ),

        skills:
          normalizedSkills.join(", "),
        description:
          internship?.description ||
          "",
        responsibilities:
          normalizeText(
            internship?.responsibilities
          ),
        requirements:
          normalizeText(
            internship?.requirements
          ),
        perks:
          normalizeText(
            internship?.perks
          ),
      });
    } catch (err) {
      console.error(
        "Load internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load internship details."
      );
    } finally {
      setLoading(false);
    }
  };

  const update = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const addSkill = () => {
    const value =
      skillInput.trim();

    if (!value) return;

    const exists =
      skillList.some(
        (skill) =>
          String(skill)
            .toLowerCase() ===
          value.toLowerCase()
      );

    if (exists) {
      setSkillInput("");
      return;
    }

    const updated = [
      ...skillList,
      value,
    ];

    setSkillList(updated);
    setSkillInput("");

    setForm((prev) => ({
      ...prev,
      skills: updated.join(", "),
    }));
  };

  const removeSkill = (
    skill
  ) => {
    const updated =
      skillList.filter(
        (item) =>
          item !== skill
      );

    setSkillList(updated);

    setForm((prev) => ({
      ...prev,
      skills:
        updated.join(", "),
    }));
  };

  const handleSkillKeyDown = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const uploadImage = async (
    event,
    field,
    setUploadState,
    message
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );
      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadState(true);
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
          "Image URL was not returned after upload."
        );
      }

      setForm((prev) => ({
        ...prev,
        [field]: uploadedUrl,
      }));

      setSuccess(message);
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
      setUploadState(false);
      event.target.value = "";
    }
  };

  const uploadBanner = (
    event
  ) =>
    uploadImage(
      event,
      "internshipImage",
      setUploading,
      "Internship banner uploaded successfully."
    );

  const uploadCompanyLogo = (
    event
  ) =>
    uploadImage(
      event,
      "companyLogo",
      setUploadingLogo,
      "Company logo uploaded successfully."
    );

  const save = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Internship title is required."
      );
      return;
    }

    if (
      !form.company.trim()
    ) {
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
      Number(form.openings) <
      1
    ) {
      setError(
        "Openings must be at least 1."
      );
      return;
    }

    try {
      setSaving(true);

      const finalSkills =
        skillList.length > 0
          ? skillList
          : form.skills
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean);

      const payload = {
        ...form,
        openings: Number(
          form.openings
        ),
        skills: finalSkills,
      };

      const response =
        await api.put(
          `/internships/${id}`,
          payload
        );

      const updated =
        response?.data?.internship ||
        response?.data?.data ||
        response?.data ||
        null;

      if (updated) {
        const updatedSkills =
          Array.isArray(
            updated?.skills
          )
            ? updated.skills
            : finalSkills;

        setSkillList(
          updatedSkills
        );

        setForm((prev) => ({
          ...prev,
          ...updated,
          skills:
            updatedSkills.join(
              ", "
            ),
          lastDate:
            formatDateForInput(
              updated?.lastDate
            ),
        }));
      }

      setSuccess(
        "Internship updated successfully."
      );

      setTimeout(() => {
        navigate(
          "/recruiter/internships"
        );
      }, 900);
    } catch (err) {
      console.error(
        "Update internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update internship."
      );
    } finally {
      setSaving(false);
    }
  };

  const bannerUrl =
    getAssetUrl(
      form.internshipImage
    );

  const logoUrl =
    getAssetUrl(
      form.companyLogo
    );

  if (loading) {
    return <EditSkeleton />;
  }

  if (error && !form.title) {
    return (
      <div className="min-h-[70vh] bg-[#F8F8F6] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FiX size={25} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-950">
              Unable to Load Internship
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadInternship}
              className="mt-6 rounded-xl px-5 py-3 text-sm font-black text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black"
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor:
                  GOLD,
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
                Edit Internship
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Update your internship details, candidate requirements
            and opportunity information.
          </p>
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
          onSubmit={save}
          className="space-y-6"
        >

          {/* Media */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="Visual Identity"
              title="Internship media"
              description="Update the internship banner and company branding."
            />

            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

              <MediaBox
                title="Internship Banner"
                image={bannerUrl}
                uploading={uploading}
                onUpload={uploadBanner}
                icon={<FiImage size={25} />}
                wide
              />

              <MediaBox
                title="Company Logo"
                image={logoUrl}
                uploading={uploadingLogo}
                onUpload={uploadCompanyLogo}
                icon={
                  <FiBriefcase
                    size={25}
                  />
                }
              />

            </div>
          </section>

          {/* Basic */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="01 — Basic Information"
              title="Internship details"
              description="Keep the main opportunity information accurate and easy to understand."
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
                placeholder="Company name"
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

          {/* Opportunity */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="02 — Opportunity Details"
              title="Compensation & availability"
              description="Define the internship timeline and capacity."
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
              description="Update the skills candidates should have for this opportunity."
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiPlus
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                  backgroundColor:
                    GOLD,
                }}
              >
                Add Skill
              </button>
            </div>

            {skillList.length >
              0 && (
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

            {skillList.length ===
              0 && (
              <textarea
                name="skills"
                value={form.skills}
                onChange={update}
                rows={2}
                placeholder="React, Node.js, MongoDB"
                className="mt-4 w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            )}
          </section>

          {/* Content */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <SectionHeading
              eyebrow="04 — Opportunity Content"
              title="Internship content"
              description="Update the information candidates will use to evaluate the opportunity."
            />

            <div className="space-y-5">

              <TextareaField
                label="Description"
                name="description"
                value={form.description}
                onChange={update}
                rows={7}
                required
                placeholder="Describe the internship and learning opportunity..."
              />

              <TextareaField
                label="Responsibilities"
                name="responsibilities"
                value={form.responsibilities}
                onChange={update}
                rows={6}
                placeholder="List the key responsibilities..."
              />

              <TextareaField
                label="Requirements"
                name="requirements"
                value={form.requirements}
                onChange={update}
                rows={6}
                placeholder="Mention technical and eligibility requirements..."
              />

              <TextareaField
                label="Perks & Benefits"
                name="perks"
                value={form.perks}
                onChange={update}
                rows={5}
                placeholder="Certificate, mentorship, recommendation letter, etc..."
              />

            </div>
          </section>

          {/* Save */}
          <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Save Changes
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Update internship
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Review your changes and save the updated internship details.
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
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-60"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
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
}) => (
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
}) => (
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
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
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

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
  required = false,
}) => (
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
      className="w-full resize-y rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
    />
  </div>
);

const MediaBox = ({
  title,
  image,
  uploading,
  onUpload,
  icon,
  wide = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-gray-800">
        {title}
      </label>

      <div
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] ${
          wide
            ? "min-h-[240px]"
            : "min-h-[240px]"
        }`}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className={`w-full object-cover ${
                wide
                  ? "h-[240px]"
                  : "h-[240px] object-contain p-6"
              }`}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 backdrop-blur-sm">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-gray-800">
                <FiUpload />

                {uploading
                  ? "Uploading..."
                  : "Replace"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center p-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              {icon}
            </div>

            <p className="mt-4 text-sm font-black text-gray-800">
              {title}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG or WEBP • Max 5 MB
            </p>

            <label
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-black"
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
                onChange={onUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const EditSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-32 rounded-3xl bg-gray-200" />
      <div className="h-72 rounded-3xl bg-white" />
      <div className="h-80 rounded-3xl bg-white" />
      <div className="h-48 rounded-3xl bg-white" />
      <div className="h-72 rounded-3xl bg-white" />
      <div className="h-48 rounded-3xl bg-gray-900" />
    </div>
  </div>
);

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

const formatDateForInput = (
  value
) => {
  if (!value) return "";

  const date = new Date(
    value
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeText = (
  value
) => {
  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return value || "";
};

export default EditInternship;