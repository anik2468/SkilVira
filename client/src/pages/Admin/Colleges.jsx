import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiExternalLink,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
  FiXCircle,
  FiBookOpen,
  FiClock,
} from "react-icons/fi";

import {
  getColleges,
  verifyCollege as verifyCollegeApi,
  blockCollege as blockCollegeApi,
} from "../../services/collegeService";

const GOLD = "#D4AF37";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedCollege, setSelectedCollege] =
    useState(null);

  const [processingId, setProcessingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getColleges();

      const list =
        data?.colleges ||
        data?.data ||
        (Array.isArray(data)
          ? data
          : []);

      setColleges(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN COLLEGES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load colleges."
      );

      setColleges([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const verifyCollege = async (id) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await verifyCollegeApi(id);

      setColleges((prev) =>
        prev.map((college) =>
          college?._id === id
            ? {
                ...college,
                verified: true,
                blocked: false,
                status: "verified",
              }
            : college
        )
      );

      setSelectedCollege((prev) =>
        prev?._id === id
          ? {
              ...prev,
              verified: true,
              blocked: false,
              status: "verified",
            }
          : prev
      );

      setSuccess(
        "College verified successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "VERIFY COLLEGE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to verify college."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const blockCollege = async (id) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to block this college?"
      );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await blockCollegeApi(id);

      setColleges((prev) =>
        prev.map((college) =>
          college?._id === id
            ? {
                ...college,
                blocked: true,
                status: "blocked",
              }
            : college
        )
      );

      setSelectedCollege((prev) =>
        prev?._id === id
          ? {
              ...prev,
              blocked: true,
              status: "blocked",
            }
          : prev
      );

      setSuccess(
        "College blocked successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "BLOCK COLLEGE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to block college."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const verified =
      colleges.filter(
        (college) =>
          college?.verified === true
      ).length;

    const pending =
      colleges.filter(
        (college) =>
          !college?.verified &&
          !(
            college?.blocked === true ||
            String(
              college?.status || ""
            ).toLowerCase() ===
              "blocked"
          )
      ).length;

    const blocked =
      colleges.filter(
        (college) =>
          college?.blocked === true ||
          String(
            college?.status || ""
          ).toLowerCase() ===
            "blocked"
      ).length;

    return {
      total: colleges.length,
      verified,
      pending,
      blocked,
    };
  }, [colleges]);

  const filteredColleges =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return colleges.filter(
        (college) => {
          const text = [
            college?.name,
            college?.location,
            college?.university,
            college?.city,
            college?.state,
            college?.email,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            text.includes(query);

          const blocked =
            college?.blocked === true ||
            String(
              college?.status || ""
            ).toLowerCase() ===
              "blocked";

          const matchesFilter =
            filter === "All" ||
            (filter === "Verified" &&
              college?.verified === true &&
              !blocked) ||
            (filter === "Pending" &&
              !college?.verified &&
              !blocked) ||
            (filter === "Blocked" &&
              blocked);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      colleges,
      search,
      filter,
    ]);

  if (loading) {
    return <CollegesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShield
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Institution Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                College Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Review registered colleges, verify institutions and maintain the quality of the SkilVira campus network.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadColleges(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10 disabled:opacity-50"
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

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Colleges"
            value={stats.total}
            icon={<FiBookOpen />}
            tone="gold"
          />

          <MetricCard
            label="Verified"
            value={stats.verified}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <MetricCard
            label="Pending Review"
            value={stats.pending}
            icon={<FiShield />}
            tone="amber"
          />

          <MetricCard
            label="Blocked"
            value={stats.blocked}
            icon={<FiXCircle />}
            tone="red"
          />
        </div>

        {/* Network Insight */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Verification Health
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Institution trust
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Keep verified institutions clearly separated from pending and blocked records.
                </p>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiBookOpen />
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  Verification rate
                </span>

                <span className="text-sm font-black text-gray-900">
                  {stats.total > 0
                    ? Math.round(
                        (stats.verified /
                          stats.total) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (stats.verified /
                                stats.total) *
                                100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <SummaryBox
                label="Verified"
                value={stats.verified}
              />

              <SummaryBox
                label="Pending"
                value={stats.pending}
              />

              <SummaryBox
                label="Blocked"
                value={stats.blocked}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOLD,
              }}
            >
              Network Governance
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Admin responsibility
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Verify legitimate institutions before they become part of the wider SkilVira ecosystem.
            </p>

            <div className="mt-6 space-y-3">
              <GovernanceRow
                icon={<FiBookOpen />}
                title="Institution identity"
                description="Review the college and university details."
              />

              <GovernanceRow
                icon={<FiMapPin />}
                title="Location"
                description="Review the registered institutional location."
              />

              <GovernanceRow
                icon={<FiShield />}
                title="Verification"
                description="Verify trustworthy institutions and block problematic records."
              />
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-2xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search college, university, city or email..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Verified",
                "Pending",
                "Blocked",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFilter(item)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                    filter === item
                      ? "text-black"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={
                    filter === item
                      ? {
                          backgroundColor:
                            GOLD,
                        }
                      : undefined
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Institution Directory
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                Registered colleges
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              {filteredColleges.length} result
              {filteredColleges.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredColleges.length ===
          0 ? (
            <EmptyCollegeState
              hasFilters={
                Boolean(search.trim()) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      College
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      University
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredColleges.map(
                    (college) => (
                      <CollegeRow
                        key={college?._id}
                        college={college}
                        processingId={
                          processingId
                        }
                        onView={() =>
                          setSelectedCollege(
                            college
                          )
                        }
                        onVerify={
                          verifyCollege
                        }
                        onBlock={
                          blockCollege
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedCollege && (
        <CollegeModal
          college={selectedCollege}
          processingId={
            processingId
          }
          onClose={() =>
            setSelectedCollege(null)
          }
          onVerify={
            verifyCollege
          }
          onBlock={
            blockCollege
          }
        />
      )}
    </div>
  );
};

const CollegeRow = ({
  college,
  processingId,
  onView,
  onVerify,
  onBlock,
}) => {
  const blocked =
    college?.blocked === true ||
    String(
      college?.status || ""
    ).toLowerCase() ===
      "blocked";

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {college?.logo ? (
            <img
              src={getAssetUrl(
                college.logo
              )}
              alt={
                college?.name ||
                "College"
              }
              className="h-11 w-11 rounded-xl bg-white object-cover"
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
              style={{
                backgroundColor: GOLD,
              }}
            >
              <FiBookOpen />
            </div>
          )}

          <div className="min-w-0">
            <p className="max-w-[260px] truncate text-sm font-black text-gray-900">
              {college?.name ||
                "Unnamed College"}
            </p>

            {college?.email && (
              <p className="mt-1 text-xs text-gray-500">
                {college.email}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
          <FiMapPin className="text-gray-400" />

          {college?.location ||
            college?.city ||
            college?.state ||
            "Not available"}
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="max-w-[230px] truncate text-sm font-semibold text-gray-600">
          {college?.university ||
            "Not linked"}
        </p>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
            blocked
              ? "border-red-200 bg-red-50 text-red-700"
              : college?.verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {blocked ? (
            <FiXCircle />
          ) : college?.verified ? (
            <FiCheckCircle />
          ) : (
            <FiShield />
          )}

          {blocked
            ? "Blocked"
            : college?.verified
            ? "Verified"
            : "Pending"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 transition hover:border-[#D4AF37]"
          >
            <FiEye />
            View
          </button>

          {!college?.verified &&
            !blocked && (
              <button
                type="button"
                disabled={
                  processingId ===
                  college?._id
                }
                onClick={() =>
                  onVerify(
                    college?._id
                  )
                }
                className="rounded-xl px-3 py-2 text-xs font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                Verify
              </button>
            )}

          {!blocked && (
            <button
              type="button"
              disabled={
                processingId ===
                college?._id
              }
              onClick={() =>
                onBlock(
                  college?._id
                )
              }
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"
            >
              Block
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const CollegeModal = ({
  college,
  processingId,
  onClose,
  onVerify,
  onBlock,
}) => {
  const blocked =
    college?.blocked === true ||
    String(
      college?.status || ""
    ).toLowerCase() ===
      "blocked";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {college?.logo ? (
                <img
                  src={getAssetUrl(
                    college.logo
                  )}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiBookOpen />
                </div>
              )}

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Institution Review
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                  {college?.name ||
                    "College"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-500 transition hover:bg-gray-200"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              label="College Name"
              value={
                college?.name ||
                "Not available"
              }
            />

            <InfoCard
              label="University"
              value={
                college?.university ||
                "Not linked"
              }
            />

            <InfoCard
              label="Location"
              value={
                college?.location ||
                "Not available"
              }
            />

            <InfoCard
              label="City / State"
              value={
                college?.city &&
                college?.state
                  ? `${college.city}, ${college.state}`
                  : college?.city ||
                    college?.state ||
                    "Not available"
              }
            />

            <InfoCard
              label="Email"
              value={
                college?.email ||
                "Not available"
              }
            />

            <InfoCard
              label="Status"
              value={
                blocked
                  ? "Blocked"
                  : college?.verified
                  ? "Verified"
                  : "Pending"
              }
            />
          </div>

          {college?.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-xs font-black text-blue-600 transition hover:border-[#D4AF37]"
            >
              <FiExternalLink />
              Open Website
            </a>
          )}

          <div className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Verification
            </p>

            <div className="mt-4">
              {blocked ? (
                <div className="flex items-center gap-2 text-sm font-black text-red-700">
                  <FiXCircle />
                  This institution is blocked.
                </div>
              ) : college?.verified ? (
                <div className="flex items-center gap-2 text-sm font-black text-emerald-700">
                  <FiCheckCircle />
                  This institution is verified.
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-black text-amber-700">
                  <FiClock />
                  This institution is waiting for verification.
                </div>
              )}
            </div>
          </div>

          {!blocked && (
            <div className="flex flex-wrap justify-end gap-2">
              {!college?.verified && (
                <button
                  type="button"
                  disabled={
                    processingId ===
                    college?._id
                  }
                  onClick={() =>
                    onVerify(
                      college?._id
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black text-black disabled:opacity-50"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiCheckCircle />
                  Verify College
                </button>
              )}

              <button
                type="button"
                disabled={
                  processingId ===
                  college?._id
                }
                onClick={() =>
                  onBlock(
                    college?._id
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
              >
                <FiXCircle />
                Block College
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    amber:
      "bg-amber-50 text-amber-600",
    red:
      "bg-red-50 text-red-600",
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
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone] ||
            tones.gold
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const SummaryBox = ({
  label,
  value,
}) => (
  <div className="rounded-2xl bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-2xl font-black text-gray-950">
      {value}
    </p>
  </div>
);

const GovernanceRow = ({
  icon,
  title,
  description,
}) => (
  <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      {icon}
    </div>

    <div>
      <p className="text-sm font-black">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  </div>
);

const InfoCard = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-black text-gray-800">
      {value}
    </p>
  </div>
);

const EmptyCollegeState = ({
  hasFilters,
  clear,
}) => (
  <div className="px-6 py-16 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      <FiBookOpen size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Colleges"
        : "No Colleges Found"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or filter."
        : "Registered college records will appear here."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-[#D4AF37]"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const CollegesSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1500px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-3xl bg-white" />
        <div className="h-80 rounded-3xl bg-gray-900" />
      </div>

      <div className="h-20 rounded-3xl bg-white" />

      <div className="h-[520px] rounded-3xl bg-white" />
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

  return `${API_ORIGIN}${value}`;
};

export default Colleges;