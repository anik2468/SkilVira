import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiInstagram, FiEdit3 } from "react-icons/fi";
import api from "../services/api";

export default function ContactSupport() {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [settingsPath, setSettingsPath] = useState("/employee/contact-settings");

  useEffect(() => {
    let active = true;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = String(user?.role || "").toLowerCase();
      if (["employee", "control", "admin", "superadmin", "super_admin"].includes(role)) {
        setCanEdit(true);
        setSettingsPath(
          ["control", "admin", "superadmin", "super_admin"].includes(role)
            ? "/control/contact-settings"
            : "/employee/contact-settings"
        );
      }
    } catch {}

    api.get("/company-settings")
      .then(({ data }) => {
        if (active) setCompany(data?.setting || data?.data?.setting || data?.setting || null);
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.message || "Contact details are temporarily unavailable.");
      });

    return () => { active = false; };
  }, []);

  const email = company?.supportEmail || company?.email;
  const address = company?.address;
  const mapUrl = company?.mapUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "");
  const socials = [
    ["Instagram", company?.instagram],
    ["LinkedIn", company?.linkedin],
    ["YouTube", company?.youtube],
    ["Facebook", company?.facebook],
    ["X / Twitter", company?.twitter],
  ].filter(([, url]) => url);

  return (
    <main className="min-h-[70vh] bg-[#FAFAF8] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-black px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">SKILVIRA SUPPORT</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Contact & Support</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Need help with courses, internships, payments or your account? Contact the SkilVira team using the details below.
          </p>
          {canEdit && (
            <Link to={settingsPath} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-black hover:bg-[#e4c454]">
              <FiEdit3 /> Manage company details
            </Link>
          )}
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <FiMail className="text-2xl text-[#AD8A1B]" />
            <h2 className="mt-4 text-lg font-black text-gray-950">Email support</h2>
            {email ? (
              <a className="mt-2 block break-all font-semibold text-[#8B6B10] hover:underline" href={`mailto:${email}`}>{email}</a>
            ) : <p className="mt-2 text-sm text-gray-500">Support email will be added soon.</p>}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <FiPhone className="text-2xl text-[#AD8A1B]" />
            <h2 className="mt-4 text-lg font-black text-gray-950">Call us</h2>
            {company?.phone ? (
              <a className="mt-2 block font-semibold text-[#8B6B10] hover:underline" href={`tel:${company.phone}`}>{company.phone}</a>
            ) : <p className="mt-2 text-sm text-gray-500">Contact number will be added soon.</p>}
            {company?.supportHours && <p className="mt-2 text-sm text-gray-500">{company.supportHours}</p>}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:col-span-2">
            <FiMapPin className="text-2xl text-[#AD8A1B]" />
            <h2 className="mt-4 text-lg font-black text-gray-950">Office address</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
              {address || "Office address will be added soon."}
            </p>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#8B6B10] hover:bg-[#D4AF37]/10">
                <FiMapPin /> Open location in Maps
              </a>
            )}
            {company?.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="ml-3 mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#8B6B10] hover:bg-[#D4AF37]/10">
                <FiGlobe /> Website
              </a>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:col-span-2">
            <FiInstagram className="text-2xl text-[#AD8A1B]" />
            <h2 className="mt-4 text-lg font-black text-gray-950">Connect with us</h2>
            {socials.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-[#D4AF37] hover:text-[#8B6B10]">
                    {name}
                  </a>
                ))}
              </div>
            ) : <p className="mt-2 text-sm text-gray-500">Social media links will be added soon.</p>}
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Explore learning opportunities:{" "}
          <Link to="/courses" className="font-bold text-[#8B6B10] hover:underline">Courses</Link>
          {" · "}
          <Link to="/internships" className="font-bold text-[#8B6B10] hover:underline">Internships</Link>
        </div>
      </div>
    </main>
  );
}
