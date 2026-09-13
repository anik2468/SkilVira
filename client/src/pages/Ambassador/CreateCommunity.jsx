import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiGlobe,
  FiImage,
  FiMapPin,
  FiSave,
  FiShield,
  FiUpload,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const CreateCommunity = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "student",
    location: "",
    banner: "",
    logo: "",
    collegeId: "",
    universityId: "",
    rules: "",
    joinMode: "open",
  });

  const [saving, setSaving] =
    useState(false);

  const [uploadingBanner, setUploadingBanner] =
    useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setError(
          "Ambassador session not found."
        );
        return;
      }

      const parsed =
        JSON.parse(storedUser);

      setUser(parsed);

      const collegeId =
        parsed?.collegeId ||
        parsed?.college?._id ||
        parsed?.college ||
        "";

      const universityId =
        parsed?.universityId ||
        parsed?.university?._id ||
        "";

      setForm((prev) => ({
        ...prev,
        collegeId,
        universityId,
      }));
    } catch (err) {
      console.error(
        "Create community user error:",
        err
      );

      setError(
        "Unable to read ambassador session."
      );
    }
  }, []);

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

  const uploadImage = async (
    event,
    field,
    setUploading
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
        "Please select a valid image."
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
      setUploading(true);
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

      const url =
        response?.data?.url ||
        response?.data?.data?.url ||
        response?.data?.path ||
        response?.data?.data?.path ||
        "";

      if (!url) {
        throw new Error(
          "No upload URL returned."
        );
      }

      setForm((prev) => ({
        ...prev,
        [field]: url,
      }));

      setSuccess(
        field === "banner"
          ? "Community banner uploaded successfully."
          : "Community logo uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Community image upload error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Community name is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Community description is required."
      );
      return;
    }

    if (
      !form.collegeId &&
      !form.universityId
    ) {
      setError(
        "Your ambassador account is not linked to a college/university yet."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        ambassador:
          user?.id ||
          user?._id ||
          "",
        createdBy:
          user?.id ||
          user?._id ||
          "",
      };

      const response =
        await api.post(
          "/communities",
          payload
        );

      const created =
        response?.data?.community ||
        response?.data?.data ||
        response?.data ||
        null;

      if (!created) {
        throw new Error(
          "Community was not returned by the server."
        );
      }

      setSuccess(
        "Community created successfully."
      );

      setTimeout(() => {
        navigate(
          `/ambassador/communities/${created._id}`
        );
      }, 700);
    } catch (err) {
      console.error(
        "Create community error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create community."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        <section className="rounded-[30px] bg-black p-6 text-white shadow-2xl sm:p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Community Builder
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Create Community
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                Create a dedicated student community for your linked
                college or campus.
              </p>
            </div>

            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
              style={{ backgroundColor: GOLD }}
            >
              <FiUsers size={25} />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="mt-0.5" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <div className="flex items-start gap-2">
              <FiCheckCircle className="mt-0.5" />
              {success}
            </div>
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-6"
        >
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              title="Community identity"
              description="Set the name, type and basic details of your community."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Community Name"
                name="name"
                value={form.name}
                onChange={update}
                placeholder="e.g. GEC Sheikhpura Developers"
                required
              />

              <SelectField
                label="Community Type"
                name="type"
                value={form.type}
                onChange={update}
                options={[
                  "student",
                  "professional",
                  "technical",
                  "career",
                  "general",
                ]}
              />

              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={update}
                placeholder="College campus / City"
                icon={<FiMapPin />}
              />

              <SelectField
                label="Join Mode"
                name="joinMode"
                value={form.joinMode}
                onChange={update}
                options={[
                  "open",
                  "approval",
                  "invite-only",
                ]}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Description
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={update}
                  rows={6}
                  placeholder="Explain who the community is for, what members will get and what activities happen here..."
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Community Rules
                </label>

                <textarea
                  name="rules"
                  value={form.rules}
                  onChange={update}
                  rows={5}
                  placeholder="Add community rules, code of conduct and participation guidelines..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              title="Community branding"
              description="Add a professional logo and banner for your community."
            />

            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <MediaUpload
                title="Community Banner"
                image={form.banner}
                uploading={uploadingBanner}
                onUpload={(e) =>
                  uploadImage(
                    e,
                    "banner",
                    setUploadingBanner
                  )
                }
                wide
                icon={<FiImage size={28} />}
              />

              <MediaUpload
                title="Community Logo"
                image={form.logo}
                uploading={uploadingLogo}
                onUpload={(e) =>
                  uploadImage(
                    e,
                    "logo",
                    setUploadingLogo
                  )
                }
                icon={<FiGlobe size={28} />}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black"
                style={{ backgroundColor: GOLD }}
              >
                <FiShield size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-gray-900">
                  College-restricted management
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  This community is being created for the college or
                  university linked to your ambassador account. Backend
                  authorization should validate this relationship before
                  allowing creation.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Final Step
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Create your community
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Members can be managed after the community is created.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{ backgroundColor: GOLD }}
              >
                <FiSave />

                {saving
                  ? "Creating..."
                  : "Create Community"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

const SectionHeading = ({
  title,
  description,
}) => (
  <div className="mb-6">
    <p
      className="text-xs font-black uppercase tracking-[0.18em]"
      style={{ color: GOLD }}
    >
      Community Setup
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
  icon,
  required = false,
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
        <span className="text-red-500">*</span>
      )}
    </label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
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
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() +
            option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

const MediaUpload = ({
  title,
  image,
  uploading,
  onUpload,
  icon,
  wide = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-gray-800">
      {title}
    </label>

    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8]">
      {image ? (
        <>
          <img
            src={getAssetUrl(image)}
            alt={title}
            className={`w-full object-cover ${
              wide
                ? "h-[240px]"
                : "h-[240px] object-contain p-6"
            }`}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-gray-800">
              <FiUpload />
              Replace

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
        <div className="flex h-[240px] flex-col items-center justify-center p-6 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
            style={{ backgroundColor: GOLD }}
          >
            {icon}
          </div>

          <p className="mt-4 text-sm font-black text-gray-800">
            Upload {title.toLowerCase()}
          </p>

          <label
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-black"
            style={{ backgroundColor: GOLD }}
          >
            <FiUpload />
            {uploading ? "Uploading..." : "Choose Image"}

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

const getAssetUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

export default CreateCommunity;