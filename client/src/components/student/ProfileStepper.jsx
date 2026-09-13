import {
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";

const ProfileStepper = ({
  currentStep,
  setCurrentStep,
}) => {
  const steps = [
    "Personal",
    "Education",
    "Skills",
    "Social",
    "Projects",
    "Certificates",
  ];

  const safeCurrentStep = Math.min(
    steps.length,
    Math.max(1, Number(currentStep) || 1)
  );

  return (
    <div className="mb-8 w-full">
      {/* Desktop Stepper */}
      <div className="hidden items-center justify-between gap-2 md:flex">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive =
            safeCurrentStep === stepNumber;
          const isCompleted =
            safeCurrentStep > stepNumber;

          return (
            <div
              key={step}
              className="flex min-w-0 flex-1 items-center"
            >
              <button
                type="button"
                onClick={() =>
                  setCurrentStep(stepNumber)
                }
                className={`group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : isCompleted
                      ? "border-[#D4AF37]/30 bg-white hover:border-[#D4AF37]/60"
                      : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                    isActive || isCompleted
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <FiCheck size={17} />
                  ) : (
                    stepNumber
                  )}
                </span>

                <span className="min-w-0">
                  <span
                    className={`block truncate text-xs font-medium ${
                      isActive
                        ? "text-[#D4AF37]"
                        : "text-gray-400"
                    }`}
                  >
                    Step {stepNumber}
                  </span>

                  <span
                    className={`block truncate text-sm font-semibold ${
                      isActive
                        ? "text-gray-900"
                        : isCompleted
                          ? "text-gray-700"
                          : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </span>
              </button>

              {index < steps.length - 1 && (
                <FiChevronRight
                  className={`mx-1 shrink-0 ${
                    safeCurrentStep > stepNumber
                      ? "text-[#D4AF37]"
                      : "text-gray-300"
                  }`}
                  size={18}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400">
              Profile Setup
            </p>

            <p className="mt-1 text-base font-bold text-gray-900">
              Step {safeCurrentStep} of {steps.length}
            </p>
          </div>

          <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
            {steps[safeCurrentStep - 1]}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#D4AF37] transition-all duration-300"
            style={{
              width: `${
                (safeCurrentStep /
                  steps.length) *
                100
              }%`,
            }}
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive =
              safeCurrentStep === stepNumber;
            const isCompleted =
              safeCurrentStep > stepNumber;

            return (
              <button
                key={step}
                type="button"
                onClick={() =>
                  setCurrentStep(stepNumber)
                }
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#D4AF37] text-white"
                    : isCompleted
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <span>
                  {isCompleted ? (
                    <FiCheck size={13} />
                  ) : (
                    stepNumber
                  )}
                </span>

                <span>{step}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileStepper;