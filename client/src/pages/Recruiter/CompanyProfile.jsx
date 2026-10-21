import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import {
  Building2,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link2,
  Users,
} from "lucide-react";

import api from "../../services/api";

const GOLD = "#D4AF37";

const initialCompany = {
  recruiter: "",
  logo: "",
  name: "",
  website: "",
  email: "",
  phone: "",
  industry: "",
  founded: "",
  employees: "",
  headquarters: "",
  description: "",
  linkedin: "",
  twitter: "",
};

const CompanyProfile = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(initialCompany);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getUserId = () =>
    user?.id || user?._id || "";

  const getLogoUrl = (logo) => {
    if (!logo) return "";

    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://")
    ) {
      return logo;
    }

    return `${API_ORIGIN}${logo}`;
  };

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        setError(
          "Recruiter session not found. Please login again."
        );
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("User parse error:", err);

      setLoading(false);
      setError(
        "Unable to read recruiter session."
      );
    }
  }, []);

  useEffect(() => {
    if (getUserId()) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async (
    isRefresh = false
  ) => {
    const recruiterId = getUserId();

    if (!recruiterId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      let backendProfile = null;

      try {
        const response = await api.get(
          `/recruiter/company/${recruiterId}`
        );

        backendProfile =
          response?.data?.company ||
          response?.data?.data ||
          response?.data ||
          null;
      } catch (primaryError) {
        try {
          const response = await api.get(
            `/employee/profile/${recruiterId}`
          );

          backendProfile =
            response?.data?.company ||
            response?.data?.data ||
            null;
        } catch (fallbackError) {
          console.log(
            "Company profile fallback failed:",
            fallbackError
          );
        }
      }

      let localProfile = null;

      try {
        const saved =
          localStorage.getItem("companyProfile");

        localProfile = saved
          ? JSON.parse(saved)
          : null;
      } catch (storageError) {
        console.log(
          "Company localStorage error:",
          storageError
        );
      }

      const source =
        backendProfile ||
        localProfile ||
        {};

      setCompany({
        ...initialCompany,
        ...source,
        recruiter:
          source?.recruiter ||
          recruiterId,
        email:
          source?.email ||
          user?.email ||
          "",
      });
    } catch (err) {
      console.error(
        "Company profile load error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load company profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const update = (event) => {
    const { name, value } =
      event.target;

    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const uploadLogo = async (event) => {
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
        "Logo size must be less than 5 MB."
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

      setCompany((prev) => ({
        ...prev,
        logo: uploadedUrl,
      }));

      setSuccess(
        "Company logo uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Company logo upload error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Logo upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const save = async () => {
    const recruiterId =
      getUserId();

    if (!recruiterId) {
      setError(
        "Recruiter ID is missing."
      );
      return;
    }

    if (!company.name.trim()) {
      setError(
        "Company name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...company,
        recruiter: recruiterId,
        founded:
          company.founded === ""
            ? undefined
            : Number(company.founded),
        employees:
          company.employees === ""
            ? undefined
            : Number(company.employees),
      };

      let saved = false;

      try {
        const response =
          await api.put(
            `/recruiter/company/${recruiterId}`,
            payload
          );

        const savedCompany =
          response?.data?.company ||
          response?.data?.data ||
          response?.data;

        if (savedCompany) {
          setCompany((prev) => ({
            ...prev,
            ...savedCompany,
          }));
        }

        saved = true;
      } catch (primaryError) {
        try {
          const response =
            await api.post(
              "/recruiter/company",
              payload
            );

          const savedCompany =
            response?.data?.company ||
            response?.data?.data ||
            response?.data;

          if (savedCompany) {
            setCompany((prev) => ({
              ...prev,
              ...savedCompany,
            }));
          }

          saved = true;
        } catch (fallbackError) {
          console.log(
            "Company save fallback failed:",
            fallbackError
          );
        }
      }

      localStorage.setItem(
        "companyProfile",
        JSON.stringify({
          ...company,
          recruiter: recruiterId,
        })
      );

      setSuccess(
        saved
          ? "Company profile saved successfully."
          : "Company profile saved locally. Backend save endpoint needs verification."
      );
    } catch (err) {
      console.error(
        "Company profile save error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to save company profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Building2
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Recruiter Workspace
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Company Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Build a complete company presence so students can understand your organization and internship opportunities.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  loadProfile(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Brand Identity
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Company presence
              </h2>
            </div>

            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] p-6 text-center">
              {company.logo ? (
                <img
                  src={getLogoUrl(
                    company.logo
                  )}
                  alt={
                    company.name ||
                    "Company Logo"
                  }
                  className="h-32 w-32 rounded-3xl border border-gray-200 bg-white object-contain p-3 shadow-sm"
                />
              ) : (
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-3xl text-black shadow-sm"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <Building2 size={52} />
                </div>
              )}

              <p className="mt-5 text-sm font-black text-gray-900">
                {company.name ||
                  "Your Company"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Recommended: square PNG/JPG, up to 5 MB
              </p>

              <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-sm transition hover:border-[#D4AF37] hover:text-black">
                <Upload size={15} />

                {uploading
                  ? "Uploading..."
                  : "Upload Logo"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadLogo}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-6 space-y-4">
              <PreviewInfo
                icon={<Building2 size={16} />}
                label="Company"
                value={
                  company.name ||
                  "Not added"
                }
              />

              <PreviewInfo
                icon={<Mail size={16} />}
                label="Official Email"
                value={
                  company.email ||
                  "Not added"
                }
              />

              <PreviewInfo
                icon={<MapPin size={16} />}
                label="Headquarters"
                value={
                  company.headquarters ||
                  "Not added"
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Company Information
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Organization details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Company Name"
                name="name"
                value={company.name}
                onChange={update}
                icon={<Building2 size={16} />}
                placeholder="e.g. SkilVira Technologies"
                required
              />

              <Field
                label="Official Email"
                name="email"
                value={company.email}
                onChange={update}
                icon={<Mail size={16} />}
                placeholder="company@example.com"
                type="email"
              />

              <Field
                label="Website"
                name="website"
                value={company.website}
                onChange={update}
                icon={<Globe2 size={16} />}
                placeholder="https://example.com"
              />

              <Field
                label="Phone Number"
                name="phone"
                value={company.phone}
                onChange={update}
                icon={<Phone size={16} />}
                placeholder="+91..."
              />

              <Field
                label="Industry"
                name="industry"
                value={company.industry}
                onChange={update}
                icon={<Building2 size={16} />}
                placeholder="e.g. Information Technology"
              />

              <Field
                label="Founded Year"
                name="founded"
                value={company.founded}
                onChange={update}
                icon={<Building2 size={16} />}
                placeholder="2025"
                type="number"
              />

              <Field
                label="Employees"
                name="employees"
                value={company.employees}
                onChange={update}
                icon={<Users size={16} />}
                placeholder="50"
                type="number"
              />

              <Field
                label="Headquarters"
                name="headquarters"
                value={company.headquarters}
                onChange={update}
                icon={<MapPin size={16} />}
                placeholder="City, State, Country"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Company Description
                </label>

                <textarea
                  name="description"
                  value={company.description}
                  onChange={update}
                  rows={6}
                  placeholder="Tell students and professionals about your company, culture, products and opportunities..."
                  className="w-full resize-y rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
                />
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOLD,
              }}
            >
              Digital Presence
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Social profiles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add official social links for your organization.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="LinkedIn"
              name="linkedin"
              value={company.linkedin}
              onChange={update}
              icon={<Link2 size={16} />}
              placeholder="https://linkedin.com/company/..."
            />

            <Field
              label="Twitter / X"
              name="twitter"
              value={company.twitter}
              onChange={update}
              icon={<Link2 size={16} />}
              placeholder="https://x.com/..."
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-gray-900">
              Keep your company profile updated
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Accurate company information builds trust with students.
            </p>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-50"
            style={{
              backgroundColor: GOLD,
            }}
          >
            <Save size={17} />

            {saving
              ? "Saving Profile..."
              : "Save Company Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
        <span className="text-gray-400">
          {icon}
        </span>

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
        min={
          type === "number"
            ? 0
            : undefined
        }
        required={required}
        className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
      />
    </div>
  );
};

const PreviewInfo = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
      <div className="mt-0.5 text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[30px] bg-gray-900" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[520px] rounded-3xl bg-white" />
          <div className="h-[520px] rounded-3xl bg-white lg:col-span-2" />
        </div>

        <div className="h-48 rounded-3xl bg-white" />
      </div>
    </div>
  );
};

export default CompanyProfile;