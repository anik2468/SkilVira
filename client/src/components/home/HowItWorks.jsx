import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiFileText,
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus />,
    number: "01",
    title: "Create Account",
    desc: "Create your SkilVira account and set up your professional profile.",
  },
  {
    icon: <FiSearch />,
    number: "02",
    title: "Discover Opportunities",
    desc: "Explore internships and learning opportunities that match your goals.",
  },
  {
    icon: <FiFileText />,
    number: "03",
    title: "Apply & Learn",
    desc: "Apply through your profile, learn practical skills and track your journey.",
  },
  {
    icon: <FiAward />,
    number: "04",
    title: "Build Your Proof",
    desc: "Complete your journey and build verified credentials for your career.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E4C75F] sm:text-xs">
              Your journey starts here
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            How{" "}
            <span className="text-[#D4AF37]">
              SkilVira
            </span>{" "}
            Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            A focused journey from creating your profile to discovering
            opportunities, gaining experience and building career proof.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">

          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[74px] hidden h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent lg:block" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(
              (step, index) => (
                <div
                  key={step.number}
                  className="group relative"
                >
                  {/* Step card */}
                  <div className="relative h-full rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/30 hover:bg-white/[0.07] hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] sm:p-7">

                    {/* Number */}
                    <div className="absolute right-5 top-5 text-[10px] font-black tracking-[0.2em] text-white/20">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.18)] transition-transform duration-300 group-hover:scale-105">
                      <span className="text-[26px]">
                        {step.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-black text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {step.desc}
                    </p>

                    {/* Bottom line */}
                    <div className="mt-7 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                      <div className="h-px flex-1 bg-white/10" />

                      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#D4AF37]/70">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom Journey Bar */}
        <div className="mt-8 overflow-hidden rounded-[26px] border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                <FiCheckCircle size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  One journey. Clear direction.
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Learn → Discover → Experience → Grow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#D4AF37]">
              Start your journey

              <FiArrowRight size={15} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;