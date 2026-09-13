import { useEffect, useMemo, useState } from "react";
import {
  FiCreditCard,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiMail,
  FiBriefcase,
  FiEye,
  FiMoreVertical,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = "http://localhost:5000";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * Employee payment queue.
       * This keeps the page compatible with the current
       * manual-payment-first workflow.
       */
      const response = await api.get(
        "/payments/pending"
      );

      const data = response?.data || {};

      setPayments(
        Array.isArray(data?.payments)
          ? data.payments
          : []
      );
    } catch (err) {
      console.error(
        "Load employee payments error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment records."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const approvePayment = async (id) => {
    const confirmed = window.confirm(
      "Approve this payment?\n\nApproving the payment may activate the related enrollment/application."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`approve-${id}`);
      setError("");

      await api.put(
        `/payments/approve/${id}`
      );

      await loadPayments(true);
    } catch (err) {
      console.error(
        "Approve payment error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve payment."
      );
    } finally {
      setActionLoading("");
    }
  };

  const rejectPayment = async (id) => {
    const confirmed = window.confirm(
      "Reject this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`reject-${id}`);
      setError("");

      await api.put(
        `/payments/reject/${id}`
      );

      await loadPayments(true);
    } catch (err) {
      console.error(
        "Reject payment error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject payment."
      );
    } finally {
      setActionLoading("");
    }
  };

  const getStatus = (payment) => {
    return String(
      payment?.status ||
        payment?.paymentStatus ||
        "pending"
    ).toLowerCase();
  };

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const student =
        payment?.student?.name?.toLowerCase() ||
        payment?.user?.name?.toLowerCase() ||
        "";

      const email =
        payment?.student?.email?.toLowerCase() ||
        payment?.user?.email?.toLowerCase() ||
        "";

      const transactionId =
        String(
          payment?.transactionId ||
            payment?.transactionID ||
            payment?.utr ||
            payment?.reference ||
            ""
        ).toLowerCase();

      const type =
        String(
          payment?.type ||
            payment?.paymentType ||
            ""
        ).toLowerCase();

      const status = getStatus(payment);

      const matchesSearch =
        !query ||
        student.includes(query) ||
        email.includes(query) ||
        transactionId.includes(query) ||
        type.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [payments, search, statusFilter]);

  const pendingCount = payments.filter(
    (payment) =>
      getStatus(payment) ===
      "pending"
  ).length;

  const approvedCount = payments.filter(
    (payment) =>
      getStatus(payment) ===
      "approved"
  ).length;

  const rejectedCount = payments.filter(
    (payment) =>
      getStatus(payment) ===
      "rejected"
  ).length;

  const totalAmount = payments.reduce(
    (sum, payment) => {
      const amount = Number(
        payment?.amount ||
          payment?.price ||
          payment?.paidAmount ||
          0
      );

      return sum + (Number.isFinite(amount) ? amount : 0);
    },
    0
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiCreditCard size={13} />
              Payment Verification
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Payment Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Review manual payment submissions, verify transaction details
              and approve valid payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadPayments(true)}
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
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Payments"
          value={payments.length}
          icon={<FiCreditCard size={21} />}
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<FiClock size={21} />}
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<FiCheckCircle size={21} />}
        />

        <StatCard
          title="Submitted Amount"
          value={`₹${totalAmount.toLocaleString(
            "en-IN"
          )}`}
          icon={<FiBriefcase size={21} />}
        />
      </div>

      {/* Queue */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Toolbar */}
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Payment Queue
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review and process student payment submissions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <FiSearch
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search student, email or transaction..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
                />
              </div>

              <div className="flex rounded-xl bg-gray-100 p-1">
                <FilterButton
                  active={
                    statusFilter === "all"
                  }
                  onClick={() =>
                    setStatusFilter("all")
                  }
                >
                  All
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter ===
                    "pending"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "pending"
                    )
                  }
                >
                  Pending
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter ===
                    "approved"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "approved"
                    )
                  }
                >
                  Approved
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter ===
                    "rejected"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "rejected"
                    )
                  }
                >
                  Rejected
                </FilterButton>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              Showing{" "}
              <strong className="text-gray-900">
                {filteredPayments.length}
              </strong>
            </span>

            <span>
              Pending{" "}
              <strong className="text-amber-600">
                {pendingCount}
              </strong>
            </span>

            <span>
              Approved{" "}
              <strong className="text-green-600">
                {approvedCount}
              </strong>
            </span>

            <span>
              Rejected{" "}
              <strong className="text-red-600">
                {rejectedCount}
              </strong>
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search.trim())}
            hasFilter={
              statusFilter !== "all"
            }
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map(
                    (payment) => {
                      const id =
                        payment?._id;

                      const status =
                        getStatus(
                          payment
                        );

                      const approving =
                        actionLoading ===
                        `approve-${id}`;

                      const rejecting =
                        actionLoading ===
                        `reject-${id}`;

                      const busy =
                        approving ||
                        rejecting;

                      return (
                        <tr
                          key={id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <StudentAvatar
                                payment={
                                  payment
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {getStudentName(
                                    payment
                                  )}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <FiMail
                                    size={12}
                                  />
                                  {getStudentEmail(
                                    payment
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-bold text-gray-900">
                              ₹
                              {Number(
                                payment?.amount ||
                                  payment?.price ||
                                  payment?.paidAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <p className="mt-1 text-xs capitalize text-gray-400">
                              {payment?.type ||
                                payment?.paymentType ||
                                "Payment"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="break-all font-mono text-sm font-semibold text-gray-700">
                              {payment?.transactionId ||
                                payment?.transactionID ||
                                payment?.utr ||
                                payment?.reference ||
                                "Not available"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={status}
                            />
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPayment(
                                    payment
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                              >
                                <FiEye
                                  size={14}
                                />
                                View
                              </button>

                              {status ===
                                "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      approvePayment(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiCheckCircle
                                      size={14}
                                    />

                                    {approving
                                      ? "Approving..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      rejectPayment(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiXCircle
                                      size={14}
                                    />

                                    {rejecting
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredPayments.map(
                (payment) => {
                  const id =
                    payment?._id;

                  const status =
                    getStatus(
                      payment
                    );

                  const approving =
                    actionLoading ===
                    `approve-${id}`;

                  const rejecting =
                    actionLoading ===
                    `reject-${id}`;

                  const busy =
                    approving ||
                    rejecting;

                  return (
                    <div
                      key={id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <StudentAvatar
                          payment={payment}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {getStudentName(
                                  payment
                                )}
                              </h3>

                              <p className="mt-1 break-all text-sm text-gray-500">
                                {getStudentEmail(
                                  payment
                                )}
                              </p>
                            </div>

                            <FiMoreVertical
                              size={18}
                              className="shrink-0 text-gray-300"
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge
                              status={status}
                            />

                            <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#A98716]">
                              ₹
                              {Number(
                                payment?.amount ||
                                  payment?.price ||
                                  payment?.paidAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Transaction ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-800">
                          {payment?.transactionId ||
                            payment?.transactionID ||
                            payment?.utr ||
                            payment?.reference ||
                            "Not available"}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                        >
                          <FiEye
                            size={15}
                          />
                          View Details
                        </button>

                        {status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                approvePayment(
                                  id
                                )
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
                                rejectPayment(
                                  id
                                )
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
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>

      {/* Rejected summary */}
      {rejectedCount > 0 && (
        <section className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <FiXCircle size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-red-800">
                Rejected Payments
              </p>

              <p className="mt-1 text-xs text-red-600">
                {rejectedCount} payment
                {rejectedCount === 1
                  ? ""
                  : "s"} currently marked as rejected.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() =>
            setSelectedPayment(null)
          }
        />
      )}
    </div>
  );
};


// =====================================================
// HELPERS
// =====================================================

const getStudentName = (payment) => {
  return (
    payment?.student?.name ||
    payment?.user?.name ||
    payment?.name ||
    "Student"
  );
};

const getStudentEmail = (payment) => {
  return (
    payment?.student?.email ||
    payment?.user?.email ||
    payment?.email ||
    "No email"
  );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
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
// FILTER BUTTON
// =====================================================

const FilterButton = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-white text-[#D4AF37] shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}) => {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
        <FiCheckCircle size={13} />
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <FiXCircle size={13} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <FiClock size={13} />
      Pending
    </span>
  );
};


// =====================================================
// AVATAR
// =====================================================

const StudentAvatar = ({
  payment,
}) => {
  const avatar =
    payment?.student?.avatar ||
    payment?.user?.avatar ||
    payment?.avatar;

  const name = getStudentName(
    payment
  );

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_BASE}${avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=D4AF37&color=fff&size=120`;

  return (
    <img
      src={avatarUrl}
      alt={name}
      className="h-12 w-12 shrink-0 rounded-full border-2 border-white bg-gray-100 object-cover shadow-sm"
      onError={(event) => {
        event.currentTarget.src =
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
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
          Loading payments...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching payment submissions.
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
  hasFilter,
}) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <FiCreditCard size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No payments found
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another student, email or transaction ID."
            : hasFilter
              ? "No payments match the selected status."
              : "No payment submissions are available yet."}
        </p>
      </div>
    </div>
  );
};


// =====================================================
// DETAILS MODAL
// =====================================================

const PaymentDetailsModal = ({
  payment,
  onClose,
}) => {
  const status =
    String(
      payment?.status ||
        payment?.paymentStatus ||
        "pending"
    ).toLowerCase();

  const amount = Number(
    payment?.amount ||
      payment?.price ||
      payment?.paidAmount ||
      0
  );

  const screenshot =
    payment?.paymentScreenshot ||
    payment?.screenshot ||
    payment?.proof ||
    payment?.receipt;

  const screenshotUrl = screenshot
    ? screenshot.startsWith("http")
      ? screenshot
      : `${API_BASE}${screenshot}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review submitted payment information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Student"
              value={getStudentName(
                payment
              )}
              icon={<FiUser size={16} />}
            />

            <DetailItem
              label="Email"
              value={getStudentEmail(
                payment
              )}
              icon={<FiMail size={16} />}
            />

            <DetailItem
              label="Amount"
              value={`₹${amount.toLocaleString(
                "en-IN"
              )}`}
              icon={
                <FiCreditCard
                  size={16}
                />
              }
            />

            <DetailItem
              label="Type"
              value={
                payment?.type ||
                payment?.paymentType ||
                "Payment"
              }
              icon={
                <FiBriefcase
                  size={16}
                />
              }
            />

            <DetailItem
              label="Transaction ID"
              value={
                payment?.transactionId ||
                payment?.transactionID ||
                payment?.utr ||
                payment?.reference ||
                "Not available"
              }
              icon={
                <FiCreditCard
                  size={16}
                />
              }
            />

            <DetailItem
              label="Status"
              value={
                status
                  .charAt(0)
                  .toUpperCase() +
                status.slice(1)
              }
              icon={
                status ===
                "approved" ? (
                  <FiCheckCircle
                    size={16}
                  />
                ) : status ===
                  "rejected" ? (
                  <FiXCircle
                    size={16}
                  />
                ) : (
                  <FiClock
                    size={16}
                  />
                )
              }
            />
          </div>

          {screenshotUrl && (
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-800">
                Payment Screenshot
              </p>

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                <img
                  src={screenshotUrl}
                  alt="Payment proof"
                  className="max-h-[420px] w-full object-contain"
                />
              </div>
            </div>
          )}

          {payment?.note && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Note
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {payment.note}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default Payments;