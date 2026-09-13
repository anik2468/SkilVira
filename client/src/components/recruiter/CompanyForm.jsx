import { useState } from "react";
import {
  FiUpload,
  FiSave,
  FiBuilding,
} from "react-icons/fi";

import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { uploadFile } from "../../services/uploadService";

const CompanyForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState({
    companyName: initialData.companyName || "",
    companyEmail: initialData.companyEmail || "",
    phone: initialData.phone || "",
    website: initialData.website || "",
    industry: initialData.industry || "",
    location: initialData.location || "",
    description: initialData.description || "",
    logo: initialData.logo || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Logo size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const data = await uploadFile(file);

      if (!data?.url) {
        throw new Error("Logo URL was not returned.");
      }

      setForm((prev) => ({
        ...prev,
        logo: data.url,
      }));
    } catch (error) {
      console.error("Logo upload failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Logo upload failed."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!form.companyEmail.trim()) {
      alert("Please enter company email.");
      return;
    }

    if (onSubmit) {
      await onSubmit({
        ...form,
        companyName: form.companyName.trim(),
        companyEmail: form.companyEmail.trim(),
        phone: form.phone.trim(),
        website: form.website.trim(),
        industry: form.industry.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#9A7B14]">
          <FiBuilding size={22} />
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Company Profile
          </h2>

          <p className="text-sm text-slate-500">
            Keep your company information accurate and professional.
          </p>
        </div>
      </div>

      {/* Logo */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-black text-slate-900">
            Company Logo
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upload a clear company logo. Maximum 5 MB.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {form.logo ? (
              <img
                src={form.logo}
                alt="Company logo"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <FiBuilding
                size={30}
                className="text-slate-300"
              />
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 transition hover:border-[#D4AF37] hover:bg-[#FFF8E7]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#9A7B14]">
              <FiUpload size={18} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                {uploading
                  ? "Uploading..."
                  : form.logo
                    ? "Change Logo"
                    : "Upload Logo"}
              </p>

              <p className="text-xs text-slate-400">
                PNG, JPG, WEBP
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading || loading}
              onChange={handleLogoUpload}
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
            Provide the primary company details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />

          <Input
            type="email"
            label="Company Email"
            name="companyEmail"
            value={form.companyEmail}
            onChange={handleChange}
            placeholder="company@example.com"
            required
          />

          <Input
            type="tel"
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter contact number"
          />

          <Input
            type="url"
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://company.com"
          />

          <Input
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
          />

          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Patna, Bihar"
          />
        </div>
      </section>

      {/* Description */}
      <section>
        <Textarea
          label="Company Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          placeholder="Tell students and candidates about your company..."
        />
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-7 py-3 text-sm font-black text-black shadow-sm transition hover:bg-[#E1C14E] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <FiSave size={17} />
              Save Company Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;