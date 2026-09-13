import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiFileText,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";

const actions = [
  {
    title: "Post Internship",
    description: "Create a new internship opportunity",
    link: "/recruiter/post",
    icon: <FiBriefcase />,
  },
  {
    title: "View Applications",
    description: "Review and manage student applications",
    link: "/recruiter/applications",
    icon: <FiFileText />,
  },
  {
    title: "Company Profile",
    description: "Update your company information",
    link: "/recruiter/profile",
    icon: <FiUser />,
  },
];

const QuickActions = () => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B58A18]">
          Shortcuts
        </p>

        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access the tools you use most.
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:bg-[#FFF8E7]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#9A7B14] transition group-hover:bg-[#D4AF37] group-hover:text-black">
              {action.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-900">
                {action.title}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {action.description}
              </p>
            </div>

            <FiArrowRight
              size={17}
              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#9A7B14]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;