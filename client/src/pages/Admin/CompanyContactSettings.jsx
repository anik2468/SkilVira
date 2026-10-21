import { API_URL } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUpload, FiTrash2, FiFileText } from "react-icons/fi";
import api from "../../services/api";

const assetUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = String(
    api.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    API_URL
  );
  let origin = base;
  if (origin.endsWith("/api/")) origin = origin.slice(0, -5);
  else if (origin.endsWith("/api")) origin = origin.slice(0, -4);
  while (origin.endsWith("/")) origin = origin.slice(0, -1);
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};

const fields = [
  ["companyName", "Company name", "text"],
  ["email", "General email", "email"],
  ["supportEmail", "Support email", "email"],
  ["phone", "Contact phone number", "tel"],
  ["website", "Website URL", "url"],
  ["address", "Office address", "textarea"],
  ["mapUrl", "Google Maps location URL", "url"],
  ["supportHours", "Support hours", "text"],
  ["instagram", "Instagram profile URL", "url"],
  ["linkedin", "LinkedIn profile URL", "url"],
  ["youtube", "YouTube channel URL", "url"],
  ["facebook", "Facebook page URL", "url"],
  ["twitter", "X / Twitter profile URL", "url"],
  ["about", "About company", "textarea"],
];

export default function CompanyContactSettings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [brochureFile, setBrochureFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [assetSaving, setAssetSaving] = useState(false);

  useEffect(() => {
    api.get("/company-settings")
      .then(({ data }) => setForm(data?.setting || data?.data?.setting || {}))
      .catch((err) => setError(err?.response?.data?.message || "Unable to load company details."))
      .finally(() => setLoading(false));
  }, []);

  const uploadAssets = async () => {
    if (!brochureFile && galleryFiles.length === 0) {
      setError("Choose a brochure or at least one gallery image first.");
      return;
    }

    const payload = new FormData();
    if (brochureFile) payload.append("brochure", brochureFile);
    galleryFiles.forEach((file) => payload.append("gallery", file));

    setAssetSaving(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post(
        "/company-settings/upload",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data?.setting) setForm((current) => ({ ...current, ...data.setting }));
      setBrochureFile(null);
      setGalleryFiles([]);
      setMessage("Brochure and gallery updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to upload assets.");
    } finally {
      setAssetSaving(false);
    }
  };

  const removeGalleryImage = async (index) => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.delete(`/company-settings/gallery/${index}`);
      if (data?.setting) setForm((current) => ({ ...current, ...data.setting }));
      else setForm((current) => ({
        ...current,
        gallery: (current.gallery || []).filter((_, i) => i !== index),
      }));
      setMessage("Gallery image removed.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to remove gallery image.");
    }
  };

  const removeBrochure = async () => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.delete("/company-settings/brochure");
      if (data?.setting) setForm((current) => ({ ...current, ...data.setting }));
      else setForm((current) => ({ ...current, brochure: "" }));
      setMessage("Brochure removed from the homepage.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to remove brochure.");
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {};
      fields.forEach(([key]) => { payload[key] = String(form[key] || "").trim(); });
      const { data } = await api.put("/company-settings", payload);
      setForm(data?.setting || { ...form, ...payload });
      setMessage("Company contact details saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save contact details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading company settings…</div>;

  return (
    <main className="min-h-screen bg-[#F8F8F6] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to="/contact" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#8B6B10]">
          <FiArrowLeft /> View public Contact page
        </Link>
        <h1 className="text-3xl font-black text-gray-950">Contact & Support Settings</h1>
        <p className="mt-2 mb-6 text-sm leading-6 text-gray-600">
          Update company contact details and social links shown on the public SkilVira website.
        </p>

        <form onSubmit={save} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(([key, label, type]) => (
              <label key={key} className={`block text-sm font-bold text-gray-800 ${type === "textarea" ? "sm:col-span-2" : ""}`}>
                {label}
                {type === "textarea" ? (
                  <textarea
                    rows={key === "address" ? 3 : 4}
                    value={form[key] || ""}
                    onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal outline-none focus:border-[#D4AF37]"
                  />
                ) : (
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal outline-none focus:border-[#D4AF37]"
                  />
                )}
              </label>
            ))}
          </div>

          <section className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-black text-gray-950">Homepage Gallery & Brochure</h2>
            <p className="mt-2 text-sm text-gray-500">
              Images: JPG, PNG or WEBP up to 5 MB each. Brochure: PDF or image up to 10 MB.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Company brochure</h3>
                {form.brochure ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={assetUrl(form.brochure)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 underline"
                    >
                      <FiFileText /> View current brochure
                    </a>
                    <button
                      type="button"
                      onClick={removeBrochure}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">No brochure uploaded yet.</p>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) => setBrochureFile(event.target.files?.[0] || null)}
                  className="mt-4 block w-full text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Selecting a new brochure replaces the current one.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Add gallery images</h3>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))}
                  className="mt-4 block w-full text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                  You can upload several images together. Existing images are kept.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={uploadAssets}
              disabled={assetSaving}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-black text-white disabled:opacity-50"
            >
              <FiUpload /> {assetSaving ? "Uploading…" : "Upload brochure / gallery"}
            </button>

            <div className="mt-7">
              <h3 className="font-bold text-gray-900">Current gallery</h3>
              {Array.isArray(form.gallery) && form.gallery.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {form.gallery.map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-gray-200">
                      <a href={assetUrl(image)} target="_blank" rel="noreferrer">
                        <img
                          src={assetUrl(image)}
                          alt={`SkilVira gallery image ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-3 py-2 text-xs font-bold text-red-700"
                      >
                        <FiTrash2 /> Remove image
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No gallery images uploaded yet.</p>
              )}
            </div>
          </section>

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}

          <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-black text-gray-950 disabled:opacity-50">
            <FiSave /> {saving ? "Saving…" : "Save company details"}
          </button>
        </form>
      </div>
    </main>
  );
}
