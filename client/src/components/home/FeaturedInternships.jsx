import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getInternships,
} from "../../services/internshipService";

const GOLD = "#D4AF37";

const FeaturedInternships = () => {
  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getInternships();

      const list =
        Array.isArray(
          data?.internships
        )
          ? data.internships
          : Array.isArray(data)
          ? data
          : [];

      const approved = list.filter(
        (item) =>
          String(
            item?.approvalStatus ||
              ""
          ).toLowerCase() ===
          "approved"
      );

      setInternships(
        approved.slice(0, 6)
      );
    } catch (err) {
      console.error(
        "FEATURED INTERNSHIPS ERROR:",
        err
      );

      setError(
        "Unable to load internships right now."
      );

      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Real opportunities
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Featured{" "}
            <span className="text-[#D4AF37]">
              Internships
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Explore approved internship opportunities available on
            SkilVira and find your next practical learning experience.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInternships}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 shadow-sm transition hover:border-[#D4AF37]/40 hover:text-slate-950"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="mt-10">

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <StateCard
            title="Internships unavailable"
            description={error}
            icon={<FiBriefcase />}
            action={
              <button
                type="button"
                onClick={loadInternships}
                className="rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-black"
              >
                Try Again
              </button>
            }
          />
        ) : internships.length ===
          0 ? (
          <StateCard
            title="Opportunities are coming soon"
            description="No approved internships are available yet. New opportunities will appear here as soon as they are published."
            icon={<FiBriefcase />}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {internships.map(
              (item) => (
                <InternshipCard
                  key={item?._id}
                  internship={item}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {internships.length > 0 && (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-[#D4AF37]/40 hover:shadow-md"
          >
            View more internships

            <FiArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      )}
    </section>
  );
};

const InternshipCard = ({
  internship,
}) => {
  const title =
    internship?.title ||
    "Internship Opportunity";

  const company =
    internship?.company ||
    internship?.companyName ||
    "Company";

  const location =
    internship?.location ||
    internship?.workMode ||
    "Remote / Flexible";

  const duration =
    internship?.duration ||
    internship?.internshipDuration ||
    "Flexible duration";

  const image =
    internship?.internshipImage ||
    internship?.image ||
    internship?.banner;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_38px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/30 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]">

      {/* Image / visual */}
      <div className="relative h-48 overflow-hidden bg-[#F8F6EC]">
        {image ? (
          <img
            src={getAssetUrl(image)}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-3xl text-black shadow-lg"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiBriefcase size={30} />
            </div>
          </div>
        )}

        {/* Approved badge */}
        <div className="absolute left-4 top-4 rounded-full border border-emerald-200 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700 shadow-sm backdrop-blur">
          Approved
        </div>

        {/* Gold corner */}
        <div className="absolute bottom-0 right-0 h-16 w-16 rounded-tl-[30px] bg-[#D4AF37]/90" />
      </div>

      {/* Card body */}
      <div className="p-5 sm:p-6">

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#A28622]">
              Internship
            </p>

            <h3 className="mt-2 line-clamp-2 text-lg font-black leading-6 text-slate-950">
              {title}
            </h3>

            <p className="mt-1.5 text-sm font-semibold text-slate-500">
              {company}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
            <FiBriefcase size={18} />
          </div>
        </div>

        {/* Meta */}
        <div className="mt-5 space-y-2.5">

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <FiMapPin
              className="text-[#B28F16]"
              size={14}
            />

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <FiClock
              className="text-[#B28F16]"
              size={14}
            />

            <span className="line-clamp-1">
              {duration}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Open opportunity
          </span>

          <button
            type="button"
            className="group/btn flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
          >
            <FiArrowRight
              size={16}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
            />
          </button>

        </div>
      </div>
    </article>
  );
};

const LoadingGrid = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map(
      (item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-[28px] border border-slate-100 bg-white"
        >
          <div className="h-48 bg-slate-100" />

          <div className="space-y-3 p-6">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-5 w-4/5 rounded bg-slate-100" />
            <div className="h-4 w-2/5 rounded bg-slate-100" />
            <div className="mt-5 h-3 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="mt-5 h-px w-full bg-slate-100" />
          </div>
        </div>
      )
    )}
  </div>
);

const StateCard = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor:
          GOLD,
      }}
    >
      {icon}
    </div>

    <h3 className="mt-5 text-xl font-black text-slate-950">
      {title}
    </h3>

    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
      {description}
    </p>

    {action && (
      <div className="mt-5 flex justify-center">
        {action}
      </div>
    )}
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

export default FeaturedInternships;