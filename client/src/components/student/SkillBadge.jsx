import {
  FiCode,
} from "react-icons/fi";

const SkillBadge = ({
  skill,
  onRemove,
  removable = false,
}) => {
  const displaySkill =
    typeof skill === "string"
      ? skill
      : skill?.name || skill?.title || "";

  if (!displaySkill.trim()) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/15"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-white">
        <FiCode size={11} />
      </span>

      <span className="max-w-[180px] truncate">
        {displaySkill}
      </span>

      {removable && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          aria-label={`Remove ${displaySkill}`}
          className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;