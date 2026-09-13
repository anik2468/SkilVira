import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiGlobe,
  FiPlus,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const PartnerUniversities = () => {
  return (
    <section className="relative overflow-hidden bg-[#FBFBF8] py-20 sm:py-24">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-72 w-72 rounded-full bg-[#D4AF37]/7 blur-[110px]" />

      <div className="pointer-events-none absolute right-[-120px] bottom-0 h-80 w-80 rounded-full bg-[#D4AF37]/6 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <FiGlobe
              size={13}
              className="text-[#B28F16]"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Institution Network
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Growing{" "}
            <span className="text-[#D4AF37]">
              Together
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            SkilVira is building a connected ecosystem for students,
            institutions and career opportunities. Our partner network
            will appear here as institutions officially come on board.
          </p>
        </div>

        {/* =====================================================
            COMING SOON PANEL
        ===================================================== */}

        <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_22px_65px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-[100px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Left */}
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-black shadow-lg"
                  style={{
                    backgroundColor:
                      "#D4AF37",
                  }}
                >
                  <FiGlobe size={25} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A7B14]">
                    Network status
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    Partners coming soon
                  </h3>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                We are currently building relationships with colleges and
                universities to create better access to learning,
                internships and career opportunities for students.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MiniFeature
                  icon={<FiUsers />}
                  title="Students"
                  text="Student-focused ecosystem"
                />

                <MiniFeature
                  icon={<FiBriefcase />}
                  title="Opportunities"
                  text="Career & internship access"
                />

                <MiniFeature
                  icon={<FiShield />}
                  title="Trusted"
                  text="Verified institutional network"
                />
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] bg-black p-6 text-white sm:p-8">

                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37]/15 blur-3xl" />

                {/* Empty network visual */}
                <div className="relative flex min-h-[250px] flex-col items-center justify-center text-center">

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#D4AF37] text-black shadow-[0_20px_50px_rgba(212,175,55,0.20)]">
                    <FiPlus size={38} />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-black bg-emerald-500 text-white">
                      <FiCheckCircle size={12} />
                    </span>
                  </div>

                  <p className="mt-6 text-lg font-black">
                    Your institution could be next.
                  </p>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/45">
                    Official partner institutions will be showcased here
                    with verified information.
                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D4AF37]" />

                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/60">
                      Network expanding
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom strip */}
          <div className="relative mt-7 flex flex-col gap-4 rounded-2xl border border-[#D4AF37]/15 bg-[#FCFBF5] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <FiShield
                  className="text-[#B28F16]"
                  size={16}
                />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  No placeholder institutions
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  Only officially connected institutions will be displayed.
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
              Build the network

              <FiArrowRight size={14} />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

const MiniFeature = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#FCFCFA] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-black text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">
        {text}
      </p>
    </div>
  );
};

export default PartnerUniversities;