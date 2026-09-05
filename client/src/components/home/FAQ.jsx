import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "Is SkilVira free for students?",
    answer:
      "Yes. Students can create an account, build their profile, and apply for internships completely free.",
  },
  {
    question: "How do I apply for an internship?",
    answer:
      "Create your student profile, upload your resume, browse internships, and click Apply.",
  },
  {
    question: "How can I verify my certificate?",
    answer:
      "Use the Certificate Verification section on the homepage and enter your Certificate ID.",
  },
  {
    question: "Can companies post internships?",
    answer:
      "Yes. Registered recruiters can create a company profile and post internships.",
  },
  {
    question: "How do partner universities benefit?",
    answer:
      "Universities can showcase their students, communities, internship opportunities, and placement statistics.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need to know about SkilVira.
          </p>
        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white shadow"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? -1 : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>

                {open === index ? (
                  <FiChevronUp size={22} />
                ) : (
                  <FiChevronDown size={22} />
                )}
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FAQ;