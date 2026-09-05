const SkillBadge = ({ skill }) => {
  return (
    <span
      className="
        rounded-full
        bg-yellow-100
        px-5
        py-2
        text-sm
        font-semibold
        text-yellow-700
      "
    >
      {skill}
    </span>
  );
};

export default SkillBadge;