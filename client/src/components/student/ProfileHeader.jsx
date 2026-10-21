import { API_ORIGIN } from "../../services/urlConfig.js";
import {
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const API_BASE = API_ORIGIN;

const ProfileHeader = ({ profile }) => {
  const profilePicture = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${API_BASE}${profile.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.user?.name || "Student"
      )}&background=D4AF37&color=fff&size=200`;

  const profileStrength = Math.min(
    100,
    Math.max(0, Number(profile?.profileCompleted) || 0)
  );

  const hasResume = Boolean(
    profile?.resume ||
      profile?.resumeUrl ||
      profile?.resumePath
  );

  const resumeUrl = profile?.resume
    ? profile.resume.startsWith("http")
      ? profile.resume
      : `${API_BASE}${profile.resume}`
    : profile?.resumeUrl
      ? profile.resumeUrl.startsWith("http")
        ? profile.resumeUrl
        : `${API_BASE}${profile.resumeUrl}`
      : profile?.resumePath
        ? profile.resumePath.startsWith("http")
          ? profile.resumePath
          : `${API_BASE}${profile.resumePath}`
        : null;

  const handleResumeDownload = () => {
    if (!resumeUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = resumeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-amber-600 sm:h-48" />

      {/* Main Profile */}
      <div className="relative px-5 pb-7 sm:px-8">
        <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 lg:flex-row lg:items-end lg:justify-between">
          {/* Profile information */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="shrink-0">
              <img
                src={profilePicture}
                alt={
                  profile?.user?.name
                    ? `${profile.user.name} profile`
                    : "Student Profile"
                }
                className="h-32 w-32 rounded-full border-8 border-white bg-gray-100 object-cover shadow-lg sm:h-40 sm:w-40"
                onError={(event) => {
                  event.currentTarget.src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile?.user?.name || "Student"
                    )}&background=D4AF37&color=fff&size=200`;
                }}
              />
            </div>

            {/* Details */}
            <div className="pb-1 sm:pb-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
                {profile?.user?.name || "Student"}
              </h1>

              <p className="mt-1 text-base font-semibold text-[#D4AF37] sm:mt-2 sm:text-lg">
                {profile?.degree || "Degree"}
                {" • "}
                {profile?.branch || "Branch"}
              </p>

              <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                {profile?.user?.email && (
                  <span className="flex items-center gap-2">
                    <FiMail
                      size={15}
                      className="shrink-0 text-[#D4AF37]"
                    />
                    <span className="break-all">
                      {profile.user.email}
                    </span>
                  </span>
                )}

                <span className="flex items-center gap-2">
                  <FiPhone
                    size={15}
                    className="shrink-0 text-[#D4AF37]"
                  />
                  <span>
                    {profile?.phone || "Not Added"}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <FiMapPin
                    size={15}
                    className="shrink-0 text-[#D4AF37]"
                  />
                  <span>
                    {profile?.city || "City"}
                    {profile?.state ? ", " : ""}
                    {profile?.state || "State"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/profile/edit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c29f2f] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
            >
              <FiEdit3 size={17} />
              Edit Profile
            </Link>

            {hasResume ? (
              <button
                type="button"
                onClick={handleResumeDownload}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <FiDownload size={17} />
                Resume
              </button>
            ) : (
              <Link
                to="/student/profile/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <FiDownload size={17} />
                Add Resume
              </Link>
            )}
          </div>
        </div>

        {/* Profile Strength */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Profile Strength
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Complete your profile to improve your profile quality.
              </p>
            </div>

            <span className="shrink-0 text-lg font-bold text-[#D4AF37]">
              {profileStrength}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
              style={{
                width: `${profileStrength}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;