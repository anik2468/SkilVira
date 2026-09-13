import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiInfo,
  FiMapPin,
  FiPlus,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const PostInternship = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: "Create",
      description: "Add opportunity details",
    },
    {
      number: 2,
      title: "Review",
      description: "Check your listing",
    },
    {
      number: 3,
      title: "Submit",
      description: "Send for approval",
    },
  ];

  const goToCreate = () => {
    navigate("/recruiter/internships/create");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
            >
              <FiArrowLeft />
              Back
            </button>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-black"
                    style={{ backgroundColor: GOLD }}
                  >
                    <FiBriefcase size={18} />
                  </span>

                  <span
                    className="text-xs font-black uppercase tracking-[0.2em]"
                    style={{ color: GOLD }}
                  >
                    Recruiter Workspace
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Post Internship
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                  Create a professional internship opportunity and send
                  it through SkilVira's approval workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                  Posting Flow
                </p>

                <p className="mt-1 text-sm font-bold text-gray-200">
                  Create → Review → Submit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stepper */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((item, index) => {
              const active = step === item.number;
              const completed =
                step > item.number;

              return (
                <div
                  key={item.number}
                  className={`relative rounded-2xl border p-4 transition ${
                    active
                      ? "border-[#D4AF37]/50 bg-[#D4AF37]/5"
                      : completed
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-gray-100 bg-[#FAFAF8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        active
                          ? "text-black"
                          : completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      style={
                        active
                          ? { backgroundColor: GOLD }
                          : undefined
                      }
                    >
                      {completed ? (
                        <FiCheckCircle size={20} />
                      ) : (
                        item.number
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black text-gray-900">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {index <
                    steps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                      <FiChevronRight className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Left */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-black"
                  style={{ backgroundColor: GOLD }}
                >
                  <FiFileText size={22} />
                </div>

                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    Step 01
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-gray-950">
                    Create your internship
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Add the title, company information, work mode,
                    compensation, skills and complete opportunity
                    description.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  icon={<FiBriefcase />}
                  title="Opportunity Details"
                  description="Role, category and internship type"
                />

                <FeatureCard
                  icon={<FiMapPin />}
                  title="Work Information"
                  description="Location, remote, hybrid or onsite"
                />

                <FeatureCard
                  icon={<FiUsers />}
                  title="Candidate Profile"
                  description="Skills, requirements and openings"
                />

                <FeatureCard
                  icon={<FiClock />}
                  title="Timeline"
                  description="Duration and application deadline"
                />
              </div>

              <button
                type="button"
                onClick={goToCreate}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-black shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: GOLD }}
              >
                <FiPlus size={17} />
                Start Creating Internship
              </button>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Step 02
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Before you submit
                </h2>
              </div>

              <div className="space-y-3">
                <ChecklistItem text="Use a clear and specific internship title." />
                <ChecklistItem text="Provide an accurate company name and website." />
                <ChecklistItem text="Mention relevant skills and candidate requirements." />
                <ChecklistItem text="Add realistic duration, stipend and openings." />
                <ChecklistItem text="Write complete responsibilities and benefits." />
                <ChecklistItem text="Choose the correct work mode and location." />
              </div>
            </section>

            <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-black"
                  style={{ backgroundColor: GOLD }}
                >
                  <FiShield size={21} />
                </div>

                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    Approval Workflow
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Your post goes through review
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    After submission, the internship follows SkilVira's
                    approval process. It should not be treated as publicly
                    active until the required approval is completed.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Posting Checklist
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  What candidates need
                </h2>
              </div>

              <div className="space-y-4">
                <ChecklistProgress
                  label="Basic information"
                  completed
                />

                <ChecklistProgress
                  label="Role & responsibilities"
                  completed
                />

                <ChecklistProgress
                  label="Requirements & skills"
                  completed
                />

                <ChecklistProgress
                  label="Compensation & timeline"
                  completed
                />

                <ChecklistProgress
                  label="Company branding"
                  completed
                />
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "rgba(212,175,55,0.12)",
                    color: GOLD,
                  }}
                >
                  <FiInfo size={20} />
                </div>

                <div>
                  <p className="text-sm font-black text-gray-900">
                    Quality matters
                  </p>

                  <p className="text-xs text-gray-500">
                    Better listings attract better candidates.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                <InfoRow text="Avoid vague role descriptions." />
                <InfoRow text="Keep eligibility requirements realistic." />
                <InfoRow text="Use accurate stipend and deadline information." />
                <InfoRow text="Make the learning opportunity clear." />
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-6 sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Existing Tools
              </p>

              <div className="mt-4 space-y-3">
                <QuickLink
                  to="/recruiter/internships"
                  title="My Internships"
                  description="Manage your existing posts"
                />

                <QuickLink
                  to="/recruiter/applications"
                  title="Applications"
                  description="Review student applications"
                />

                <QuickLink
                  to="/recruiter/company"
                  title="Company Profile"
                  description="Update company information"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#8D7414] shadow-sm">
      {icon}
    </div>

    <h3 className="mt-4 text-sm font-black text-gray-900">
      {title}
    </h3>

    <p className="mt-1 text-xs leading-5 text-gray-500">
      {description}
    </p>
  </div>
);

const ChecklistItem = ({
  text,
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <FiCheckCircle size={15} />
    </div>

    <p className="text-sm leading-6 font-medium text-gray-700">
      {text}
    </p>
  </div>
);

const ChecklistProgress = ({
  label,
  completed,
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {completed ? (
          <FiCheckCircle size={16} />
        ) : (
          <span className="text-xs font-black">
            •
          </span>
        )}
      </div>

      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>
    </div>

    <span
      className={`text-xs font-black ${
        completed
          ? "text-emerald-600"
          : "text-gray-400"
      }`}
    >
      {completed ? "Ready" : "Pending"}
    </span>
  </div>
);

const InfoRow = ({
  text,
}) => (
  <div className="flex items-start gap-2">
    <span
      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: GOLD }}
    />

    <p>{text}</p>
  </div>
);

const QuickLink = ({
  to,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#D4AF37]/50 hover:shadow-sm"
  >
    <div>
      <p className="text-sm font-black text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>

    <FiChevronRight className="text-gray-300 transition group-hover:text-gray-700" />
  </Link>
);

export default PostInternship;