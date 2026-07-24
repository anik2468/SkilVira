const AuthBranding = () => {
  return (
    <div className="hidden lg:flex w-1/2 flex-col justify-center bg-[#111827] px-16 text-white">

      <h1 className="text-6xl font-extrabold">
        Skil<span className="text-[#D4AF37]">vira</span>
      </h1>

      <p className="mt-6 text-xl leading-9 text-gray-300">
        Connecting Students, Recruiters and Colleges through
        one powerful internship platform.
      </p>

      <div className="mt-16 space-y-6">

        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
          <p>Verified Internship Opportunities</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
          <p>Smart Application Tracking</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
          <p>Career Growth & Certifications</p>
        </div>

      </div>

    </div>
  );
};

export default AuthBranding;