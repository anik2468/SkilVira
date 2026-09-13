import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { useEffect, useState } from "react";

/*
 * Keep only genuine student testimonials here.
 * Replace these entries with real DB-backed testimonials before production.
 */
const testimonials = [
  {
    id: 1,
    name: "Rahul Kumar",
    college: "GEC Nawada",
    review:
      "SkilVira helped me get my first internship. The application process was simple and smooth.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    college: "SCE Saharsa",
    review:
      "I found an amazing remote internship through SkilVira. Highly recommended!",
  },
  {
    id: 3,
    name: "Ankit Singh",
    college: "GEC Sheohar",
    review:
      "The platform is clean, fast, and very student friendly. Loved the experience.",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[current];

  const goPrevious = () => {
    setCurrent(
      (prev) =>
        (prev - 1 + testimonials.length) %
        testimonials.length
    );
  };

  const goNext = () => {
    setCurrent(
      (prev) =>
        (prev + 1) % testimonials.length
    );
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/7 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <FiUsers
              size={13}
              className="text-[#B28F16]"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Student voices
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            What Students{" "}
            <span className="text-[#D4AF37]">
              Say
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Real experiences from students on their
            learning and opportunity journey with
            SkilVira.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* Decorative quote */}
          <div className="absolute -left-3 -top-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37] text-black shadow-[0_15px_35px_rgba(212,175,55,0.25)] sm:-left-6 sm:-top-7">
            <span className="text-3xl font-black leading-none">
              “
            </span>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
            {/* Top gold line */}
            <div className="absolute left-8 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />

            {/* Background circle */}
            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[#D4AF37]/6 blur-3xl" />

            <div className="relative grid gap-9 md:grid-cols-[170px_1fr] md:items-center">
              {/* Student profile */}
              <div className="text-center md:border-r md:border-slate-100 md:pr-8">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-black shadow-xl">
                  <span className="text-3xl font-black text-[#D4AF37]">
                    {testimonial.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                    <FiCheckCircle size={14} />
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-5 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FiStar
                        key={star}
                        size={15}
                        className="fill-[#D4AF37] text-[#D4AF37]"
                      />
                    )
                  )}
                </div>

                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Student Review
                </p>
              </div>

              {/* Review */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/7 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#9A7B14]">
                    Verified experience
                  </span>
                </div>

                <blockquote className="text-xl font-bold leading-8 tracking-tight text-slate-900 sm:text-2xl lg:text-[27px] lg:leading-10">
                  “{testimonial.review}”
                </blockquote>

                <div className="mt-7">
                  <h3 className="text-base font-black text-slate-950">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {testimonial.college}
                  </p>
                </div>

                {/* Progress */}
                <div className="mt-7 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                      style={{
                        width: `${
                          ((current + 1) /
                            testimonials.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <span className="text-[10px] font-black text-slate-400">
                    {String(current + 1).padStart(
                      2,
                      "0"
                    )}{" "}
                    /{" "}
                    {String(
                      testimonials.length
                    ).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="relative mt-9 flex items-center justify-between border-t border-slate-100 pt-6">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map(
                  (item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show testimonial ${
                        index + 1
                      }`}
                      onClick={() =>
                        setCurrent(index)
                      }
                      className={`h-2 rounded-full transition-all duration-300 ${
                        current === index
                          ? "w-7 bg-[#D4AF37]"
                          : "w-2 bg-slate-200 hover:bg-slate-300"
                      }`}
                    />
                  )
                )}
              </div>

              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black"
                >
                  <FiArrowLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition hover:bg-[#D4AF37] hover:text-black"
                >
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-center shadow-sm">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <FiCheckCircle
                className="text-emerald-500"
                size={13}
              />
              Student-first platform
            </span>

            <span className="text-slate-200">•</span>

            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9A7B14]">
              Learn • Experience • Grow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;