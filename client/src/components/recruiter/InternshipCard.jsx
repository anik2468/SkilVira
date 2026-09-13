import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";

const InternshipCard = ({
  internship,
  onView,
  onEdit,
  onDelete,
}) => {
  if (!internship) return null;

  const {
    title = "Untitled Internship",
    company = "",
    category = "",
    workMode = "",
    internshipType = "",
    location = "",
    duration = "",
    lastDate = "",
    price = 0,
    internshipImage = "",
    skills = [],
    status = "Open",
  } = internship;

  const formattedDate = lastDate
    ? new Date(lastDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const skillList = Array.isArray(skills)
    ? skills
    : [];

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {internshipImage ? (
          <img
            src={internshipImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FiBriefcase
              size={42}
              className="text-slate-300"
            />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#9A7B14] shadow-sm backdrop-blur">
            {status}
          </span>

          {category && (
            <span className="rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="line-clamp-2 text-lg font-black tracking-tight text-slate-900">
            {title}
          </h3>

          {company && (
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {company}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 gap-2 text-sm text-slate-500 sm:grid-cols-2">
          {location && (
            <div className="flex min-w-0 items-center gap-2">
              <FiMapPin className="shrink-0 text-[#B58A18]" />
              <span className="truncate">
                {location}
              </span>
            </div>
          )}

          {duration && (
            <div className="flex items-center gap-2">
              <FiClock className="shrink-0 text-[#B58A18]" />
              <span>{duration}</span>
            </div>
          )}

          {workMode && (
            <div className="flex items-center gap-2">
              <FiBriefcase className="shrink-0 text-[#B58A18]" />
              <span>{workMode}</span>
            </div>
          )}

          {lastDate && formattedDate && (
            <div className="flex items-center gap-2">
              <FiCalendar className="shrink-0 text-[#B58A18]" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skillList.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {skillList.slice(0, 4).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600"
              >
                {skill}
              </span>
            ))}

            {skillList.length > 4 && (
              <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-xs font-bold text-[#9A7B14]">
                +{skillList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fee
            </p>

            <p className="mt-0.5 text-lg font-black text-slate-900">
              {Number(price) > 0
                ? `₹${price}`
                : "Free"}
            </p>

            {internshipType && (
              <p className="text-xs font-semibold text-slate-400">
                {internshipType}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(internship)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                aria-label="Delete internship"
              >
                <FiTrash2 size={16} />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(internship)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] hover:text-[#9A7B14]"
                aria-label="Edit internship"
              >
                <FiEdit2 size={16} />
              </button>
            )}

            {onView && (
              <button
                type="button"
                onClick={() => onView(internship)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
              >
                View
                <FiArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default InternshipCard;