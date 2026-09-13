import { useEffect, useState } from "react";

import {
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiImage,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";


const API_BASE =
  "http://localhost:5000";


const PaymentVerification = () => {

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedPayment, setSelectedPayment] =
    useState(null);


  useEffect(() => {

    loadPayments();

  }, []);


  // =====================================================
  // LOAD PENDING PAYMENTS
  // =====================================================

  const loadPayments = async () => {

    try {

      setLoading(true);

      const { data } =
        await api.get(
          "/payments/pending"
        );


      setPayments(
        data.payments || []
      );

    } catch (error) {

      console.error(error);

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

  const approvePayment = async (
    payment
  ) => {

    const confirmed =
      window.confirm(
        `Approve payment from ${
          payment.student?.name ||
          "this student"
        }?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(
        payment._id
      );


      const { data } =
        await api.put(
          `/payments/${payment._id}/approve`
        );


      alert(
        data.message ||
        "Payment approved successfully."
      );


      setSelectedPayment(
        null
      );


      await loadPayments();

    } catch (error) {

      console.error(error);

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

  const rejectPayment = async (
    payment
  ) => {

    const reason =
      window.prompt(
        "Enter rejection reason:"
      );


    if (!reason?.trim()) {
      return;
    }


    try {

      setProcessingId(
        payment._id
      );


      const { data } =
        await api.put(

          `/payments/${payment._id}/reject`,

          {
            reason:
              reason.trim(),
          }

        );


      alert(
        data.message ||
        "Payment rejected successfully."
      );


      setSelectedPayment(
        null
      );


      await loadPayments();

    } catch (error) {

      console.error(error);

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

  const filteredPayments =
    payments.filter(
      (payment) => {

        const studentName =
          payment.student?.name ||
          "";

        const studentEmail =
          payment.student?.email ||
          "";

        const courseName =
          payment.course?.title ||
          "";

        const internshipName =
          payment.internship?.title ||
          "";

        const transaction =
          payment.transactionReference ||
          "";


        const searchable = [

          studentName,

          studentEmail,

          courseName,

          internshipName,

          transaction,

        ]
          .join(" ")
          .toLowerCase();


        return searchable.includes(
          search.toLowerCase()
        );

      }
    );


  // =====================================================
  // IMAGE URL
  // =====================================================

  const getFileUrl = (
    file
  ) => {

    if (!file) {
      return "";
    }


    if (
      file.startsWith("http")
    ) {
      return file;
    }


    return `${API_BASE}${file}`;

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <FiRefreshCw
          className="animate-spin text-5xl text-[#D4AF37]"
        />

      </div>

    );

  }


  return (

    <div className="space-y-8">


      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <FiCreditCard
              className="text-[#D4AF37]"
            />

            Payment Verification

          </h1>

          <p className="mt-2 text-gray-500">

            Verify student payment proof before activating enrollment.

          </p>

        </div>


        <button

          onClick={loadPayments}

          className="flex w-fit items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"

        >

          <FiRefreshCw />

          Refresh

        </button>

      </div>



      {/* =========================================
          SEARCH + COUNT
      ========================================== */}

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">

        <div className="relative w-full max-w-md">

          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input

            type="text"

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            placeholder="Search student, course, transaction..."

            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-[#D4AF37]"

          />

        </div>


        <div className="rounded-xl bg-[#D4AF37]/10 px-5 py-3">

          <span className="text-sm text-gray-500">

            Pending Payments

          </span>

          <p className="text-xl font-bold">

            {filteredPayments.length}

          </p>

        </div>

      </div>



      {/* =========================================
          EMPTY
      ========================================== */}

      {filteredPayments.length === 0 ? (

        <div className="rounded-3xl bg-white p-12 text-center shadow">

          <FiCheckCircle
            className="mx-auto text-6xl text-green-500"
          />

          <h2 className="mt-5 text-2xl font-bold">

            No Pending Payments

          </h2>

          <p className="mt-2 text-gray-500">

            New manual payment submissions will appear here.

          </p>

        </div>

      ) : (


        /* =========================================
           PAYMENT LIST
        ========================================== */

        <div className="space-y-5">

          {filteredPayments.map(
            (payment) => {

              const student =
                payment.student;

              const course =
                payment.course;

              const internship =
                payment.internship;


              const programName =
                course?.title ||
                internship?.title ||
                "Program";


              const paymentDate =
                payment.createdAt
                  ? new Date(
                      payment.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "-";


              const screenshotUrl =
                getFileUrl(
                  payment.paymentScreenshot
                );


              const isProcessing =
                processingId ===
                payment._id;


              return (

                <div

                  key={payment._id}

                  className="overflow-hidden rounded-3xl bg-white shadow"

                >

                  <div className="p-6">


                    {/* =================================
                        TOP
                    ================================= */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">


                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10">

                          <FiUser
                            className="text-xl text-[#D4AF37]"
                          />

                        </div>


                        <div>

                          <h2 className="text-xl font-bold">

                            {student?.name ||
                              "Unknown Student"}

                          </h2>


                          <p className="text-gray-500">

                            {student?.email ||
                              "No email"}

                          </p>


                          <p className="mt-1 text-sm text-gray-400">

                            {paymentDate}

                          </p>

                        </div>

                      </div>


                      <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                        Pending Verification

                      </span>

                    </div>



                    {/* =================================
                        DETAILS
                    ================================= */}

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">


                      <Detail
                        label="Program"
                        value={
                          programName
                        }
                      />


                      <Detail
                        label="Type"
                        value={
                          payment.type ===
                          "course"
                            ? "Course"
                            : "Internship"
                        }
                      />


                      <Detail
                        label="Payment Method"
                        value={
                          formatMethod(
                            payment.paymentMethod
                          )
                        }
                      />


                      <Detail
                        label="Transaction ID"
                        value={
                          payment.transactionReference
                        }
                      />


                      <Detail
                        label="Original Amount"
                        value={
                          formatAmount(
                            payment.originalAmount
                          )
                        }
                      />


                      <Detail
                        label="Discount"
                        value={
                          formatAmount(
                            payment.discountAmount
                          )
                        }
                        valueClass="text-green-600"
                      />


                      <Detail
                        label="Final Amount"
                        value={
                          formatAmount(
                            payment.finalAmount
                          )
                        }
                        valueClass="font-bold text-[#D4AF37]"
                      />


                      <Detail
                        label="Referral Code"
                        value={
                          payment.referralCode ||
                          "-"
                        }
                      />

                    </div>



                    {/* =================================
                        SCREENSHOT
                    ================================= */}

                    {payment.paymentScreenshot && (

                      <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                          <div>

                            <h3 className="flex items-center gap-2 font-bold">

                              <FiImage
                                className="text-[#D4AF37]"
                              />

                              Payment Screenshot

                            </h3>

                            <p className="mt-1 text-sm text-gray-500">

                              Open the proof and verify the transaction.

                            </p>

                          </div>


                          <a

                            href={
                              screenshotUrl
                            }

                            target="_blank"

                            rel="noreferrer"

                            className="flex w-fit items-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-50"

                          >

                            <FiEye />

                            View Screenshot

                          </a>

                        </div>


                        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">

                          <img

                            src={
                              screenshotUrl
                            }

                            alt="Payment proof"

                            className="max-h-[500px] w-full object-contain"

                          />

                        </div>

                      </div>

                    )}



                    {/* =================================
                        PAYMENT NOTE
                    ================================= */}

                    {payment.paymentNote && (

                      <div className="mt-5 rounded-2xl border p-5">

                        <p className="text-sm font-semibold text-gray-500">

                          Student Note

                        </p>

                        <p className="mt-2 whitespace-pre-line">

                          {
                            payment.paymentNote
                          }

                        </p>

                      </div>

                    )}



                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      <button

                        onClick={() =>
                          setSelectedPayment(
                            payment
                          )
                        }

                        className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold"

                      >

                        <FiEye />

                        Review Details

                      </button>


                      <button

                        onClick={() =>
                          approvePayment(
                            payment
                          )
                        }

                        disabled={
                          isProcessing
                        }

                        className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white disabled:opacity-60"

                      >

                        <FiCheckCircle />

                        {isProcessing
                          ? "Processing..."
                          : "Approve Payment"}

                      </button>


                      <button

                        onClick={() =>
                          rejectPayment(
                            payment
                          )
                        }

                        disabled={
                          isProcessing
                        }

                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-60"

                      >

                        <FiXCircle />

                        Reject

                      </button>

                    </div>

                  </div>

                </div>

              );

            }

          )}

        </div>

      )}



      {/* =========================================
          REVIEW MODAL
      ========================================== */}

      {selectedPayment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white">

            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">

              <div>

                <h2 className="text-2xl font-bold">

                  Payment Review

                </h2>

                <p className="text-sm text-gray-500">

                  Verify all payment details before approval.

                </p>

              </div>


              <button

                onClick={() =>
                  setSelectedPayment(
                    null
                  )
                }

                className="rounded-xl border px-4 py-2 font-semibold"

              >

                Close

              </button>

            </div>


            <div className="space-y-6 p-6">


              <div className="grid gap-4 md:grid-cols-2">

                <Detail
                  label="Student"
                  value={
                    selectedPayment.student?.name
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selectedPayment.student?.email
                  }
                />

                <Detail
                  label="Transaction ID"
                  value={
                    selectedPayment.transactionReference
                  }
                />

                <Detail
                  label="Payment Method"
                  value={
                    formatMethod(
                      selectedPayment.paymentMethod
                    )
                  }
                />

                <Detail
                  label="Original Amount"
                  value={
                    formatAmount(
                      selectedPayment.originalAmount
                    )
                  }
                />

                <Detail
                  label="Discount"
                  value={
                    formatAmount(
                      selectedPayment.discountAmount
                    )
                  }
                />

                <Detail
                  label="Final Amount"
                  value={
                    formatAmount(
                      selectedPayment.finalAmount
                    )
                  }
                  valueClass="font-bold text-[#D4AF37]"
                />

                <Detail
                  label="Referral Code"
                  value={
                    selectedPayment.referralCode ||
                    "-"
                  }
                />

              </div>


              {selectedPayment.paymentScreenshot && (

                <div>

                  <h3 className="mb-4 text-lg font-bold">

                    Payment Proof

                  </h3>


                  <img

                    src={getFileUrl(
                      selectedPayment.paymentScreenshot
                    )}

                    alt="Payment screenshot"

                    className="max-h-[600px] w-full rounded-2xl border object-contain"

                  />

                </div>

              )}


              <div className="flex flex-wrap gap-3 border-t pt-5">

                <button

                  onClick={() =>
                    approvePayment(
                      selectedPayment
                    )
                  }

                  disabled={
                    processingId ===
                    selectedPayment._id
                  }

                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white"

                >

                  <FiCheckCircle />

                  Approve Payment

                </button>


                <button

                  onClick={() =>
                    rejectPayment(
                      selectedPayment
                    )
                  }

                  disabled={
                    processingId ===
                    selectedPayment._id
                  }

                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white"

                >

                  <FiXCircle />

                  Reject Payment

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
// HELPERS
// =====================================================

const Detail = ({
  label,
  value,
  valueClass = "",
}) => {

  return (

    <div className="rounded-2xl bg-gray-50 p-4">

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p
        className={`mt-1 break-words ${valueClass}`}
      >

        {value || "-"}

      </p>

    </div>

  );

};


const formatAmount = (
  amount
) => {

  const value =
    Number(amount || 0);


  return `₹${value.toLocaleString(
    "en-IN"
  )}`;

};


const formatMethod = (
  method
) => {

  const labels = {

    upi: "UPI",

    bank_transfer:
      "Bank Transfer",

    card:
      "Card",

    cash:
      "Cash",

    other:
      "Other",

  };


  return (
    labels[method] ||
    method ||
    "-"
  );

};


export default PaymentVerification;