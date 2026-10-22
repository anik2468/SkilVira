import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiImage,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiX,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = API_ORIGIN;

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  // =====================================================
  // LOAD PENDING PAYMENTS
  // =====================================================

  const loadPayments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/payments/pending");

      setPayments(data?.payments || []);
    } catch (error) {
      console.error("Load pending payments error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load pending payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPROVE PAYMENT
  // =====================================================

  const approvePayment = async (payment) => {
    const studentName =
      payment?.student?.name || "this student";

    const confirmed = window.confirm(
      `Approve payment from ${studentName}?\n\n` +
        `Amount: ${formatAmount(payment?.finalAmount)}\n` +
        `Transaction ID: ${
          payment?.transactionReference || "-"
        }`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(payment._id);

      const { data } = await api.put(
        `/payments/${payment._id}/approve`
      );

      alert(
        data?.message ||
          "Payment approved successfully."
      );

      setSelectedPayment(null);

      await loadPayments();
    } catch (error) {
      console.error("Approve payment error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to approve payment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT PAYMENT
  // =====================================================

  const rejectPayment = async (payment) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(payment._id);

      const { data } = await api.put(
        `/payments/${payment._id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      alert(
        data?.message ||
          "Payment rejected successfully."
      );

      setSelectedPayment(null);

      await loadPayments();
    } catch (error) {
      console.error("Reject payment error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject payment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredPayments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return payments;
    }

    return payments.filter((payment) => {
      const studentName =
        payment?.student?.name || "";

      const studentEmail =
        payment?.student?.email || "";

      const courseName =
        payment?.course?.title || "";

      const internshipName =
        payment?.internship?.title || "";

      const transaction =
        payment?.transactionReference || "";

      const paymentMethod =
        payment?.paymentMethod || "";

      const referralCode =
        payment?.referralCode || "";

      const searchable = [
        studentName,
        studentEmail,
        courseName,
        internshipName,
        transaction,
        paymentMethod,
        referralCode,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [payments, search]);

  // =====================================================
  // IMAGE / FILE URL
  // =====================================================

  const getFileUrl = (file) => {
    if (!file) {
      return "";
    }

    // Support string
    if (typeof file === "string") {
      if (
        file.startsWith("http://") ||
        file.startsWith("https://")
      ) {
        return file;
      }

      return `${API_BASE}${file.startsWith("/") ? "" : "/"}${file}`;
    }

    // Support uploaded file object
    if (typeof file === "object") {
      const possibleUrl =
        file.url ||
        file.path ||
        file.location ||
        file.secure_url;

      if (!possibleUrl) {
        return "";
      }

      if (
        possibleUrl.startsWith("http://") ||
        possibleUrl.startsWith("https://")
      ) {
        return possibleUrl;
      }

      return `${API_BASE}${
        possibleUrl.startsWith("/") ? "" : "/"
      }${possibleUrl}`;
    }

    return "";
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getProgramName = (payment) => {
    return (
      payment?.course?.title ||
      payment?.internship?.title ||
      "Program"
    );
  };

  const getPaymentType = (payment) => {
    if (payment?.type === "course") {
      return "Course";
    }

    if (payment?.type === "internship") {
      return "Internship";
    }

    return payment?.type || "-";
  };

  const getPaymentDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiRefreshCw className="animate-spin text-5xl text-[#D4AF37]" />

          <p className="text-sm font-semibold text-slate-500">
            Loading pending payments...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF8E7]">
              <FiCreditCard className="text-[#D4AF37]" />
            </span>

            Payment Verification
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Verify student payment proof before activating
            enrollment.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw />

          Refresh
        </button>
      </div>

      {/* =================================================
          SEARCH + COUNT
      ================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-xl">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, course, transaction..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="w-fit rounded-2xl bg-[#FFF8E7] px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Pending Payments
          </span>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {filteredPayments.length}
          </p>
        </div>
      </div>

      {/* =================================================
          EMPTY
      ================================================== */}

      {filteredPayments.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FiCheckCircle className="mx-auto text-6xl text-green-500" />

          <h2 className="mt-5 text-2xl font-black text-slate-900">
            {search
              ? "No Matching Payments"
              : "No Pending Payments"}
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {search
              ? "Try a different student, program, or transaction search."
              : "New manual payment submissions will appear here."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-black transition hover:brightness-95"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* =================================================
           PAYMENT LIST
        ================================================== */

        <div className="space-y-5">
          {filteredPayments.map((payment) => {
            const student = payment?.student;
            const course = payment?.course;
            const internship = payment?.internship;

            const programName = getProgramName(payment);

            const paymentDate = getPaymentDate(
              payment?.createdAt
            );

            const screenshotUrl = getFileUrl(
              payment?.paymentScreenshot
            );

            const isProcessing =
              processingId === payment?._id;

            return (
              <div
                key={payment?._id}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="p-6">
                  {/* TOP */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E7]">
                        <FiUser className="text-xl text-[#D4AF37]" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl font-black text-slate-900">
                          {student?.name ||
                            "Unknown Student"}
                        </h2>

                        <p className="break-all text-sm font-medium text-slate-500">
                          {student?.email || "No email"}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          Submitted: {paymentDate}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-700">
                      Pending Verification
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Detail
                      label="Program"
                      value={programName}
                    />

                    <Detail
                      label="Type"
                      value={getPaymentType(payment)}
                    />

                    <Detail
                      label="Payment Method"
                      value={formatMethod(
                        payment?.paymentMethod
                      )}
                    />

                    <Detail
                      label="Transaction ID"
                      value={
                        payment?.transactionReference
                      }
                    />

                    <Detail
                      label="Original Amount"
                      value={formatAmount(
                        payment?.originalAmount
                      )}
                    />

                    <Detail
                      label="Discount"
                      value={formatAmount(
                        payment?.discountAmount
                      )}
                      valueClass="font-bold text-green-600"
                    />

                    <Detail
                      label="Final Amount"
                      value={formatAmount(
                        payment?.finalAmount
                      )}
                      valueClass="font-black text-[#9A7B14]"
                    />

                    <Detail
                      label="Referral Code"
                      value={
                        payment?.referralCode || "-"
                      }
                    />
                  </div>

                  {/* SCREENSHOT */}
                  {screenshotUrl && (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="flex items-center gap-2 font-black text-slate-900">
                            <FiImage className="text-[#D4AF37]" />

                            Payment Screenshot
                          </h3>

                          <p className="mt-1 text-sm font-medium text-slate-500">
                            Open the proof and verify the
                            transaction details.
                          </p>
                        </div>

                        <a
                          href={screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEye />

                          View Screenshot
                        </a>
                      </div>

                      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={screenshotUrl}
                          alt="Payment proof"
                          className="max-h-[500px] w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* PAYMENT NOTE */}
                  {payment?.paymentNote && (
                    <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Student Note
                      </p>

                      <p className="mt-2 whitespace-pre-line text-sm font-medium leading-6 text-slate-700">
                        {payment.paymentNote}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPayment(payment)
                      }
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FiEye />

                      Review Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        approvePayment(payment)
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiCheckCircle />

                      {isProcessing
                        ? "Processing..."
                        : "Approve Payment"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        rejectPayment(payment)
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiXCircle />

                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================
          REVIEW MODAL
      ================================================== */}

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!processingId) {
              setSelectedPayment(null);
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Payment Review
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Verify all payment details before approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!processingId) {
                    setSelectedPayment(null);
                  }
                }}
                disabled={Boolean(processingId)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* STUDENT + PAYMENT DETAILS */}
              <div className="grid gap-4 md:grid-cols-2">
                <Detail
                  label="Student"
                  value={
                    selectedPayment?.student?.name
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selectedPayment?.student?.email
                  }
                />

                <Detail
                  label="Program"
                  value={getProgramName(
                    selectedPayment
                  )}
                />

                <Detail
                  label="Type"
                  value={getPaymentType(
                    selectedPayment
                  )}
                />

                <Detail
                  label="Transaction ID"
                  value={
                    selectedPayment?.transactionReference
                  }
                />

                <Detail
                  label="Payment Method"
                  value={formatMethod(
                    selectedPayment?.paymentMethod
                  )}
                />

                <Detail
                  label="Original Amount"
                  value={formatAmount(
                    selectedPayment?.originalAmount
                  )}
                />

                <Detail
                  label="Discount"
                  value={formatAmount(
                    selectedPayment?.discountAmount
                  )}
                  valueClass="font-bold text-green-600"
                />

                <Detail
                  label="Final Amount"
                  value={formatAmount(
                    selectedPayment?.finalAmount
                  )}
                  valueClass="font-black text-[#9A7B14]"
                />

                <Detail
                  label="Referral Code"
                  value={
                    selectedPayment?.referralCode ||
                    "-"
                  }
                />

                <Detail
                  label="Submitted At"
                  value={getPaymentDate(
                    selectedPayment?.createdAt
                  )}
                />

                <Detail
                  label="Current Status"
                  value={
                    selectedPayment?.status ||
                    "pending"
                  }
                />
              </div>

              {/* PAYMENT PROOF */}
              {getFileUrl(
                selectedPayment?.paymentScreenshot
              ) && (
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Payment Proof
                      </h3>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Verify the screenshot against the
                        transaction information.
                      </p>
                    </div>

                    <a
                      href={getFileUrl(
                        selectedPayment?.paymentScreenshot
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <FiEye />

                      Open
                    </a>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={getFileUrl(
                        selectedPayment?.paymentScreenshot
                      )}
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      alt="Payment screenshot"
                      className="max-h-[600px] w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* STUDENT NOTE */}
              {selectedPayment?.paymentNote && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Student Note
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm font-medium leading-6 text-slate-700">
                    {selectedPayment.paymentNote}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    approvePayment(selectedPayment)
                  }
                  disabled={
                    processingId ===
                    selectedPayment?._id
                  }
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiCheckCircle />

                  {processingId ===
                  selectedPayment?._id
                    ? "Processing..."
                    : "Approve Payment"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    rejectPayment(selectedPayment)
                  }
                  disabled={
                    processingId ===
                    selectedPayment?._id
                  }
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiXCircle />

                  Reject Payment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!processingId) {
                      setSelectedPayment(null);
                    }
                  }}
                  disabled={Boolean(processingId)}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// DETAIL COMPONENT
// =====================================================

const Detail = ({
  label,
  value,
  valueClass = "",
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-semibold text-slate-800 ${valueClass}`}
      >
        {value || "-"}
      </p>
    </div>
  );
};

// =====================================================
// FORMAT AMOUNT
// =====================================================

const formatAmount = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toLocaleString("en-IN")}`;
};

// =====================================================
// FORMAT PAYMENT METHOD
// =====================================================

const formatMethod = (method) => {
  const labels = {
    upi: "UPI",
    bank_transfer: "Bank Transfer",
    card: "Card",
    cash: "Cash",
    other: "Other",
  };

  return labels[method] || method || "-";
};

export default PaymentVerification;