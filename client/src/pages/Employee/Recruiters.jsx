import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiClock,
  FiShield,
  FiMoreVertical,
} from "react-icons/fi";

const API_BASE = "http://localhost:5000";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecruiters();
  }, []);

  const loadRecruiters = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data } = await api.get(
        "/employee/recruiters/pending"
      );

      setRecruiters(
        Array.isArray(data?.recruiters)
          ? data.recruiters
          : []
      );
    } catch (err) {
      console.error(
        "Load pending recruiters error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load pending recruiters."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const approve = async (id) => {
    const confirmed = window.confirm(
      "Approve this recruiter account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`approve-${id}`);
      setError("");

      await api.put(
        `/employee/recruiters/approve/${id}`
      );

      await loadRecruiters(true);
    } catch (err) {
      console.error(
        "Approve recruiter error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve recruiter."
      );
    } finally {
      setActionLoading("");
    }
  };

  const reject = async (id) => {
    const confirmed = window.confirm(
      "Reject this recruiter account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`reject-${id}`);
      setError("");

      await api.put(
        `/employee/recruiters/reject/${id}`
      );

      await loadRecruiters(true);
    } catch (err) {
      console.error(
        "Reject recruiter error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject recruiter."
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredRecruiters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return recruiters;
    }

    return recruiters.filter((item) => {
      const name =
        item?.name?.toLowerCase() || "";

      const email =
        item?.email?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query)
      );
    });
  }, [recruiters, search]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              Recruiter Verification
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Recruiter Approval
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Review recruiter registrations and make sure only verified
              accounts get access to the SkilVira platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadRecruiters(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
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

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiXCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Pending Recruiters"
          value={recruiters.length}
          icon={<FiUsers size={21} />}
        />

        <SummaryCard
          title="Search Results"
          value={filteredRecruiters.length}
          icon={<FiSearch size={21} />}
        />

        <SummaryCard
          title="Review Queue"
          value={
            recruiters.length > 0
              ? "Active"
              : "Clear"
          }
          icon={<FiClock size={21} />}
        />
      </div>

      {/* Main Panel */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Toolbar */}
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pending Accounts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recruiters waiting for employee verification.
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
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredRecruiters.length}
            </span>{" "}
            pending recruiter
            {filteredRecruiters.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredRecruiters.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search.trim())}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Recruiter
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Review
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecruiters.map(
                    (item) => {
                      const approving =
                        actionLoading ===
                        `approve-${item._id}`;

                      const rejecting =
                        actionLoading ===
                        `reject-${item._id}`;

                      const busy =
                        approving || rejecting;

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <RecruiterAvatar
                                recruiter={
                                  item
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {item?.name ||
                                    "Recruiter"}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Recruiter Account
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiMail
                                size={15}
                                className="shrink-0 text-[#D4AF37]"
                              />

                              <span className="break-all">
                                {item?.email ||
                                  "No email"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Pending Review
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  approve(
                                    item._id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FiCheckCircle
                                  size={15}
                                />

                                {approving
                                  ? "Approving..."
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  reject(
                                    item._id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FiXCircle
                                  size={15}
                                />

                                {rejecting
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredRecruiters.map(
                (item) => {
                  const approving =
                    actionLoading ===
                    `approve-${item._id}`;

                  const rejecting =
                    actionLoading ===
                    `reject-${item._id}`;

                  const busy =
                    approving || rejecting;

                  return (
                    <div
                      key={item._id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <RecruiterAvatar
                          recruiter={
                            item
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {item?.name ||
                                  "Recruiter"}
                              </h3>

                              <p className="mt-1 break-all text-sm text-gray-500">
                                {item?.email ||
                                  "No email"}
                              </p>
                            </div>

                            <FiMoreVertical
                              size={18}
                              className="shrink-0 text-gray-300"
                            />
                          </div>

                          <div className="mt-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                              <FiClock size={13} />
                              Pending Review
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            approve(item._id)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 disabled:opacity-50"
                        >
                          <FiCheckCircle
                            size={15}
                          />

                          {approving
                            ? "Approving..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            reject(item._id)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                        >
                          <FiXCircle
                            size={15}
                          />

                          {rejecting
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>
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

        <FiMoreVertical
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
// AVATAR
// =====================================================

const RecruiterAvatar = ({
  recruiter,
}) => {
  const avatarUrl = recruiter?.avatar
    ? recruiter.avatar.startsWith("http")
      ? recruiter.avatar
      : `${API_BASE}${recruiter.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        recruiter?.name || "Recruiter"
      )}&background=D4AF37&color=fff&size=120`;

  return (
    <img
      src={avatarUrl}
      alt={
        recruiter?.name ||
        "Recruiter"
      }
      className="h-12 w-12 shrink-0 rounded-full border-2 border-white bg-gray-100 object-cover shadow-sm"
      onError={(event) => {
        event.currentTarget.src =
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            recruiter?.name ||
              "Recruiter"
          )}&background=D4AF37&color=fff&size=120`;
      }}
    />
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
          Loading recruiters...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching pending recruiter accounts.
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
            ? "No matching recruiters"
            : "Review queue is clear"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another name or email."
            : "There are currently no recruiter accounts waiting for approval."}
        </p>
      </div>
    </div>
  );
};

export default Recruiters;