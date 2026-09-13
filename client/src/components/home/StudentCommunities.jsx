import {
  FiArrowRight,
  FiCheckCircle,
  FiMessageCircle,
  FiPlus,
  FiUsers,
} from "react-icons/fi";

const StudentCommunities = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-[-140px] top-1/4 h-72 w-72 rounded-full bg-[#D4AF37]/7 blur-[110px]" />

      <div className="pointer-events-none absolute right-[-140px] bottom-0 h-80 w-80 rounded-full bg-[#D4AF37]/6 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <FiMessageCircle
              size={13}
              className="text-[#B28F16]"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Student Network
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Student{" "}
            <span className="text-[#D4AF37]">
              Communities
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Connect with students from your college, share knowledge and
            build a stronger learning and career network together.
          </p>
        </div>

        {/* =====================================================
            COMING SOON CARD
        ===================================================== */}

        <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_22px_65px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">

          {/* Glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-[100px]" />

          <div className="relative grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

            {/* Left content */}
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-black shadow-lg"
                  style={{
                    backgroundColor:
                      "#D4AF37",
                  }}
                >
                  <FiUsers size={25} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A7B14]">
                    Community status
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    Coming Soon
                  </h3>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                College communities will appear here once they are
                officially created and connected with SkilVira.
              </p>

              <div className="mt-7 space-y-3">
                <FeatureRow
                  icon={<FiUsers />}
                  text="Connect with classmates, seniors and juniors"
                />

                <FeatureRow
                  icon={<FiMessageCircle />}
                  text="Share knowledge, opportunities and updates"
                />

                <FeatureRow
                  icon={<FiCheckCircle />}
                  text="Discover officially connected communities"
                />
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[30px] bg-black p-7 text-center shadow-2xl sm:p-9">

                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37]/15 blur-3xl" />

                <div className="relative flex min-h-[270px] flex-col items-center justify-center">

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#D4AF37] text-black shadow-[0_20px_50px_rgba(212,175,55,0.22)]">
                    <FiUsers size={38} />

                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-black bg-white text-[#D4AF37]">
                      <FiPlus size={14} />
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black text-white">
                    Your college community
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/45">
                    Official communities will be listed here as they are
                    created and activated.
                  </p>

                  <div className="mt-6 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
                      Community network expanding
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
                <FiCheckCircle
                  className="text-[#B28F16]"
                  size={16}
                />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  Real communities only
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  No placeholder colleges, member counts or group links.
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
              Building connections

              <FiArrowRight size={14} />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

const FeatureRow = ({
  icon,
  text,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#FCFCFA] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
        {icon}
      </div>

      <p className="text-xs font-semibold leading-5 text-slate-600 sm:text-sm">
        {text}
      </p>
    </div>
  );
};

export default StudentCommunities;