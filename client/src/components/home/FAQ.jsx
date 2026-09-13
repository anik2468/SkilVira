import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiMessageCircle,
} from "react-icons/fi";

const faqs = [
  {
    question: "Is SkilVira free for students?",
    answer:
      "Yes. Students can create an account, build their profile, and explore available internship opportunities. Any paid offering will be clearly mentioned before payment.",
  },
  {
    question: "How do I apply for an internship?",
    answer:
      "Create your student profile, complete the relevant details, upload your resume when required, browse available internships, and apply to the opportunities that match your interests.",
  },
  {
    question: "How can I verify my certificate?",
    answer:
      "Use the certificate verification page and enter the credential or certificate ID provided with your certificate to check its verification details.",
  },
  {
    question: "Can companies post internships?",
    answer:
      "Yes. Registered recruiters can create their company profile and use the recruiter dashboard to manage internship opportunities, subject to the platform's approval process.",
  },
  {
    question: "How do partner universities benefit?",
    answer:
      "The platform can help universities connect students with learning, internship and community opportunities while supporting a more structured student career journey.",
  },
];

const FAQ = () => {
  const [open, setOpen] =
    useState(0);

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/6 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <FiHelpCircle
              size={13}
              className="text-[#B28F16]"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Need to know?
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="text-[#D4AF37]">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Find quick answers about accounts, internships, certificates
            and the SkilVira platform.
          </p>
        </div>

        {/* =====================================================
            FAQ LIST
        ===================================================== */}

        <div className="mt-12 space-y-3">
          {faqs.map(
            (faq, index) => {
              const isOpen =
                open === index;

              return (
                <div
                  key={faq.question}
                  className={`group overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-[#D4AF37]/30 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                      : "border-slate-200/80 shadow-[0_8px_25px_rgba(15,23,42,0.03)] hover:border-[#D4AF37]/20 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpen(
                        isOpen
                          ? -1
                          : index
                      )
                    }
                    aria-expanded={
                      isOpen
                    }
                    className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  >
                    {/* Number */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-300 ${
                        isOpen
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#FAF6E8] text-[#9A7B14]"
                      }`}
                    >
                      0{index + 1}
                    </div>

                    {/* Question */}
                    <span
                      className={`flex-1 pr-2 text-sm font-black leading-6 sm:text-base ${
                        isOpen
                          ? "text-slate-950"
                          : "text-slate-800"
                      }`}
                    >
                      {faq.question}
                    </span>

                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                        isOpen
                          ? "bg-black text-[#D4AF37]"
                          : "bg-slate-50 text-slate-500 group-hover:bg-[#D4AF37]/10 group-hover:text-[#9A7B14]"
                      }`}
                    >
                      {isOpen ? (
                        <FiChevronUp
                          size={18}
                        />
                      ) : (
                        <FiChevronDown
                          size={18}
                        />
                      )}
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pl-[76px]">
                        <p className="text-sm leading-7 text-slate-500 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* =====================================================
            BOTTOM HELP CARD
        ===================================================== */}

        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-[#FCFBF5] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-[#D4AF37]">
                <FiMessageCircle
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Still have a question?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Explore the platform or reach out through the available
                  support channels.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#9A7B14]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              SkilVira Support
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;