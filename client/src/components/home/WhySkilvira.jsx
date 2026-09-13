import {
  FiArrowUpRight,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const features = [
  {
    icon: <FiShield />,
    number: "01",
    title: "Verified Companies",
    desc: "Discover opportunities from trusted recruiters and organizations.",
  },
  {
    icon: <FiBriefcase />,
    number: "02",
    title: "Real Internships",
    desc: "Find practical opportunities across remote, hybrid and on-site roles.",
  },
  {
    icon: <FiAward />,
    number: "03",
    title: "Verified Certificates",
    desc: "Build credible proof of your learning journey after successful completion.",
  },
  {
    icon: <FiUsers />,
    number: "04",
    title: "Career Community",
    desc: "Connect with students, mentors, recruiters and a growing career network.",
  },
];

const WhySkilvira = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-[-180px] top-1/4 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/7 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-180px] bottom-0 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/6 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Why SkilVira
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="text-[#D4AF37]">
              move forward.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            From learning new skills to finding opportunities and building
            proof of your work, SkilVira brings the essential pieces of a
            career journey together.
          </p>
        </div>

        {/* Main feature layout */}
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_1.95fr]">

          {/* Left story panel */}
          <div className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white shadow-[0_25px_70px_rgba(0,0,0,0.13)] sm:p-9">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-[70px]" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
                  <FiCheckCircle size={22} />
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                  One ecosystem
                </p>

                <h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  Learn with purpose.
                  <br />
                  Grow with proof.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                  Your learning journey should lead somewhere. SkilVira
                  connects skills, practical experience and career
                  opportunities in one focused ecosystem.
                </p>
              </div>

              <div className="mt-10 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    SKILVIRA
                  </span>

                  <span className="text-[10px] font-bold text-white/40">
                    Learn → Build → Grow
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_38px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/35 hover:shadow-[0_24px_55px_rgba(15,23,42,0.09)] sm:p-7"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#D4AF37]/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Number */}
                <div className="absolute right-6 top-5 text-[10px] font-black tracking-[0.18em] text-slate-200">
                  {item.number}
                </div>

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF6E8] text-[#B28F16] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_10px_25px_rgba(212,175,55,0.22)]">
                  <span className="text-[24px]">
                    {item.icon}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
                    SkilVira advantage
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-black">
                    <FiArrowUpRight size={15} />
                  </div>
                </div>

                {/* Bottom gold line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-7 rounded-3xl border border-slate-200 bg-[#FCFCF9] px-5 py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <FiShield className="text-[#B28F16]" size={16} />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  Built around trust
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  Skills, experience and credentials in one journey.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
              <span>Learn</span>
              <span className="text-[#D4AF37]">•</span>
              <span>Experience</span>
              <span className="text-[#D4AF37]">•</span>
              <span>Grow</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhySkilvira;