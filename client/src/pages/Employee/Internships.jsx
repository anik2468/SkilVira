import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import {
  FiBriefcase,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiTag,
  FiMonitor,
  FiArrowUpRight,
  FiMoreVertical,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data } = await api.get(
        "/employee/internships/pending"
      );

      setInternships(
        Array.isArray(data?.internships)
          ? data.internships
          : []
      );
    } catch (err) {
      console.error(
        "Load pending internships error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load pending internships."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const approve = async (id) => {
    const confirmed = window.confirm(
      "Approve this internship?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`approve-${id}`);
      setError("");

      await api.put(
        `/employee/internships/approve/${id}`
      );

      await loadInternships(true);
    } catch (err) {
      console.error(
        "Approve internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve internship."
      );
    } finally {
      setActionLoading("");
    }
  };

  const reject = async (id) => {
    const confirmed = window.confirm(
      "Reject this internship?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`reject-${id}`);
      setError("");

      await api.put(
        `/employee/internships/reject/${id}`
      );

      await loadInternships(true);
    } catch (err) {
      console.error(
        "Reject internship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject internship."
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return internships;
    }

    return internships.filter((item) => {
      const title =
        item?.title?.toLowerCase() || "";

      const company =
        typeof item?.company === "string"
          ? item.company.toLowerCase()
          : item?.company?.name?.toLowerCase() || "";

      const recruiter =
        item?.recruiter?.name?.toLowerCase() || "";

      const category =
        item?.category?.toLowerCase() || "";

      return (
        title.includes(query) ||
        company.includes(query) ||
        recruiter.includes(query) ||
        category.includes(query)
      );
    });
  }, [internships, search]);

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiBriefcase size={13} />
              Internship Review
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Internship Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              Review recruiter-submitted internships, verify the opportunity
              details and publish approved opportunities on SkilVira.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => loadInternships(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <Link
              to="/employee/internships/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32]"
            >
              <FiPlus size={18} />
              Create Internship
            </Link>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Queue summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Pending Internships"
          value={internships.length}
          icon={<FiClock size={21} />}
        />

        <SummaryCard
          title="Search Results"
          value={filteredInternships.length}
          icon={<FiSearch size={21} />}
        />

        <SummaryCard
          title="Review Queue"
          value={
            internships.length > 0
              ? "Active"
              : "Clear"
          }
          icon={<FiCheckCircle size={21} />}
        />
      </div>

      {/* Pending section */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pending Recruiter Internships
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Opportunities waiting for employee verification.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search title, company, recruiter..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredInternships.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {internships.length}
            </span>{" "}
            pending internships
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredInternships.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search.trim())}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredInternships.map(
              (item) => {
                const approving =
                  actionLoading ===
                  `approve-${item._id}`;

                const rejecting =
                  actionLoading ===
                  `reject-${item._id}`;

                const busy =
                  approving || rejecting;

                const companyName =
                  typeof item?.company === "string"
                    ? item.company
                    : item?.company?.name ||
                      "Company";

                return (
                  <InternshipCard
                    key={item._id}
                    item={item}
                    companyName={companyName}
                    busy={busy}
                    approving={approving}
                    rejecting={rejecting}
                    onApprove={() =>
                      approve(item._id)
                    }
                    onReject={() =>
                      reject(item._id)
                    }
                  />
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
};


// =====================================================
// INTERNSHIP CARD
// =====================================================

const InternshipCard = ({
  item,
  companyName,
  busy,
  approving,
  rejecting,
  onApprove,
  onReject,
}) => {
  return (
    <article className="p-5 transition hover:bg-gray-50/70 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Main details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiBriefcase size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {item?.title ||
                    "Untitled Internship"}
                </h3>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                  <FiClock size={11} />
                  Pending
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-gray-600">
                {companyName}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Internship ID:{" "}
                {item?._id || "N/A"}
              </p>
            </div>

            <FiMoreVertical
              size={18}
              className="hidden shrink-0 text-gray-300 sm:block"
            />
          </div>

          {/* Metadata */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetaItem
              icon={<FiUser size={15} />}
              label="Recruiter"
              value={
                item?.recruiter?.name ||
                "N/A"
              }
            />

            <MetaItem
              icon={<FiMonitor size={15} />}
              label="Work Mode"
              value={
                item?.workMode ||
                "Online"
              }
            />

            <MetaItem
              icon={<FiTag size={15} />}
              label="Category"
              value={
                item?.category ||
                "Not specified"
              }
            />

            <MetaItem
              icon={<FiBriefcase size={15} />}
              label="Company"
              value={companyName}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
          <button
            type="button"
            disabled={busy}
            onClick={onApprove}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheckCircle size={17} />

            {approving
              ? "Approving..."
              : "Approve"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onReject}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiXCircle size={17} />

            {rejecting
              ? "Rejecting..."
              : "Reject"}
          </button>
        </div>
      </div>
    </article>
  );
};


// =====================================================
// META ITEM
// =====================================================

const MetaItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <span className="text-[#D4AF37]">
          {icon}
        </span>

        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiArrowUpRight
          size={17}
          className="text-gray-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// LOADING
// =====================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
          <FiRefreshCw
            size={18}
            className="text-[#D4AF37]"
          />
        </div>

        <p className="mt-4 font-semibold text-gray-900">
          Loading internships...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching pending recruiter submissions.
        </p>
      </div>
    </div>
  );
};


// =====================================================
// EMPTY
// =====================================================

const EmptyState = ({
  hasSearch,
}) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <FiCheckCircle size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          {hasSearch
            ? "No matching internships"
            : "Review queue is clear"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another title, company, recruiter or category."
            : "There are currently no recruiter-submitted internships waiting for approval."}
        </p>
      </div>
    </div>
  );
};

export default Internships;