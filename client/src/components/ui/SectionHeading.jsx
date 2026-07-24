const SectionHeading = ({
  title,
  subtitle,
  center = true,
}) => {
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className="text-4xl font-bold text-[#111827]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;