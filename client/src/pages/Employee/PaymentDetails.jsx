import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiHash,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiRefreshCw,
  FiAlertCircle,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = API_ORIGIN;

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayment();
  }, [id]);

  const loadPayment = async () => {
    if (!id) {
      setError("Payment ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/payments/${id}`
      );

      const data = response?.data || {};

      setPayment(
        data?.payment ||
          data?.data ||
          data
      );
    } catch (err) {
      console.error(
        "Load payment details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => {
    return String(
      payment?.status ||
        payment?.paymentStatus ||
        "pending"
    ).toLowerCase();
  };

  const status = getStatus();

  const amount = Number(
    payment?.amount ||
      payment?.paidAmount ||
      payment?.price ||
      0
  );

  const studentName =
    payment?.student?.name ||
    payment?.user?.name ||
    payment?.name ||
    "Student";

  const studentEmail =
    payment?.student?.email ||
    payment?.user?.email ||
    payment?.email ||
    "No email";

  const studentPhone =
    payment?.student?.phone ||
    payment?.user?.phone ||
    payment?.phone ||
    "Not available";

  const internshipTitle =
    payment?.internship?.title ||
    payment?.internshipTitle ||
    payment?.course?.title ||
    payment?.title ||
    "Not specified";

  const transactionId =
    payment?.transactionId ||
    payment?.transactionID ||
    payment?.utr ||
    payment?.reference ||
    "Not available";

  const paymentType =
    payment?.type ||
    payment?.paymentType ||
    "Payment";

  const proof =
    payment?.paymentScreenshot ||
    payment?.screenshot ||
    payment?.proof ||
    payment?.receipt;

  const proofUrl = proof
    ? proof.startsWith("http")
      ? proof
      : `${API_BASE}${proof}`
    : null;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
            <FiRefreshCw
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mt-4 font-semibold text-gray-900">
            Loading Payment...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Fetching payment information.
          </p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-6 pb-10">
        <Link
          to="/employee/payments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#D4AF37]"
        >
          <FiArrowLeft size={16} />
          Back to Payments
        </Link>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h2 className="font-bold text-red-800">
                Unable to load payment
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error ||
                  "The requested payment could not be found."}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadPayment}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <FiRefreshCw size={15} />
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/employee/payments"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700"
                >
                  Back to Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <Link
            to="/employee/payments"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to Payments
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
                <FiShield size={13} />
                Payment Verification
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Payment Details
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
                Review the submitted payment information and transaction
                proof before taking any operational action.
              </p>
            </div>

            <StatusBadge
              status={status}
              dark
            />
          </div>
        </div>
      </section>

      {/* Payment summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Payment Amount"
          value={`₹${amount.toLocaleString(
            "en-IN"
          )}`}
          icon={
            <FiCreditCard size={21} />
          }
        />

        <SummaryCard
          label="Payment Type"
          value={paymentType}
          icon={
            <FiBriefcase size={21} />
          }
        />

        <SummaryCard
          label="Status"
          value={capitalize(status)}
          icon={
            status ===
            "approved" ? (
              <FiCheckCircle
                size={21}
              />
            ) : status ===
              "rejected" ? (
              <FiXCircle
                size={21}
              />
            ) : (
              <FiClock
                size={21}
              />
            )
          }
        />

        <SummaryCard
          label="Submitted"
          value={
            payment?.createdAt
              ? formatDate(
                  payment.createdAt
                )
              : "-"
          }
          icon={
            <FiClock size={21} />
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Student */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiUser size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Student Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Account associated with this payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiUser size={23} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {studentName}
                  </h3>

                  <p className="mt-1 flex items-center gap-2 break-all text-sm text-gray-500">
                    <FiMail size={14} />
                    {studentEmail}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <FiPhone size={14} />
                    {studentPhone}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Transaction */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiHash size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Transaction Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Submitted payment reference details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <DetailCard
                label="Transaction ID"
                value={transactionId}
                icon={
                  <FiHash size={16} />
                }
                mono
              />

              <DetailCard
                label="Amount"
                value={`₹${amount.toLocaleString(
                  "en-IN"
                )}`}
                icon={
                  <FiCreditCard size={16} />
                }
              />

              <DetailCard
                label="Payment Type"
                value={paymentType}
                icon={
                  <FiBriefcase
                    size={16}
                  />
                }
              />

              <DetailCard
                label="Submitted On"
                value={
                  payment?.createdAt
                    ? formatDateTime(
                        payment.createdAt
                      )
                    : "-"
                }
                icon={
                  <FiClock size={16} />
                }
              />
            </div>
          </section>

          {/* Related opportunity */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiBriefcase size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Related Opportunity
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Course or internship associated with this payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Opportunity
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {internshipTitle}
                </p>

                {(payment?.internship?.company ||
                  payment?.company) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {payment?.internship?.company ||
                      payment?.company}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Status */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShield size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payment Status
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Current verification state.
                </p>
              </div>
            </div>

            <StatusPanel
              status={status}
            />
          </section>

          {/* Proof */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Proof
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Submitted transaction screenshot.
                  </p>
                </div>

                {proofUrl && (
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                    title="Open proof"
                  >
                    <FiExternalLink
                      size={16}
                    />
                  </a>
                )}
              </div>
            </div>

            <div className="p-5">
              {proofUrl ? (
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={proofUrl}
                    alt="Payment proof"
                    className="max-h-[450px] w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                  <div>
                    <FiEye
                      size={28}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No payment proof available
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      No screenshot or receipt was attached.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment ID */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Payment ID
            </p>

            <p className="mt-2 break-all font-mono text-sm font-semibold text-gray-800">
              {payment?._id || "-"}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiExternalLink
          size={16}
          className="text-gray-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// DETAIL CARD
// =====================================================

const DetailCard = ({
  label,
  value,
  icon,
  mono = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 break-all text-sm font-semibold text-gray-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};


// =====================================================
// STATUS PANEL
// =====================================================

const StatusPanel = ({
  status,
}) => {
  if (status === "approved") {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <FiCheckCircle
            size={21}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <div>
            <p className="font-bold text-green-800">
              Payment Approved
            </p>

            <p className="mt-1 text-xs leading-5 text-green-700">
              This payment has been approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <FiXCircle
            size={21}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="font-bold text-red-800">
              Payment Rejected
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              This payment has been marked as rejected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <FiClock
          size={21}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <div>
          <p className="font-bold text-amber-800">
            Payment Pending
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            This payment is waiting for verification.
          </p>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
  dark = false,
}) => {
  const resolved =
    status === "approved";

  const rejected =
    status === "rejected";

  const className = dark
    ? resolved
      ? "bg-green-400/10 text-green-300"
      : rejected
        ? "bg-red-400/10 text-red-300"
        : "bg-amber-400/10 text-amber-300"
    : resolved
      ? "bg-green-50 text-green-700"
      : rejected
        ? "bg-red-50 text-red-600"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
    >
      {resolved ? (
        <FiCheckCircle size={13} />
      ) : rejected ? (
        <FiXCircle size={13} />
      ) : (
        <FiClock size={13} />
      )}

      {capitalize(status)}
    </span>
  );
};


// =====================================================
// HELPERS
// =====================================================

const capitalize = (value) => {
  const text = String(
    value || ""
  );

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

const formatDate = (date) => {
  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "-";
  }
};

const formatDateTime = (date) => {
  try {
    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "-";
  }
};

export default PaymentDetails;