import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const AuthBranding = () => {
  return (
    <div className="relative hidden h-full min-h-screen overflow-hidden bg-black text-white lg:flex lg:w-full lg:flex-col">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/16 blur-[120px]" />

        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10" />

        <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-10 py-10 xl:px-16 xl:py-12">

        {/* Top branding */}
        <div>
          <div className="inline-flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black text-black shadow-[0_12px_30px_rgba(212,175,55,0.22)]"
              style={{
                backgroundColor: GOLD,
              }}
            >
              S
            </div>

            <div>
              <p className="text-xl font-black tracking-tight">
                Skil<span className="text-[#D4AF37]">Vira</span>
              </p>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Learn • Build • Grow
              </p>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="my-auto max-w-xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E5C85A]">
              Career ecosystem
            </span>
          </div>

          <h1 className="text-5xl font-black leading-[1.03] tracking-[-0.04em] xl:text-6xl">
            Turn your{" "}
            <span className="text-[#D4AF37]">
              skills
            </span>{" "}
            into real opportunities.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/55 xl:text-lg">
            SkilVira brings learning, internships, practical experience
            and career growth together in one focused platform.
          </p>

          {/* Feature cards */}
          <div className="mt-10 space-y-3">
            <Feature
              icon={<FiBriefcase />}
              title="Real Opportunities"
              text="Discover internships and career-focused experiences."
            />

            <Feature
              icon={<FiAward />}
              title="Build Career Proof"
              text="Turn completed learning and experience into credible credentials."
            />

            <Feature
              icon={<FiUsers />}
              title="Grow Your Network"
              text="Connect with students, recruiters and the wider ecosystem."
            />
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <TrustItem text="Student-first" />
            <TrustItem text="Career-focused" />
            <TrustItem text="Built for growth" />
          </div>
        </div>

        {/* Bottom panel */}
        <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShield size={18} />
              </div>

              <div>
                <p className="text-xs font-black text-white">
                  Your journey, your progress.
                </p>

                <p className="mt-1 text-[10px] font-semibold text-white/35">
                  Learn → Experience → Grow
                </p>
              </div>
            </div>

            <FiArrowRight
              className="text-[#D4AF37]"
              size={17}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
          <p className="text-[10px] font-semibold text-white/25">
            © {new Date().getFullYear()} SkilVira
          </p>

          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
            <FiCheckCircle
              className="text-[#D4AF37]"
              size={11}
            />
            Secure Platform
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#D4AF37]/20 hover:bg-white/[0.06]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-black text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/40">
          {text}
        </p>
      </div>
    </div>
  );
};

const TrustItem = ({
  text,
}) => {
  return (
    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
      <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
      {text}
    </span>
  );
};

export default AuthBranding;