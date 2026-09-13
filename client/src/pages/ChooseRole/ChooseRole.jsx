import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiBookOpen,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Student",
    description:
      "Learn practical skills, discover internships and build your career journey.",
    path: "student",
    icon: <FiUser />,
    label: "LEARN & GROW",
  },
  {
    title: "Recruiter",
    description:
      "Connect with skilled students and manage internship opportunities.",
    path: "recruiter",
    icon: <FiBriefcase />,
    label: "HIRE & BUILD",
  },
  {
    title: "College Ambassador",
    description:
      "Build your college community and connect students with opportunities.",
    path: "ambassador",
    icon: <FiBookOpen />,
    label: "CONNECT & LEAD",
  },
  {
    title: "Employee",
    description:
      "Manage platform operations, users and the SkilVira ecosystem.",
    path: "employee",
    icon: <FiUsers />,
    label: "MANAGE & OPERATE",
  },
];

const ChooseRole = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:px-8">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-160px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/8 blur-[120px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/8" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-white px-4 py-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Welcome to SkilVira
            </span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Choose your{" "}
            <span className="text-[#D4AF37]">
              journey.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base lg:text-lg">
            Select the role that best describes you and continue to your
            dedicated SkilVira experience.
          </p>
        </div>

        {/* =====================================================
            ROLE CARDS
        ===================================================== */}

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {roles.map(
            (role, index) => (
              <Link
                key={role.path}
                to={`/login/${role.path}`}
                className="group relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/35 hover:shadow-[0_28px_65px_rgba(15,23,42,0.10)] sm:p-7"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Number */}
                <div className="absolute right-6 top-5 text-[10px] font-black tracking-[0.2em] text-slate-200">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF6E8] text-[#B28F16] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.22)]">
                  <span className="text-[27px]">
                    {role.icon}
                  </span>
                </div>

                {/* Label */}
                <div className="mt-6">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {role.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                  {role.title}
                </h2>

                {/* Description */}
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                  {role.description}
                </p>

                {/* CTA */}
                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
                    Continue
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black">
                    <FiArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>

                {/* Bottom gold line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          )}
        </div>

        {/* =====================================================
            BOTTOM TRUST BAR
        ===================================================== */}

        <div className="mx-auto mt-8 w-full max-w-5xl rounded-3xl border border-[#D4AF37]/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <FiCheckCircle
                  className="text-[#B28F16]"
                  size={17}
                />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  One ecosystem, purpose-built experiences.
                </p>

                <p className="mt-1 text-[10px] font-semibold text-slate-400">
                  Choose your role and get started.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Learn • Build • Grow
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ChooseRole;