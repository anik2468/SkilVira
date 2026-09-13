import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCopy,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiLink,
  FiRefreshCw,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiBarChart2,
  FiUserPlus,
  FiShare2,
  FiGift,
  FiAlertCircle,
  FiChevronRight,
  FiActivity,
  FiDollarSign,
  FiTarget,
  FiPercent,
} from "react-icons/fi";

import api from "../../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const [data, setData] = useState({
    stats: {},
    revenue: {},
    referral: {},
    students: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("Ambassador session not found. Please login again.");
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } catch (err) {
      console.error("User parse error:", err);
      setError("Unable to read ambassador session.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id || user?._id;

    if (userId) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async (isRefresh = false) => {
    const userId = user?.id || user?._id;

    if (!userId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      const response = await api.get(
        `/ambassador/dashboard/${userId}`
      );

      const result = response?.data?.data || response?.data || {};

      setData({
        stats: result?.stats || {},
        revenue: result?.revenue || {},
        referral: result?.referral || {},
        students: Array.isArray(result?.students)
          ? result.students
          : [],
      });
    } catch (err) {
      console.error("Ambassador dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load ambassador dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const source = data?.stats || {};
    const revenue = data?.revenue || {};

    const totalReferrals = Number(source.totalReferrals || 0);
    const successfulReferrals = Number(
      source.successfulReferrals || 0
    );
    const certificates = Number(source.certificates || 0);
    const rewardPoints = Number(source.rewardPoints || 0);
    const rank = Number(source.rank || 0);

    const conversion =
      totalReferrals > 0
        ? Math.round(
            (successfulReferrals / totalReferrals) * 100
          )
        : 0;

    const commissionRate = Number(
      revenue.commissionRate ??
        source.commissionRate ??
        15
    );

    const revenueGenerated = Number(
      revenue.generated ??
        source.totalRevenueGenerated ??
        0
    );

    const commissionEarned = Number(
      revenue.earned ??
        source.totalCommissionEarned ??
        0
    );

    const potentialRevenue = Number(
      revenue.potential ??
        source.potentialRevenue ??
        0
    );

    const potentialCommission = Number(
      revenue.potentialEarnings ??
        source.potentialCommission ??
        0
    );

    const totalRevenueOpportunity = Number(
      revenue.totalOpportunity ??
        source.totalRevenueOpportunity ??
        revenueGenerated + potentialRevenue
    );

    const totalCommissionOpportunity = Number(
      revenue.totalEarningsOpportunity ??
        source.totalCommissionOpportunity ??
        commissionEarned + potentialCommission
    );

    return {
      totalReferrals,
      successfulReferrals,
      certificates,
      rewardPoints,
      rank,
      conversion,

      commissionRate,
      revenueGenerated,
      commissionEarned,
      potentialRevenue,
      potentialCommission,
      totalRevenueOpportunity,
      totalCommissionOpportunity,
    };
  }, [data]);

  const weeklyTrend = useMemo(() => {
    const students = Array.isArray(data.students)
      ? data.students
      : [];

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        date,
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        count: 0,
      };
    });

    students.forEach((student) => {
      if (!student?.createdAt) return;

      const created = new Date(student.createdAt);

      if (Number.isNaN(created.getTime())) return;

      created.setHours(0, 0, 0, 0);

      const matchingDay = days.find(
        (day) => day.date.getTime() === created.getTime()
      );

      if (matchingDay) {
        matchingDay.count += 1;
      }
    });

    return days;
  }, [data]);

  const trendMax = Math.max(
    ...weeklyTrend.map((item) => item.count),
    1
  );

  const copyLink = async () => {
    const referralLink = data?.referral?.link;

    if (!referralLink) {
      setError("Referral link is not available.");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setSuccess("Referral link copied successfully.");

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error("Clipboard error:", err);
      setError("Unable to copy referral link.");
    }
  };

  const shareReferral = async () => {
    const referralLink = data?.referral?.link;

    if (!referralLink) {
      setError("Referral link is not available.");
      return;
    }

    const shareData = {
      title: "Join SkilVira",
      text: "Join SkilVira through my ambassador referral link.",
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(referralLink);
      setSuccess("Referral link copied successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.log("Share cancelled or failed:", err);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F6F7F5] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FiAlertCircle size={26} />
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-950">
            Ambassador Session Missing
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please login again to access your ambassador dashboard.
          </p>
        </div>
      </div>
    );
  }

  const firstName = user?.name
    ? String(user.name).split(" ")[0]
    : "Ambassador";

  return (
    <div className="min-h-screen bg-[#F6F7F5] px-3 py-4 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-5">

        {/* Header */}
        <header className="rounded-[24px] border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Ambassador Dashboard
                </p>
              </div>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                Overview
              </h1>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-black text-[#D4AF37]">
                  {getInitials(user?.name || "Ambassador")}
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-black text-gray-900">
                    {user?.name || "Ambassador"}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400">
                    College Ambassador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#09101E] text-white shadow-[0_24px_70px_rgba(9,16,30,0.18)]">
          <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/20 blur-[110px]" />

          <div className="relative grid gap-7 p-6 sm:p-8 lg:p-10 xl:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiAward size={13} className="text-[#D4AF37]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
                  Your Ambassador Workspace
                </span>
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Turn your campus reach{" "}
                <span className="text-[#D4AF37]">
                  into impact.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                Welcome back, {firstName}. Track referrals,
                support students and grow your campus network
                while earning commission from successful
                student payments.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/ambassador/referrals"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-black text-black hover:bg-[#E0C04B]"
                >
                  <FiUsers size={15} />
                  Manage Referrals
                  <FiArrowUpRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={shareReferral}
                  disabled={!data?.referral?.link}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black text-white hover:bg-white/10 disabled:opacity-40"
                >
                  <FiShare2 size={15} />
                  Share Link
                </button>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniMetric label="Referrals" value={stats.totalReferrals} />
                <MiniMetric label="Enrolled" value={stats.successfulReferrals} />
                <MiniMetric label="Conversion" value={`${stats.conversion}%`} />
                <MiniMetric
                  label="Rank"
                  value={stats.rank ? `#${stats.rank}` : "—"}
                />
              </div>
            </div>

            {/* Hero Revenue */}
            <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                    Your Earnings
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/70">
                    Live revenue performance
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                  <FiDollarSign size={18} />
                </div>
              </div>

              <p className="mt-7 text-[9px] font-black uppercase tracking-[0.17em] text-white/35">
                Commission Earned
              </p>

              <p className="mt-1 text-4xl font-black text-white">
                {formatCurrency(stats.commissionEarned)}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-white/40">
                  Revenue generated
                </span>
                <span className="font-black text-[#D4AF37]">
                  {formatCurrency(stats.revenueGenerated)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <DarkInfo
                  icon={<FiPercent />}
                  label="Commission"
                  value={`${stats.commissionRate}%`}
                />

                <DarkInfo
                  icon={<FiTarget />}
                  label="Potential"
                  value={formatCurrency(stats.potentialCommission)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* KPI */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Revenue Generated"
            value={formatCurrency(stats.revenueGenerated)}
            subtitle="Total successful payment value from your referrals"
            icon={<FiDollarSign size={20} />}
            tone="gold"
          />

          <KpiCard
            title="You Earned"
            value={formatCurrency(stats.commissionEarned)}
            subtitle={`${stats.commissionRate}% commission earned so far`}
            icon={<FiTrendingUp size={20} />}
            tone="green"
          />

          <KpiCard
            title="Potential Earnings"
            value={formatCurrency(stats.potentialCommission)}
            subtitle="Commission possible from pending payment opportunities"
            icon={<FiTarget size={20} />}
            tone="blue"
          />

          <KpiCard
            title="Total Opportunity"
            value={formatCurrency(stats.totalCommissionOpportunity)}
            subtitle="Earned + potential commission value"
            icon={<FiAward size={20} />}
            tone="purple"
          />
        </section>

        {/* Revenue Overview */}
        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                  Revenue Intelligence
                </p>

                <h3 className="mt-1 text-2xl font-black text-gray-950">
                  Your earning potential
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Understand exactly how much value your referrals
                  are generating and what is still possible.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#8D7414]">
                <FiBarChart2 size={20} />
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <RevenueBox
                label="Successful Revenue"
                value={formatCurrency(stats.revenueGenerated)}
                subtitle="Paid by referred students"
                icon={<FiCheckCircle />}
                dark
              />

              <RevenueBox
                label="Potential Revenue"
                value={formatCurrency(stats.potentialRevenue)}
                subtitle="Still pending / eligible"
                icon={<FiClock />}
              />

              <RevenueBox
                label="Commission Earned"
                value={formatCurrency(stats.commissionEarned)}
                subtitle={`${stats.commissionRate}% actual earning`}
                icon={<FiDollarSign />}
              />

              <RevenueBox
                label="Potential Commission"
                value={formatCurrency(stats.potentialCommission)}
                subtitle="Possible future earning"
                icon={<FiTarget />}
              />
            </div>

            <div className="mt-5 rounded-[22px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                    Total earning opportunity
                  </p>

                  <p className="mt-1 text-3xl font-black text-gray-950">
                    {formatCurrency(stats.totalCommissionOpportunity)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    Rate
                  </p>
                  <p className="mt-1 text-xl font-black text-[#8D7414]">
                    {stats.commissionRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
              Referral Engine
            </p>

            <h3 className="mt-1 text-2xl font-black text-gray-950">
              Grow your earnings
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Every successful referred payment can contribute
              to your ambassador earnings.
            </p>

            <div className="mt-6 rounded-[22px] bg-[#0A101D] p-5 text-white">
              <p className="text-[9px] font-black uppercase tracking-[0.17em] text-white/35">
                Referral Code
              </p>

              <p className="mt-2 text-2xl font-black text-[#D4AF37]">
                {data?.referral?.code || "—"}
              </p>

              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.17em] text-white/35">
                Referral Link
              </p>

              <p className="mt-2 truncate text-xs font-semibold text-white/60">
                {data?.referral?.link || "Unavailable"}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  disabled={!data?.referral?.link}
                  className="flex-1 rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-black text-black disabled:opacity-40"
                >
                  <FiCopy className="mr-1 inline" />
                  Copy
                </button>

                <button
                  type="button"
                  onClick={shareReferral}
                  disabled={!data?.referral?.link}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black text-white disabled:opacity-40"
                >
                  <FiShare2 className="mr-1 inline" />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SmallStat
                label="Total Referrals"
                value={stats.totalReferrals}
              />

              <SmallStat
                label="Enrollments"
                value={stats.successfulReferrals}
              />

              <SmallStat
                label="Reward Points"
                value={stats.rewardPoints}
              />

              <SmallStat
                label="Rank"
                value={stats.rank ? `#${stats.rank}` : "—"}
              />
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">

          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
              Performance Snapshot
            </p>

            <h3 className="mt-1 text-xl font-black text-gray-950">
              Referral momentum
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              New referred students across the last 7 days.
            </p>

            <div className="mt-9 flex h-[245px] items-end gap-2 border-b border-gray-100 px-1 pb-4 sm:gap-4">
              {weeklyTrend.map((item) => {
                const height =
                  item.count === 0
                    ? 5
                    : Math.max(
                        12,
                        (item.count / trendMax) * 100
                      );

                return (
                  <div
                    key={item.date.toISOString()}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="relative flex h-full w-full items-end justify-center">
                      <div
                        className="group relative w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#C69F22] to-[#E2C45A]"
                        style={{
                          height: `${height}%`,
                          minHeight: "6px",
                        }}
                        title={`${item.count} referral${
                          item.count === 1 ? "" : "s"
                        }`}
                      >
                        {item.count > 0 && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-500 opacity-0 group-hover:opacity-100">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-gray-400">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] bg-[#0A101D] p-5 text-white shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
                  Conversion
                </p>

                <h3 className="mt-1 text-xl font-black">
                  Referral funnel
                </h3>
              </div>

              <FiBarChart2 className="text-[#D4AF37]" size={20} />
            </div>

            <div className="mt-7">
              <p className="text-4xl font-black">
                {stats.conversion}%
              </p>

              <p className="mt-1 text-xs text-white/35">
                Overall conversion
              </p>

              <div className="mt-7 space-y-5">
                <FunnelRow
                  label="Referred students"
                  value={stats.totalReferrals}
                  percentage={100}
                />

                <FunnelRow
                  label="Successful enrollments"
                  value={stats.successfulReferrals}
                  percentage={
                    stats.totalReferrals
                      ? stats.conversion
                      : 0
                  }
                />

                <FunnelRow
                  label="Certificates"
                  value={stats.certificates}
                  percentage={
                    stats.totalReferrals
                      ? Math.round(
                          (stats.certificates /
                            stats.totalReferrals) *
                            100
                        )
                      : 0
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Students */}
        <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                Community Growth
              </p>

              <h3 className="mt-1 text-2xl font-black text-gray-950">
                Recent referred students
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Students connected through your ambassador activity.
              </p>
            </div>

            <Link
              to="/ambassador/students"
              className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-gray-950"
            >
              View all students
              <FiArrowUpRight size={14} />
            </Link>
          </div>

          {data.students.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-gray-300 bg-[#FAFAF7] px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
                <FiUsers size={27} />
              </div>

              <h4 className="mt-5 text-xl font-black text-gray-950">
                No Students Referred Yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Start sharing your referral link to grow your
                ambassador network and earning potential.
              </p>

              <button
                type="button"
                onClick={copyLink}
                disabled={!data?.referral?.link}
                className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-black text-black disabled:opacity-40"
              >
                <FiCopy className="mr-1 inline" />
                Copy Referral Link
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 hidden overflow-hidden rounded-[22px] border border-gray-100 md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FAFAF7]">
                      <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Student
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Status
                      </th>

                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {data.students.slice(0, 8).map((student) => (
                      <tr
                        key={
                          student?._id ||
                          student?.email ||
                          student?.name
                        }
                        className="border-b border-gray-100 hover:bg-[#FCFCF9]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[10px] font-black text-[#D4AF37]">
                              {getInitials(student?.name || "Student")}
                            </div>

                            <div>
                              <p className="text-sm font-black text-gray-900">
                                {student?.name || "Student"}
                              </p>

                              {Number(student?.commissionEarned || 0) > 0 && (
                                <p className="mt-1 text-[9px] font-black text-emerald-600">
                                  Earned{" "}
                                  {formatCurrency(
                                    student.commissionEarned
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {student?.email || "—"}
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {formatDate(student?.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                            {student?.status || "Joined"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <FiChevronRight
                            size={15}
                            className="text-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-3 md:hidden">
                {data.students.slice(0, 8).map((student) => (
                  <div
                    key={
                      student?._id ||
                      student?.email ||
                      student?.name
                    }
                    className="rounded-[20px] border border-gray-100 bg-[#FAFAF7] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xs font-black text-[#D4AF37]">
                        {getInitials(student?.name || "Student")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-gray-900">
                          {student?.name || "Student"}
                        </p>

                        <p className="truncate text-[10px] text-gray-400">
                          {student?.email || "—"}
                        </p>
                      </div>

                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">
                        {student?.status || "Joined"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                      <div>
                        <p className="text-[9px] uppercase text-gray-400">
                          Revenue
                        </p>
                        <p className="mt-1 text-xs font-black text-gray-800">
                          {formatCurrency(
                            student?.revenueGenerated || 0
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase text-gray-400">
                          Earned
                        </p>
                        <p className="mt-1 text-xs font-black text-emerald-600">
                          {formatCurrency(
                            student?.commissionEarned || 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B28F16]">
            Workspace
          </p>

          <h3 className="mt-1 text-2xl font-black text-gray-950">
            Ambassador tools
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              to="/ambassador/referrals"
              icon={<FiUsers />}
              title="Referral Center"
              description="Track referrals and enrollment activity."
            />

            <QuickAction
              to="/ambassador/students"
              icon={<FiUserPlus />}
              title="My Students"
              description="View students connected through your link."
            />

            <QuickAction
              to="/ambassador/analytics"
              icon={<FiBarChart2 />}
              title="Analytics"
              description="Understand ambassador performance."
            />

            <QuickAction
              to="/ambassador/communities"
              icon={<FiGift />}
              title="Communities"
              description="Build and manage your student community."
            />
          </div>
        </section>

        {/* Status */}
        <div className="rounded-[22px] border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={16} />
              </div>

              <div>
                <p className="text-xs font-black text-gray-900">
                  Ambassador workspace active
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Revenue, referral and student data are synced with
                  the backend.
                </p>
              </div>
            </div>

            <span className="hidden text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 sm:block">
              ● Live workspace
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   COMPONENTS
========================================================= */

const MiniMetric = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/30">
      {label}
    </p>

    <p className="mt-1.5 text-lg font-black text-white">
      {value}
    </p>
  </div>
);

const DarkInfo = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
    <div className="flex items-center gap-2 text-white/35">
      {icon}
      <p className="text-[9px] font-black uppercase tracking-[0.13em]">
        {label}
      </p>
    </div>

    <p className="mt-2 text-xl font-black text-white">
      {value}
    </p>
  </div>
);

const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  tone = "gold",
}) => {
  const toneMap = {
    gold: {
      box: "bg-[#D4AF37]/10",
      text: "text-[#8D7414]",
      dot: "bg-[#D4AF37]",
    },
    green: {
      box: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    blue: {
      box: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
    },
    purple: {
      box: "bg-purple-50",
      text: "text-purple-600",
      dot: "bg-purple-500",
    },
  };

  const selected = toneMap[tone] || toneMap.gold;

  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${selected.dot}`} />

            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">
              {title}
            </p>
          </div>

          <p className="mt-4 text-3xl font-black tracking-tight text-gray-950">
            {value}
          </p>

          <p className="mt-1.5 text-xs leading-5 text-gray-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${selected.box} ${selected.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const RevenueBox = ({
  label,
  value,
  subtitle,
  icon,
  dark = false,
}) => (
  <div
    className={
      dark
        ? "rounded-[22px] bg-[#0A101D] p-5 text-white"
        : "rounded-[22px] border border-gray-100 bg-[#FAFAF7] p-5"
    }
  >
    <div
      className={`flex items-center gap-2 ${
        dark ? "text-[#D4AF37]" : "text-[#8D7414]"
      }`}
    >
      {icon}

      <p className="text-[9px] font-black uppercase tracking-[0.15em]">
        {label}
      </p>
    </div>

    <p
      className={`mt-3 text-2xl font-black ${
        dark ? "text-white" : "text-gray-950"
      }`}
    >
      {value}
    </p>

    <p
      className={`mt-1 text-[10px] ${
        dark ? "text-white/35" : "text-gray-400"
      }`}
    >
      {subtitle}
    </p>
  </div>
);

const SmallStat = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-3.5">
    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-lg font-black text-gray-950">
      {value}
    </p>
  </div>
);

const FunnelRow = ({ label, value, percentage }) => (
  <div>
    <div className="flex items-center justify-between gap-4">
      <span className="truncate text-xs font-bold text-white/60">
        {label}
      </span>

      <span className="shrink-0 text-sm font-black text-white">
        {value}
      </span>
    </div>

    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#C69F22] to-[#E6CC63]"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
        }}
      />
    </div>

    <p className="mt-1 text-right text-[9px] font-bold text-white/25">
      {Math.round(
        Math.min(100, Math.max(0, percentage))
      )}%
    </p>
  </div>
);

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
        {icon}
      </div>

      <FiArrowUpRight
        size={16}
        className="text-gray-300 group-hover:text-gray-800"
      />
    </div>

    <h4 className="mt-5 text-lg font-black text-gray-950">
      {title}
    </h4>

    <p className="mt-1.5 text-xs leading-6 text-gray-500">
      {description}
    </p>
  </Link>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#F6F7F5] px-3 py-4 sm:px-5 lg:px-7">
    <div className="mx-auto max-w-[1500px] animate-pulse space-y-5">
      <div className="h-20 rounded-[24px] bg-white" />
      <div className="h-[420px] rounded-[30px] bg-[#0A101D]" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-[24px] bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-[500px] rounded-[28px] bg-white" />
        <div className="h-[500px] rounded-[28px] bg-white" />
      </div>

      <div className="h-[420px] rounded-[28px] bg-white" />
    </div>
  </div>
);

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "AM";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "₹0";

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

export default Dashboard;