const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "TCS",
  "Infosys",
  "Wipro",
];

const TrustedCompanies = () => {
  return (
    <section className="bg-[#FAFAFA] py-14">
      <div className="mx-auto max-w-7xl px-6">

        <p className="mb-10 text-center text-lg font-medium text-gray-500">
          Trusted by <span className="font-bold text-[#D4AF37]">1200+</span> Companies
        </p>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-20 items-center justify-center rounded-2xl border border-gray-100 bg-white text-lg font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {company}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedCompanies;