import { Link } from "react-router-dom";
import {
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";

const RecentApplications = ({
  applications = [],
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B58A18]">
            Applications
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Recent Applications
          </h2>
        </div>

        <Link
          to="/recruiter/applications"
          className="inline-flex items-center gap-1.5 text-sm font-black text-[#9A7B14] transition hover:text-[#7F650F]"
        >
          View all
          <FiArrowRight size={15} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
            <FiFileText size={22} />
          </div>

          <p className="mt-4 text-sm font-black text-slate-700">
            No applications yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Applications from students will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 5).map((application) => (
            <div
              key={application._id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E7] font-black text-[#9A7B14]">
                {(application.student?.name || "S")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900">
                  {application.student?.name ||
                    application.studentName ||
                    "Student"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {application.internship?.title ||
                    application.internshipTitle ||
                    "Internship Application"}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
                {application.status || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplications;