import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiEye,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiXCircle,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";

import {
  getRecruiterInternships,
  deleteInternship,
} from "../../services/internshipService";

import { useAuth } from "../../context/AuthContext";

const GOLD = "#D4AF37";

const FILTERS = [
  "All",
  "Active",
  "Approved",
  "Pending",
  "Rejected",
  "Closed",
];

const ManageInternships = () => {
  const { user } = useAuth();
  const recruiterId = user?.id || user?._id;
  const navigate = useNavigate();

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

  const [filter, setFilter] =
    useState("All");

  const [selectedId, setSelectedId] =
    useState(null);

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

      const response =
        await getRecruiterInternships(recruiterId);

      const list =
        response?.internships ||
        response?.data?.internships ||
        (Array.isArray(response)
          ? response
          : []);

      setInternships(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "Manage internships load error:",
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

  const removeInternship = async (
    internshipId
  ) => {
    if (!internshipId) return;

    const internship =
      internships.find(
        (item) =>
          item?._id === internshipId
      );

    const title =
      internship?.title ||
      "this internship";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${title}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(
        internshipId
      );

      setError("");
      setSuccess("");

      await deleteInternship(
        internshipId
      );

      setInternships((prev) =>
        prev.filter(
          (item) =>
            item?._id !==
            internshipId
        )
      );

      if (
        selectedId ===
        internshipId
      ) {
        setSelectedId(null);
      }

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
    const active =
      internships.filter(
        (item) =>
          !isClosed(item) &&
          !isRejected(item)
      ).length;

    const approved =
      internships.filter(
        (item) =>
          normalize(
            item?.approvalStatus
          ) === "approved"
      ).length;

    const pending =
      internships.filter(
        (item) =>
          normalize(
            item?.approvalStatus
          ) === "pending"
      ).length;

    const rejected =
      internships.filter(
        (item) =>
          normalize(
            item?.approvalStatus
          ) === "rejected"
      ).length;

    const closed =
      internships.filter(
        (item) =>
          isClosed(item)
      ).length;

    const applicants =
      internships.reduce(
        (sum, item) =>
          sum +
          Number(
            item?.applicants ??
              item?.applicationCount ??
              item?.applications
                ?.length ??
              0
          ),
        0
      );

    const views =
      internships.reduce(
        (sum, item) =>
          sum +
          Number(
            item?.views || 0
          ),
        0
      );

    return {
      total:
        internships.length,
      active,
      approved,
      pending,
      rejected,
      closed,
      applicants,
      views,
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
            normalize(
              item?.approvalStatus
            );

          const status =
            normalize(
              item?.status
            );

          const matchesSearch =
            !query ||
            title.includes(query) ||
            company.includes(query) ||
            category.includes(query) ||
            location.includes(query);

          let matchesFilter = true;

          if (
            filter === "Active"
          ) {
            matchesFilter =
              !isClosed(item) &&
              !isRejected(item);
          }

          if (
            filter === "Approved"
          ) {
            matchesFilter =
              approval ===
              "approved";
          }

          if (
            filter === "Pending"
          ) {
            matchesFilter =
              approval ===
              "pending";
          }

          if (
            filter === "Rejected"
          ) {
            matchesFilter =
              approval ===
              "rejected";
          }

          if (
            filter === "Closed"
          ) {
            matchesFilter =
              status === "closed";
          }

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      internships,
      search,
      filter,
    ]);

  const selectedInternship =
    internships.find(
      (item) =>
        item?._id === selectedId
    );

  if (loading) {
    return (
      <ManageInternshipsSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
              >
                <FiArrowLeft />
                Back
              </button>

              <div className="mb-3 flex items-center gap-2">
                <FiBriefcase
                  size={15}
                  style={{
                    color: GOLD,
                  }}
                />

                <span
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Recruiter Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Manage Internships
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Control your internship portfolio, review approval
                status and manage every published opportunity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
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
                  backgroundColor:
                    GOLD,
                }}
              >
                <FiPlus />
                Post Internship
              </Link>
            </div>
          </div>
        </section>

        {/* Messages */}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<FiBriefcase />}
            tone="gold"
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <StatCard
            label="Approved"
            value={stats.approved}
            icon={<FiCheckCircle />}
            tone="blue"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<FiClock />}
            tone="amber"
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<FiXCircle />}
            tone="red"
          />

          <StatCard
            label="Closed"
            value={stats.closed}
            icon={<FiXCircle />}
            tone="gray"
          />
        </div>

        {/* Portfolio metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            label="Total Applicants"
            value={stats.applicants}
            description="Across all your internship posts"
            icon={<FiUsers />}
            tone="blue"
          />

          <MetricCard
            label="Total Views"
            value={stats.views}
            description="Combined visibility of your posts"
            icon={<FiEye />}
            tone="purple"
          />
        </div>

        {/* Search & Filter */}
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
                placeholder="Search internship, company, category or location..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map(
                (item) => {
                  const active =
                    filter === item;

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() =>
                        setFilter(item)
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
                      {item}
                    </button>
                  );
                }
              )}
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
                Opportunity Management
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {filter === "All"
                  ? "All Internships"
                  : `${filter} Internships`}
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              {filteredInternships.length} result
              {filteredInternships.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          {filteredInternships.length ===
          0 ? (
            <EmptyState
              filtered={
                Boolean(
                  search.trim()
                ) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredInternships.map(
                (item) => (
                  <ManageCard
                    key={item?._id}
                    internship={item}
                    deletingId={
                      deletingId
                    }
                    onDelete={
                      removeInternship
                    }
                    onView={() =>
                      setSelectedId(
                        item?._id
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {selectedInternship && (
        <DetailsModal
          internship={
            selectedInternship
          }
          onClose={() =>
            setSelectedId(null)
          }
          deletingId={deletingId}
          onDelete={
            removeInternship
          }
        />
      )}
    </div>
  );
};

const ManageCard = ({
  internship,
  deletingId,
  onDelete,
  onView,
}) => {
  const title =
    internship?.title ||
    "Untitled Internship";

  const company =
    internship?.company ||
    "Company";

  const applicants =
    internship?.applicants ??
    internship?.applicationCount ??
    internship?.applications
      ?.length ??
    0;

  const views =
    internship?.views || 0;

  const approval =
    internship?.approvalStatus ||
    "Pending";

  const status =
    internship?.status ||
    "Open";

  const image =
    getAssetUrl(
      internship?.internshipImage ||
        internship?.image ||
        internship?.banner
    );

  const approvalClass =
    normalize(approval) ===
    "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : normalize(approval) ===
        "rejected"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  const statusClass =
    normalize(status) ===
    "closed"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const deleting =
    deletingId ===
    internship?._id;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-[#FCFCFA] transition hover:border-gray-200 hover:bg-white hover:shadow-lg">
      <div className="grid lg:grid-cols-[260px_1fr]">

        {/* Image */}
        <div className="relative min-h-[210px] bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={title}
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

            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h3 className="text-xl font-black text-gray-950 sm:text-2xl">
                {title}
              </h3>

              <p
                className="mt-1 text-sm font-bold"
                style={{
                  color: GOLD,
                }}
              >
                {company}
              </p>

              {internship?.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                  {internship.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onView}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-gray-300 hover:text-black"
              >
                <FiEye />
                Details
              </button>

              <Link
                to={`/recruiter/internships/edit/${internship?._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/5 px-4 py-2.5 text-xs font-black text-[#8D7414] hover:bg-[#D4AF37]/10"
              >
                <FiEdit2 />
                Edit
              </Link>

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  onDelete(
                    internship?._id
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                <FiTrash2 />
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetaItem
              icon={<FiMapPin />}
              label="Location"
              value={
                internship?.location ||
                "Remote"
              }
            />

            <MetaItem
              icon={<FiClock />}
              label="Duration"
              value={
                internship?.duration ||
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

          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {internship?.category && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {internship.category}
                </span>
              )}

              {internship?.workMode && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {internship.workMode}
                </span>
              )}

              {internship?.stipend && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {internship.stipend}
                </span>
              )}
            </div>

            <Link
              to="/recruiter/applications"
              className="inline-flex items-center gap-2 text-sm font-black text-gray-700 hover:text-black"
            >
              Manage Applications
              <FiExternalLink />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaItem = ({
  icon,
  label,
  value,
}) => (
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

const StatCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
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
            tones[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  description,
  icon,
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

const DetailsModal = ({
  internship,
  onClose,
  deletingId,
  onDelete,
}) => {
  const title =
    internship?.title ||
    "Untitled Internship";

  const image =
    getAssetUrl(
      internship?.internshipImage ||
        internship?.image ||
        internship?.banner
    );

  const applicants =
    internship?.applicants ??
    internship?.applicationCount ??
    internship?.applications
      ?.length ??
    0;

  const approval =
    internship?.approvalStatus ||
    "Pending";

  const status =
    internship?.status ||
    "Open";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="bg-black px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiBriefcase
                    size={27}
                  />
                </div>
              )}

              <div className="min-w-0">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Internship Details
                </p>

                <h2 className="mt-1 truncate text-2xl font-black">
                  {title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
              Approval: {approval}
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              Status: {status}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBox
              label="Company"
              value={
                internship?.company ||
                "—"
              }
            />

            <InfoBox
              label="Category"
              value={
                internship?.category ||
                "—"
              }
            />

            <InfoBox
              label="Work Mode"
              value={
                internship?.workMode ||
                "—"
              }
            />

            <InfoBox
              label="Location"
              value={
                internship?.location ||
                "—"
              }
            />

            <InfoBox
              label="Duration"
              value={
                internship?.duration ||
                "—"
              }
            />

            <InfoBox
              label="Stipend"
              value={
                internship?.stipend ||
                "—"
              }
            />

            <InfoBox
              label="Openings"
              value={
                internship?.openings ??
                "—"
              }
            />

            <InfoBox
              label="Applicants"
              value={applicants}
            />

            <InfoBox
              label="Views"
              value={
                internship?.views ||
                0
              }
            />
          </div>

          {internship?.description && (
            <ContentBox
              title="Description"
              content={
                internship.description
              }
            />
          )}

          {internship?.responsibilities && (
            <ContentBox
              title="Responsibilities"
              content={
                internship.responsibilities
              }
            />
          )}

          {internship?.requirements && (
            <ContentBox
              title="Requirements"
              content={
                internship.requirements
              }
            />
          )}

          {internship?.perks && (
            <ContentBox
              title="Perks & Benefits"
              content={
                internship.perks
              }
            />
          )}

          {Array.isArray(
            internship?.skills
          ) &&
            internship.skills
              .length > 0 && (
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.16em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {internship.skills.map(
                    (skill, index) => (
                      <span
                        key={`${String(
                          skill
                        )}-${index}`}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700"
                      >
                        {typeof skill ===
                        "string"
                          ? skill
                          : skill?.name ||
                            skill?.title ||
                            "Skill"}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={
                deletingId ===
                internship?._id
              }
              onClick={() =>
                onDelete(
                  internship?._id
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <FiTrash2 />

              {deletingId ===
              internship?._id
                ? "Deleting..."
                : "Delete"}
            </button>

            <Link
              to={`/recruiter/internships/edit/${internship?._id}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiEdit2 />
              Edit Internship
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
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

const ContentBox = ({
  title,
  content,
}) => (
  <div>
    <p
      className="text-xs font-black uppercase tracking-[0.16em]"
      style={{
        color: GOLD,
      }}
    >
      {title}
    </p>

    <div className="mt-2 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
      <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
        {Array.isArray(content)
          ? content.join("\n")
          : content}
      </p>
    </div>
  </div>
);

const EmptyState = ({
  filtered,
  clear,
}) => (
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
      {filtered
        ? "No Matching Internships"
        : "No Internships Available"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {filtered
        ? "Try changing your search or filter."
        : "Your internship portfolio will appear here after you create an opportunity."}
    </p>

    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {filtered && (
        <button
          type="button"
          onClick={clear}
          className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
        >
          Clear Filters
        </button>
      )}

      <Link
        to="/recruiter/internships/create"
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
        style={{
          backgroundColor:
            GOLD,
        }}
      >
        <FiPlus />
        Post Internship
      </Link>
    </div>
  </div>
);

const ManageInternshipsSkeleton =
  () => (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[30px] bg-gray-900" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {[
            1, 2, 3, 4, 5, 6,
          ].map((item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-28 rounded-3xl bg-white" />
          <div className="h-28 rounded-3xl bg-white" />
        </div>

        <div className="h-20 rounded-3xl bg-white" />

        <div className="space-y-4">
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

const normalize = (
  value
) =>
  String(
    value || ""
  )
    .trim()
    .toLowerCase();

const isClosed = (
  internship
) =>
  normalize(
    internship?.status
  ) === "closed";

const isRejected = (
  internship
) =>
  normalize(
    internship?.approvalStatus
  ) === "rejected";

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

export default ManageInternships;