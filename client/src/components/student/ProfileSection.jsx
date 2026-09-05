const ProfileSection = ({
  title,
  children,
  action,
}) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        {action && action}

      </div>

      <div>{children}</div>

    </div>
  );
};

export default ProfileSection;