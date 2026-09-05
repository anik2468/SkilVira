const ProfileStepper = ({ currentStep, setCurrentStep }) => {
  const steps = [
    "Personal",
    "Education",
    "Skills",
    "Social",
    "Projects",
    "Certificates",
  ];

  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
      {steps.map((step, index) => (
        <button
          key={step}
          onClick={() => setCurrentStep(index + 1)}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition
          ${
            currentStep === index + 1
              ? "bg-[#D4AF37] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {index + 1}. {step}
        </button>
      ))}
    </div>
  );
};

export default ProfileStepper;