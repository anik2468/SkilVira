import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiBriefcase,
  FiEdit2,
  FiRefreshCw,
  FiCheckCircle,
  FiShield,
  FiGlobe,
  FiUsers,
  FiAward,
  FiCalendar,
  FiCopy,
  FiExternalLink,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const getStoredUser = () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) return null;

      return JSON.parse(rawUser);
    } catch (err) {
      console.error("Profile user parse error:", err);
      return null;
    }
  };

  const getUserId = (storedUser) =>
    storedUser?.id ||
    storedUser?._id ||
    storedUser?.userId ||
    "";

  const loadProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      const storedUser = getStoredUser();

      if (!storedUser) {
        setError("Ambassador session not found.");
        return;
      }

      setUser(storedUser);

      const userId = getUserId(storedUser);

      let serverProfile = null;

      if (userId) {
        try {
          const response = await api.get(
            `/ambassador/profile/${userId}`
          );

          serverProfile =
            response?.data?.profile ||
            response?.data?.data ||
            response?.data ||
            null;
        } catch (profileError) {
          console.warn(
            "Ambassador profile endpoint unavailable, using account data.",
            profileError?.response?.data?.message ||
              profileError?.message
          );
        }
      }

      const mergedProfile = {
        ...storedUser,
        ...(serverProfile || {}),
      };

      setProfile(mergedProfile);

      localStorage.setItem(
        "user",
        JSON.stringify(mergedProfile)
      );
    } catch (err) {
      console.error("Ambassador profile error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load ambassador profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const displayUser = profile || user || {};

  const fullName =
    displayUser?.name ||
    displayUser?.fullName ||
    displayUser?.username ||
    "Ambassador";

  const email =
    displayUser?.email ||
    "Not available";

  const phone =
    displayUser?.phone ||
    displayUser?.mobile ||
    displayUser?.phoneNumber ||
    "Not available";

  const role =
    displayUser?.role ||
    "ambassador";

  const collegeName =
    displayUser?.collegeName ||
    displayUser?.college?.name ||
    displayUser?.college?.collegeName ||
    displayUser?.universityName ||
    displayUser?.university?.name ||
    "College not linked";

  const collegeId =
    displayUser?.collegeId ||
    displayUser?.college?._id ||
    displayUser?.college ||
    displayUser?.universityId ||
    "";

  const location =
    displayUser?.location ||
    displayUser?.city ||
    displayUser?.address ||
    "Not available";

  const course =
    displayUser?.course ||
    displayUser?.branch ||
    displayUser?.program ||
    displayUser?.department ||
    "Not available";

  const year =
    displayUser?.year ||
    displayUser?.studyYear ||
    displayUser?.currentYear ||
    displayUser?.semester ||
    "Not available";

  const referralCode =
    displayUser?.referralCode ||
    displayUser?.ambassadorCode ||
    displayUser?.code ||
    "";

  const referralLink =
    displayUser?.referralLink ||
    displayUser?.ambassadorReferralLink ||
    (referralCode
      ? `${window.location.origin}/register?ref=${referralCode}`
      : "");

  const profileImage =
    displayUser?.avatar ||
    displayUser?.profileImage ||
    displayUser?.photo ||
    displayUser?.image ||
    "";

  const profileCompletion = useMemo(() => {
    const fields = [
      displayUser?.name,
      displayUser?.email,
      displayUser?.phone ||
        displayUser?.mobile,
      collegeId || collegeName,
      location,
      course,
      year,
      profileImage,
      referralCode,
    ];

    const completed = fields.filter(
      (field) =>
        field &&
        String(field).trim() !== "" &&
        String(field).trim() !== "Not available"
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [
    displayUser,
    collegeId,
    collegeName,
    location,
    course,
    year,
    profileImage,
    referralCode,
  ]);

  const joinedAt =
    displayUser?.createdAt ||
    displayUser?.joinedAt ||
    displayUser?.registeredAt ||
    null;

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const copyReferralLink = async () => {
    if (!referralLink) {
      setError("Referral link is not available yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setError("");
      setSuccess("Referral link copied successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Referral copy error:",
        err
      );

      setError("Unable to copy referral link.");
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {profileImage ? (
                <img
                  src={getAssetUrl(profileImage)}
                  alt={fullName}
                  className="h-28 w-28 rounded-[28px] border border-white/10 bg-white object-cover shadow-xl"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-[28px] text-4xl font-black text-black shadow-xl"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  {getInitials(fullName)}
                </div>
              )}

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <FiAward
                    size={14}
                    style={{ color: GOLD }}
                  />

                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                    Ambassador Profile
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {fullName}
                </h1>

                <p className="mt-2 text-sm font-medium text-gray-400">
                  {collegeName}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    icon={<FiShield />}
                    text={capitalize(role)}
                  />

                  {collegeId && (
                    <Badge
                      icon={<FiCheckCircle />}
                      text="College Linked"
                    />
                  )}

                  <Badge
                    icon={<FiUsers />}
                    text="Community Access"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadProfile(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                to="/ambassador/profile/edit"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiEdit2 />
                Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile completion */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Profile Strength
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950">
                Complete your ambassador profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A complete profile makes your ambassador identity
                more trustworthy to students and your college.
              </p>
            </div>

            <div className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  Completion
                </span>

                <span
                  className="text-sm font-black"
                  style={{ color: GOLD }}
                >
                  {profileCompletion}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${profileCompletion}%`,
                    backgroundColor: GOLD,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Information */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Personal Information
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Account & Academic Details
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<FiUser />}
                label="Full Name"
                value={fullName}
              />

              <InfoCard
                icon={<FiMail />}
                label="Email Address"
                value={email}
              />

              <InfoCard
                icon={<FiPhone />}
                label="Phone Number"
                value={phone}
              />

              <InfoCard
                icon={<FiMapPin />}
                label="Location"
                value={location}
              />

              <InfoCard
                icon={<FiBookOpen />}
                label="Course / Branch"
                value={course}
              />

              <InfoCard
                icon={<FiCalendar />}
                label="Year / Semester"
                value={year}
              />

              <InfoCard
                icon={<FiGlobe />}
                label="College"
                value={collegeName}
                wide
              />

              <InfoCard
                icon={<FiBriefcase />}
                label="Account Role"
                value={capitalize(role)}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
              <div className="flex items-start gap-3">
                <FiShield
                  className="mt-0.5 shrink-0"
                  style={{ color: GOLD }}
                />

                <div>
                  <p className="text-sm font-black text-gray-900">
                    College Ambassador Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    Your community creation and management access
                    should remain limited to the college connected
                    with this ambassador account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-6">

            {/* Referral */}
            <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color: GOLD,
                    }}
                  >
                    Ambassador Growth
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Referral Profile
                  </h2>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiUsers />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold text-gray-500">
                  Ambassador Code
                </p>

                <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="break-all text-sm font-black text-white">
                    {referralCode ||
                      "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-gray-500">
                  Referral Link
                </p>

                <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="break-all text-xs font-medium leading-5 text-gray-300">
                    {referralLink ||
                      "Referral link will appear when an ambassador code is assigned."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiCopy />
                Copy Referral Link
              </button>
            </section>

            {/* Account */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Account Overview
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950">
                Ambassador Status
              </h2>

              <div className="mt-5 space-y-3">
                <StatusRow
                  icon={<FiCheckCircle />}
                  title="Account Status"
                  value={
                    displayUser?.status
                      ? capitalize(
                          displayUser.status
                        )
                      : "Active"
                  }
                  positive
                />

                <StatusRow
                  icon={<FiShield />}
                  title="Role"
                  value={capitalize(role)}
                  positive
                />

                <StatusRow
                  icon={<FiBookOpen />}
                  title="College Link"
                  value={
                    collegeId
                      ? "Connected"
                      : "Not Connected"
                  }
                  positive={Boolean(collegeId)}
                />

                <StatusRow
                  icon={<FiCalendar />}
                  title="Joined"
                  value={formatDate(joinedAt)}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Ambassador Workspace
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Quick Actions
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              to="/ambassador/communities"
              icon={<FiUsers />}
              title="My Communities"
              description="Create and manage your college communities."
            />

            <ActionCard
              to="/ambassador/referrals"
              icon={<FiUser />}
              title="Referrals"
              description="Track students referred through your ambassador link."
            />

            <ActionCard
              to="/ambassador/analytics"
              icon={<FiGlobe />}
              title="Analytics"
              description="View your ambassador performance and growth."
            />

            <ActionCard
              to="/ambassador/profile/edit"
              icon={<FiEdit2 />}
              title="Edit Profile"
              description="Update your ambassador information."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const Badge = ({
  icon,
  text,
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300">
    {icon}
    {text}
  </span>
);

const InfoCard = ({
  icon,
  label,
  value,
  wide = false,
}) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 ${
      wide ? "sm:col-span-2" : ""
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "rgba(212,175,55,0.10)",
          color: GOLD,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-black text-gray-800">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const StatusRow = ({
  icon,
  title,
  value,
  positive = false,
}) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <div className="flex min-w-0 items-center gap-3">
      <span
        style={{
          color: positive
            ? "#16A34A"
            : "#6B7280",
        }}
      >
        {icon}
      </span>

      <span className="text-sm font-bold text-gray-700">
        {title}
      </span>
    </div>

    <span
      className={`shrink-0 text-right text-xs font-black ${
        positive
          ? "text-emerald-600"
          : "text-gray-500"
      }`}
    >
      {value}
    </span>
  </div>
);

const ActionCard = ({
  to,
  icon,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group rounded-2xl border border-gray-200 bg-[#FAFAF8] p-5 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-white hover:shadow-md"
  >
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl text-black transition group-hover:scale-105"
      style={{
        backgroundColor: GOLD,
      }}
    >
      {icon}
    </div>

    <h3 className="mt-4 text-base font-black text-gray-900">
      {title}
    </h3>

    <p className="mt-1 text-xs leading-5 text-gray-500">
      {description}
    </p>

    <div className="mt-4 flex items-center gap-1 text-xs font-black text-gray-500">
      Open
      <FiExternalLink />
    </div>
  </Link>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="h-28 rounded-3xl bg-white" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[520px] rounded-3xl bg-white" />
        <div className="space-y-6">
          <div className="h-64 rounded-3xl bg-white" />
          <div className="h-64 rounded-3xl bg-white" />
        </div>
      </div>

      <div className="h-64 rounded-3xl bg-white" />
    </div>
  </div>
);

const getAssetUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "A";

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const capitalize = (value = "") => {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

export default Profile;