import { API_URL } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiDownload, FiImage } from "react-icons/fi";
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

export default function GalleryBrochure() {
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    let active = true;
    api.get("/company-settings")
      .then(({ data }) => {
        if (active) setSetting(data?.setting || data?.data?.setting || null);
      })
      .catch(() => {
        if (active) setSetting(null);
      });
    return () => { active = false; };
  }, []);

  const gallery = Array.isArray(setting?.gallery) ? setting.gallery : [];
  const brochure = setting?.brochure || "";

  if (!gallery.length && !brochure) return null;

  return (
    <section className="relative overflow-hidden bg-[#FBFBF8] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#8B6B10]">
              <FiImage /> Explore SkilVira
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Our Gallery
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              A glimpse of our community, events and learning journey.
            </p>
          </div>

          {brochure && (
            <a
              href={assetUrl(brochure)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-[#D4AF37] hover:text-black sm:self-auto"
            >
              <FiDownload /> View / Download Brochure <FiArrowUpRight />
            </a>
          )}
        </div>

        {gallery.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={assetUrl(image)}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={assetUrl(image)}
                  alt={`SkilVira gallery ${index + 1}`}
                  loading="lazy"
                  className="h-40 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-52"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
