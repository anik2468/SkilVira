import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUsers,
  FiMapPin,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiCalendar,
  FiExternalLink,
} from "react-icons/fi";

import {
  getRecruiterInternships,
  deleteInternship,
} from "../../services/internshipService";

import { useAuth } from "../../context/AuthContext";

const GOLD = "#D4AF37";

const Internships = () => {
  const { user } = useAuth();
  const recruiterId = user?.id || user?._id;
  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (recruiterId) {
      loadInternships();
    } else {
      setError("Recruiter session not found. Please log in again.");
      setLoading(false);
    }
  }, [recruiterId]);

  const loadInternships = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res =
        await getRecruiterInternships(recruiterId);

      const list =
        res?.internships ||
        res?.data?.internships ||
        (Array.isArray(res)
          ? res
          : []);

      setInternships(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "Load internships error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load internships."
      );

      setInternships([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this internship?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteInternship(id);

      setInternships((prev) =>
        prev.filter(
          (item) => item?._id !== id
        )
      );

      setSuccess(
        "Internship deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete internship."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: internships.length,

      active: internships.filter(
        (item) =>
          String(
            item?.status || ""
          ).toLowerCase() !==
            "closed" &&
          String(
            item?.approvalStatus || ""
          ).toLowerCase() !==
            "rejected"
      ).length,

      approved: internships.filter(
        (item) =>
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
          "approved"
      ).length,

      pending: internships.filter(
        (item) =>
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
          "pending"
      ).length,

      rejected: internships.filter(
        (item) =>
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
          "rejected"
      ).length,

      totalApplicants:
        internships.reduce(
          (sum, item) =>
            sum +
            Number(
              item?.applicants ??
                item?.applicationCount ??
                item?.applications?.length ??
                0
            ),
          0
        ),

      totalViews:
        internships.reduce(
          (sum, item) =>
            sum +
            Number(item?.views || 0),
          0
        ),
    };
  }, [internships]);

  const filteredInternships =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return internships.filter(
        (item) => {
          const title =
            String(
              item?.title || ""
            ).toLowerCase();

          const company =
            String(
              item?.company || ""
            ).toLowerCase();

          const category =
            String(
              item?.category || ""
            ).toLowerCase();

          const location =
            String(
              item?.location || ""
            ).toLowerCase();

          const approval =
            String(
              item?.approvalStatus ||
                ""
            ).toLowerCase();

          const status =
            String(
              item?.status || ""
            ).toLowerCase();

          const searchMatch =
            !query ||
            title.includes(query) ||
            company.includes(query) ||
            category.includes(query) ||
            location.includes(query) ||
            approval.includes(query) ||
            status.includes(query);

          let statusMatch = true;

          if (
            statusFilter ===
            "Active"
          ) {
            statusMatch =
              String(
                item?.status || ""
              ).toLowerCase() !==
                "closed" &&
              String(
                item?.approvalStatus ||
                  ""
              ).toLowerCase() !==
                "rejected";
          }

          if (
            statusFilter ===
            "Approved"
          ) {
            statusMatch =
              String(
                item?.approvalStatus ||
                  ""
              ).toLowerCase() ===
              "approved";
          }

          if (
            statusFilter ===
            "Pending"
          ) {
            statusMatch =
              String(
                item?.approvalStatus ||
                  ""
              ).toLowerCase() ===
              "pending";
          }

          if (
            statusFilter ===
            "Rejected"
          ) {
            statusMatch =
              String(
                item?.approvalStatus ||
                  ""
              ).toLowerCase() ===
              "rejected";
          }

          if (
            statusFilter ===
            "Closed"
          ) {
            statusMatch =
              String(
                item?.status || ""
              ).toLowerCase() ===
              "closed";
          }

          return (
            searchMatch &&
            statusMatch
          );
        }
      );
    }, [
      internships,
      search,
      statusFilter,
    ]);

  if (loading) {
    return <InternshipsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiBriefcase
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Recruiter Workspace
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                My Internships
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Manage every internship you have posted, monitor
                performance and keep your hiring pipeline moving.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  loadInternships(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
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

              <Link
                to="/recruiter/internships/create"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiPlus />
                Post Internship
              </Link>
            </div>
          </div>
        </section>

        {/* Alerts */}
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

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Internships"
            value={stats.total}
            icon={<FiBriefcase size={20} />}
            tone="gold"
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={<FiCheckCircle size={20} />}
            tone="green"
          />

          <StatCard
            label="Pending Approval"
            value={stats.pending}
            icon={<FiClock size={20} />}
            tone="amber"
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<FiXCircle size={20} />}
            tone="red"
          />
        </div>

        {/* Performance snapshot */}
        <div className="grid gap-4 md:grid-cols-2">
          <PerformanceCard
            label="Total Applicants"
            value={stats.totalApplicants}
            icon={<FiUsers size={20} />}
            description="Across all your internship posts"
            tone="blue"
          />

          <PerformanceCard
            label="Total Views"
            value={stats.totalViews}
            icon={<FiEye size={20} />}
            description="Combined internship visibility"
            tone="purple"
          />
        </div>

        {/* Filters */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="relative w-full xl:max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search title, company, category or location..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Active",
                "Approved",
                "Pending",
                "Rejected",
                "Closed",
              ].map((filter) => {
                const active =
                  statusFilter ===
                  filter;

                return (
                  <button
                    key={filter}
                    onClick={() =>
                      setStatusFilter(
                        filter
                      )
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                      active
                        ? "text-black shadow-sm"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor:
                              GOLD,
                          }
                        : undefined
                    }
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* List */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Internship Portfolio
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {statusFilter === "All"
                  ? "All Internships"
                  : `${statusFilter} Internships`}
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              Showing{" "}
              {filteredInternships.length}{" "}
              of{" "}
              {internships.length}
            </p>
          </div>

          {filteredInternships.length ===
          0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                statusFilter !==
                  "All"
              }
              onReset={() => {
                setSearch("");
                setStatusFilter(
                  "All"
                );
              }}
            />
          ) : (
            <div className="grid gap-5">
              {filteredInternships.map(
                (item) => (
                  <InternshipCard
                    key={item?._id}
                    item={item}
                    deletingId={
                      deletingId
                    }
                    onDelete={
                      remove
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const InternshipCard = ({
  item,
  deletingId,
  onDelete,
}) => {
  const status =
    item?.status ||
    "Open";

  const approval =
    item?.approvalStatus ||
    "Pending";

  const applicants =
    item?.applicants ??
    item?.applicationCount ??
    item?.applications
      ?.length ??
    0;

  const views =
    item?.views || 0;

  const banner =
    getAssetUrl(
      item?.internshipImage ||
        item?.image ||
        item?.banner
    );

  const isDeleting =
    deletingId === item?._id;

  const approvalClass =
    String(approval)
      .toLowerCase() ===
    "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : String(approval)
          .toLowerCase() ===
        "rejected"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  const statusClass =
    String(status)
      .toLowerCase() ===
    "closed"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-[#FCFCFA] transition hover:border-gray-200 hover:bg-white hover:shadow-lg">
      <div className="grid lg:grid-cols-[280px_1fr]">

        {/* Banner */}
        <div className="relative min-h-[210px] overflow-hidden bg-gray-100">
          {banner ? (
            <img
              src={banner}
              alt={
                item?.title ||
                "Internship"
              }
              className="h-full min-h-[210px] w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[210px] items-center justify-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                <FiBriefcase
                  size={28}
                />
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${approvalClass}`}
            >
              {approval}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-gray-950 sm:text-2xl">
                  {item?.title ||
                    "Untitled Internship"}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}
                >
                  {status}
                </span>
              </div>

              <p className="mt-1 text-sm font-bold"
                style={{
                  color: GOLD,
                }}
              >
                {item?.company ||
                  "Company"}
              </p>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                {item?.description ||
                  "No internship description available."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Link
                to={`/recruiter/internships/edit/${item?._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37] hover:text-black"
              >
                <FiEdit2 />
                Edit
              </Link>

              {item?._id && (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      item._id
                    )
                  }
                  disabled={
                    isDeleting
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  <FiTrash2 />

                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetaItem
              icon={<FiMapPin />}
              label="Location"
              value={
                item?.location ||
                "Remote"
              }
            />

            <MetaItem
              icon={<FiClock />}
              label="Duration"
              value={
                item?.duration ||
                "—"
              }
            />

            <MetaItem
              icon={<FiUsers />}
              label="Applicants"
              value={applicants}
            />

            <MetaItem
              icon={<FiEye />}
              label="Views"
              value={views}
            />
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
              {item?.category && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5">
                  {item.category}
                </span>
              )}

              {item?.workMode && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5">
                  {item.workMode}
                </span>
              )}

              {item?.stipend && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5">
                  {item.stipend}
                </span>
              )}

              {item?.lastDate && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
                  <FiCalendar />
                  {formatDate(
                    item.lastDate
                  )}
                </span>
              )}
            </div>

            <Link
              to="/recruiter/applications"
              className="inline-flex items-center gap-2 text-sm font-black text-gray-700 hover:text-black"
            >
              View Applications
              <FiExternalLink />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

const MetaItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-[10px] font-black uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-gray-950">
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

const PerformanceCard = ({
  label,
  value,
  icon,
  description,
  tone,
}) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            tones[tone]
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-black text-gray-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
        style={{
          backgroundColor:
            GOLD,
        }}
      >
        <FiBriefcase size={28} />
      </div>

      <h3 className="mt-5 text-2xl font-black text-gray-950">
        {hasFilters
          ? "No Matching Internships"
          : "No Internships Posted"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first internship opportunity to start receiving student applications."}
      </p>

      {hasFilters ? (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-black"
          style={{
            backgroundColor:
              GOLD,
          }}
        >
          Clear Filters
        </button>
      ) : (
        <Link
          to="/recruiter/internships/create"
          className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
          style={{
            backgroundColor:
              GOLD,
          }}
        >
          <FiPlus />
          Post Internship
        </Link>
      )}
    </div>
  );
};

const InternshipsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[30px] bg-gray-900" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 rounded-3xl bg-white"
              />
            )
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-28 rounded-3xl bg-white" />
          <div className="h-28 rounded-3xl bg-white" />
        </div>

        <div className="h-20 rounded-3xl bg-white" />

        <div className="space-y-5">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-white"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
};

const formatDate = (
  value
) => {
  if (!value) return "—";

  const date = new Date(
    value
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default Internships;