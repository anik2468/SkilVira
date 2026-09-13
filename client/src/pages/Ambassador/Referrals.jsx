import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiCopy,
  FiShare2,
  FiRefreshCw,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiUserPlus,
  FiLink,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const Referrals = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [copied, setCopied] = useState("");
  const [sharing, setSharing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReferralData();
  }, []);

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored) return null;

      return JSON.parse(stored);
    } catch (err) {
      console.error("User parse error:", err);
      return null;
    }
  };

  const getUserId = (storedUser) =>
    storedUser?.id ||
    storedUser?._id ||
    storedUser?.userId ||
    "";

  const loadReferralData = async (isRefresh = false) => {
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

      let response;

      try {
        /*
         * Preferred endpoint:
         * Backend should automatically create/return the
         * ambassador referral code.
         */
        response = await api.get(
          `/ambassador/referrals/${userId}`
        );
      } catch (primaryError) {
        /*
         * Fallback to ambassador dashboard data if the
         * dedicated referral endpoint is not available yet.
         */
        console.warn(
          "Dedicated referral endpoint unavailable. Falling back to dashboard.",
          primaryError?.response?.data?.message ||
            primaryError?.message
        );

        response = await api.get(
          `/ambassador/dashboard/${userId}`
        );
      }

      const payload =
        response?.data?.data ||
        response?.data?.referrals ||
        response?.data ||
        {};

      setData(payload);
    } catch (err) {
      console.error("Referral data error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load referral details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * Referral code is READ ONLY here.
   *
   * It must be generated automatically by backend
   * when the ambassador account is created/approved.
   */
  const referralCode = useMemo(() => {
    return (
      data?.referralCode ||
      data?.ambassadorCode ||
      data?.code ||
      user?.referralCode ||
      user?.ambassadorCode ||
      user?.code ||
      ""
    );
  }, [data, user]);

  const referralLink = useMemo(() => {
    return (
      data?.referralLink ||
      data?.ambassadorReferralLink ||
      user?.referralLink ||
      user?.ambassadorReferralLink ||
      (referralCode
        ? `${window.location.origin}/register?ref=${encodeURIComponent(
            referralCode
          )}`
        : "")
    );
  }, [data, user, referralCode]);

  const totalReferrals = Number(
    data?.totalReferrals ??
      data?.referralCount ??
      data?.total ??
      data?.referrals?.length ??
      0
  );

  const successfulReferrals = Number(
    data?.successfulReferrals ??
      data?.convertedReferrals ??
      data?.enrolledStudents ??
      data?.enrollments ??
      0
  );

  const pendingReferrals = Number(
    data?.pendingReferrals ??
      data?.pending ??
      Math.max(
        totalReferrals - successfulReferrals,
        0
      )
  );

  const rewardPoints = Number(
    data?.rewardPoints ??
      data?.points ??
      data?.rewards ??
      0
  );

  const conversionRate =
    totalReferrals > 0
      ? Math.round(
          (successfulReferrals /
            totalReferrals) *
            100
        )
      : 0;

  const referredStudents = useMemo(() => {
    const list =
      data?.students ||
      data?.referredStudents ||
      data?.referralsList ||
      data?.referrals ||
      [];

    return Array.isArray(list) ? list : [];
  }, [data]);

  const copyValue = async (
    value,
    type
  ) => {
    if (!value) {
      setError(
        type === "code"
          ? "Referral code is not available yet."
          : "Referral link is not available yet."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 2200);
    } catch (err) {
      console.error(
        "Copy referral error:",
        err
      );

      setError(
        "Unable to copy. Please copy manually."
      );
    }
  };

  const shareReferral = async () => {
    if (!referralLink) {
      setError(
        "Referral link is not available yet."
      );
      return;
    }

    try {
      setSharing(true);
      setError("");

      if (
        navigator.share
      ) {
        await navigator.share({
          title: "Join SkilVira",
          text: `Join SkilVira using my ambassador referral link.`,
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(
          referralLink
        );

        setSuccess(
          "Referral link copied. You can now share it."
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      }
    } catch (err) {
      /*
       * User closing native share sheet throws AbortError.
       * Don't show a false error in that case.
       */
      if (
        err?.name !==
        "AbortError"
      ) {
        console.error(
          "Share referral error:",
          err
        );

        setError(
          "Unable to share referral link."
        );
      }
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return <ReferralsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShare2
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Ambassador Referrals
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Grow Your Network
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Share your automatically generated SkilVira referral
                code and help students discover courses, internships
                and opportunities.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadReferralData(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
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

        {/* Referral Identity */}
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          <div className="rounded-[30px] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Your Referral Identity
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Referral Code
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  This code is generated automatically for your
                  ambassador account. You cannot manually change it
                  from the ambassador dashboard.
                </p>
              </div>

              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiLink size={22} />
              </div>
            </div>

            <div className="mt-7 rounded-[24px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-500">
                Auto-generated Code
              </p>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-all text-3xl font-black tracking-wider text-[#8D7414] sm:text-4xl">
                  {referralCode || "Generating..."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    copyValue(
                      referralCode,
                      "code"
                    )
                  }
                  disabled={!referralCode}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-black disabled:opacity-50"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  {copied === "code" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiCopy />
                  )}

                  {copied === "code"
                    ? "Copied"
                    : "Copy Code"}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-500">
                Referral Link
              </p>

              <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-[#FAFAF8] p-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 px-2">
                  <p className="break-all text-sm font-semibold leading-6 text-gray-600">
                    {referralLink ||
                      "Referral link will be available once your code is generated."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyValue(
                      referralLink,
                      "link"
                    )
                  }
                  disabled={!referralLink}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-black text-gray-700 disabled:opacity-50"
                >
                  {copied === "link" ? (
                    <FiCheckCircle className="text-emerald-500" />
                  ) : (
                    <FiCopy />
                  )}

                  {copied === "link"
                    ? "Copied"
                    : "Copy Link"}
                </button>
              </div>

              <button
                type="button"
                onClick={shareReferral}
                disabled={
                  sharing ||
                  !referralLink
                }
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiShare2 />

                {sharing
                  ? "Opening Share..."
                  : "Share Referral Link"}
              </button>
            </div>
          </div>

          {/* Auto generation notice */}
          <div className="relative overflow-hidden rounded-[30px] bg-black p-6 text-white shadow-2xl sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#D4AF37]/15 blur-3xl" />

            <div className="relative">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiAward size={25} />
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Automatic Referral System
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Your referral identity is created automatically by
                SkilVira. Employees do not need to manually create
                codes for ambassadors.
              </p>

              <div className="mt-6 space-y-3">
                <SystemStep
                  number="01"
                  title="Ambassador account"
                  description="Your ambassador account is created and approved."
                />

                <SystemStep
                  number="02"
                  title="Unique code generated"
                  description="Backend automatically assigns one unique referral code."
                />

                <SystemStep
                  number="03"
                  title="Start sharing"
                  description="Use the generated code or referral link with students."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Referrals"
            value={totalReferrals}
            icon={<FiUsers />}
            tone="gold"
          />

          <MetricCard
            label="Successful"
            value={successfulReferrals}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <MetricCard
            label="Pending"
            value={pendingReferrals}
            icon={<FiUserPlus />}
            tone="blue"
          />

          <MetricCard
            label="Reward Points"
            value={rewardPoints}
            icon={<FiAward />}
            tone="purple"
          />
        </div>

        {/* Performance */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Referral Performance
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Conversion Overview
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <FiTrendingUp />
              {conversionRate}% conversion
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                Referral conversion
              </span>

              <span className="text-sm font-black text-gray-900">
                {successfulReferrals} /{" "}
                {totalReferrals}
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    conversionRate,
                    100
                  )}%`,
                  backgroundColor: GOLD,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniMetric
              label="People Referred"
              value={totalReferrals}
            />

            <MiniMetric
              label="Converted"
              value={successfulReferrals}
            />

            <MiniMetric
              label="Still Pending"
              value={pendingReferrals}
            />
          </div>
        </section>

        {/* Referred Students */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Referral Activity
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Referred Students
              </h2>
            </div>

            <span className="text-sm font-semibold text-gray-500">
              {referredStudents.length} record
              {referredStudents.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {referredStudents.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiUsers size={28} />
              </div>

              <h3 className="mt-5 text-xl font-black text-gray-950">
                No referrals yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Start sharing your automatically generated referral
                link to bring students to SkilVira.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
              <div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] gap-4 bg-[#FAFAF8] px-5 py-4 text-xs font-black uppercase tracking-wide text-gray-400 md:grid">
                <span>Student</span>
                <span>Status</span>
                <span>Joined</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-gray-100">
                {referredStudents.map(
                  (student, index) => (
                    <ReferralRow
                      key={
                        student?._id ||
                        student?.id ||
                        index
                      }
                      student={student}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const SystemStep = ({
  number,
  title,
  description,
}) => (
  <div className="flex gap-3">
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      {number}
    </div>

    <div>
      <p className="text-sm font-black text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  </div>
);

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    green:
      "bg-emerald-50 text-emerald-600",
    blue:
      "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const MiniMetric = ({
  label,
  value,
}) => (
  <div className="rounded-2xl bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-2xl font-black text-gray-900">
      {value}
    </p>
  </div>
);

const ReferralRow = ({
  student,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    student?.studentName ||
    student?.email ||
    "Student";

  const email =
    student?.email ||
    "";

  const rawStatus =
    student?.status ||
    student?.applicationStatus ||
    student?.enrollmentStatus ||
    "Pending";

  const status = String(
    rawStatus
  );

  const normalizedStatus =
    status.toLowerCase();

  const successful =
    [
      "approved",
      "active",
      "enrolled",
      "completed",
      "success",
      "successful",
    ].includes(
      normalizedStatus
    );

  const joinedAt =
    student?.createdAt ||
    student?.joinedAt ||
    student?.registeredAt ||
    "";

  const formattedDate = joinedAt
    ? formatDate(joinedAt)
    : "—";

  return (
    <div className="grid gap-3 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-black"
          style={{
            backgroundColor: GOLD,
          }}
        >
          {getInitials(name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-900">
            {name}
          </p>

          {email && (
            <p className="truncate text-xs text-gray-500">
              {email}
            </p>
          )}
        </div>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${
            successful
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {capitalize(status)}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-600">
          {formattedDate}
        </p>
      </div>

      <div>
        <span className="inline-flex items-center gap-1 text-xs font-black text-gray-400">
          View
          <FiArrowUpRight />
        </span>
      </div>
    </div>
  );
};

const ReferralsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[430px] rounded-[30px] bg-white" />
        <div className="h-[430px] rounded-[30px] bg-gray-900" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-80 rounded-3xl bg-white" />
      <div className="h-96 rounded-3xl bg-white" />
    </div>
  </div>
);

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "S";

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const capitalize = (value = "") => {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

export default Referrals;