import { useEffect, useState } from "react";
import { FiImage, FiUpload } from "react-icons/fi";
import api from "../../services/api.js";

export default function PlatformLogoSettings() {
  const [logoUrl, setLogoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/platform-settings")
      .then(({ data }) => {
        if (active) {
          setLogoUrl(data?.settings?.platformLogoUrl || "");
        }
      })
      .catch(() => {
        if (active) setError("Unable to load the current website logo.");
      });

    return () => {
      active = false;
    };
  }, []);

  const uploadLogo = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose a logo image first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const { data } = await api.post("/platform-settings/logo", formData);

      setLogoUrl(data?.logoUrl || data?.settings?.platformLogoUrl || "");
      setFile(null);
      setMessage("Website logo updated successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Logo upload failed. Check permissions and Cloudinary configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
          <FiImage size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Website Logo</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload the main SkilVira logo shown in the public website header.
          </p>
        </div>
      </div>

      {logoUrl && (
        <div className="mt-5 flex min-h-24 items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={logoUrl}
            alt="Current SkilVira website logo"
            className="max-h-20 max-w-full object-contain"
          />
        </div>
      )}

      <form onSubmit={uploadLogo} className="mt-5 space-y-3">
        <label className="block text-sm font-bold text-slate-700">
          Choose logo (PNG, JPG or WEBP; maximum 5 MB)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setError("");
              setMessage("");
            }}
            className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>

        {file && <p className="text-sm text-slate-600">Selected: {file.name}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={!file || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiUpload />
          {loading ? "Uploading..." : logoUrl ? "Change Website Logo" : "Upload Website Logo"}
        </button>
      </form>
    </section>
  );
}
