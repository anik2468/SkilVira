import {
  FiEdit3,
} from "react-icons/fi";

const ProfileSection = ({
  title,
  children,
  action,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          {title}
        </h2>

        {action && (
          <div className="shrink-0">
            {typeof action === "function" ? (
              <button
                type="button"
                onClick={action}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <FiEdit3 size={15} />
                Edit
              </button>
            ) : (
              action
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-6 sm:px-6">
        {children}
      </div>
    </section>
  );
};

export default ProfileSection;