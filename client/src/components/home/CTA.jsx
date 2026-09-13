import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiCompass,
} from "react-icons/fi";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-black py-20 text-white sm:py-24 lg:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute right-[8%] top-[18%] h-32 w-32 rounded-full border border-[#D4AF37]/15" />
      <div className="pointer-events-none absolute right-[11%] top-[24%] h-20 w-20 rounded-full border border-[#D4AF37]/10" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Main content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D4AF37]/40">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E5C85A] sm:text-xs">
                Your next chapter starts here
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Ready to{" "}
              <span className="text-[#D4AF37]">Launch</span>{" "}
              Your Career?
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
              Learn practical skills, discover opportunities, gain
              experience and build a stronger professional journey with
              SkilVira.
            </p>

            {/* Benefits */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "Learn industry skills",
                "Discover internships",
                "Build career proof",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-bold text-white/65"
                >
                  <FiCheckCircle
                    className="text-[#D4AF37]"
                    size={14}
                  />
                  {item}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register/student"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-black text-black shadow-[0_15px_35px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E2C65A] hover:shadow-[0_20px_45px_rgba(212,175,55,0.28)]"
              >
                Get Started

                <FiArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/choose-role"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
              >
                Explore Portal

                <FiCompass
                  size={16}
                  className="text-[#D4AF37] transition-transform duration-300 group-hover:rotate-12"
                />
              </Link>
            </div>
          </div>

          {/* Side visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-7">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/15 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                    <FiBriefcase size={20} />
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-300">
                    Career Ready
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  One platform.
                </h3>

                <p className="mt-1 text-2xl font-black text-[#D4AF37]">
                  Multiple possibilities.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    {
                      icon: <FiCompass />,
                      title: "Discover",
                      text: "Find the right path",
                    },
                    {
                      icon: <FiBriefcase />,
                      title: "Experience",
                      text: "Gain practical exposure",
                    },
                    {
                      icon: <FiCheckCircle />,
                      title: "Grow",
                      text: "Build your career proof",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-black text-white">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[10px] font-semibold text-white/35">
                          {item.text}
                        </p>
                      </div>

                      <FiChevronRight
                        size={14}
                        className="text-white/20"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                    SKILVIRA
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white/40">
                    Learn • Build • Grow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;