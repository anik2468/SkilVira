import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiArrowRight,
  FiMapPin,
} from "react-icons/fi";

const RecentInternships = ({
  internships = [],
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B58A18]">
            Opportunities
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Recent Internships
          </h2>
        </div>

        <Link
          to="/recruiter/internships"
          className="inline-flex items-center gap-1.5 text-sm font-black text-[#9A7B14] transition hover:text-[#7F650F]"
        >
          View all
          <FiArrowRight size={15} />
        </Link>
      </div>

      {internships.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
            <FiBriefcase size={22} />
          </div>

          <p className="mt-4 text-sm font-black text-slate-700">
            No internships posted yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your published internship opportunities will appear here.
          </p>

          <Link
            to="/recruiter/post"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-black text-black transition hover:bg-[#E1C14E]"
          >
            Post Internship
            <FiArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {internships.slice(0, 5).map((internship) => (
            <div
              key={internship._id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#9A7B14]">
                <FiBriefcase size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900">
                  {internship.title ||
                    "Untitled Internship"}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <FiMapPin size={13} />

                  <span className="truncate">
                    {internship.location ||
                      internship.workMode ||
                      "Location not specified"}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-xs font-bold capitalize text-[#9A7B14]">
                {internship.status || "Open"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentInternships;