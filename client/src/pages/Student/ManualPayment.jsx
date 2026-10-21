import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiInfo,
  FiRefreshCw,
  FiUpload,
} from "react-icons/fi";

import api from "../../services/api";


const ManualPayment = () => {

  const location = useLocation();
  const navigate = useNavigate();


  const purchase =
    location.state || {};


  const {
    type = "course",
    course = null,
    internship = null,
    amount = 0,
    referralCode: initialReferralCode = "",
  } = purchase;


  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [validatingReferral, setValidatingReferral] =
    useState(false);

  const [paymentSettings, setPaymentSettings] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [transactionReference, setTransactionReference] =
    useState("");

  const [paymentNote, setPaymentNote] =
    useState("");

  const [screenshot, setScreenshot] =
    useState(null);

  const [referralCode, setReferralCode] =
    useState(initialReferralCode);

  const [discount, setDiscount] =
    useState(0);


  const item =
    type === "internship"
      ? internship
      : course;


  const itemName =
    item?.title ||
    item?.name ||
    "Selected Program";


  const originalAmount =
    Number(amount) ||
    Number(item?.price) ||
    0;


  const finalAmount =
    Math.max(
      originalAmount - discount,
      0
    );


  useEffect(() => {

    loadPaymentSettings();

  }, []);


  const loadPaymentSettings = async () => {

    try {

      setLoadingSettings(true);

      const { data } =
        await api.get(
          "/payment-settings"
        );


      setPaymentSettings(
        data.settings || null
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load payment details."
      );

    } finally {

      setLoadingSettings(false);

    }

  };


  const validateReferral = async () => {

    if (!referralCode.trim()) {

      setDiscount(0);

      return;

    }


    try {

      setValidatingReferral(true);


      const { data } =
        await api.post(
          "/referral/validate",
          {
            referralCode:
              referralCode.trim(),

            type,

            courseId:
              type === "course"
                ? item?._id
                : undefined,

            internshipId:
              type === "internship"
                ? item?._id
                : undefined,

            amount:
              originalAmount,
          }
        );


      if (
        data.success
      ) {

        const calculatedDiscount =
          Number(
            data.discount ||
            data.discountAmount ||
            0
          );


        setDiscount(
          Math.min(
            calculatedDiscount,
            originalAmount
          )
        );


        alert(
          `Referral applied successfully. Discount: ₹${calculatedDiscount}`
        );

      } else {

        setDiscount(0);

        alert(
          data.message ||
          "Invalid referral code."
        );

      }

    } catch (error) {

      setDiscount(0);

      alert(
        error.response?.data?.message ||
        "Invalid referral code."
      );

    } finally {

      setValidatingReferral(false);

    }

  };


  const handleScreenshot = (e) => {

    const file =
      e.target.files?.[0] ||
      null;


    if (!file) {
      return;
    }


    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      alert(
        "Please upload PNG, JPG or WEBP image."
      );

      e.target.value = "";

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Screenshot size must be less than 5MB."
      );

      e.target.value = "";

      return;

    }


    setScreenshot(file);

  };


  const submitPayment = async () => {

    if (
      !paymentSettings?.isActive
    ) {

      alert(
        "Manual payment is currently unavailable."
      );

      return;

    }


    if (
      finalAmount <= 0
    ) {

      alert(
        "Invalid payment amount."
      );

      return;

    }


    if (
      !transactionReference.trim()
    ) {

      alert(
        "Please enter transaction ID / reference number."
      );

      return;

    }


    if (!screenshot) {

      alert(
        "Please upload your payment screenshot."
      );

      return;

    }


    try {

      setSubmitting(true);


      const formData =
        new FormData();


      formData.append(
        "type",
        type
      );


      if (
        type === "course" &&
        item?._id
      ) {

        formData.append(
          "course",
          item._id
        );

      }


      if (
        type === "internship" &&
        item?._id
      ) {

        formData.append(
          "internship",
          item._id
        );

      }


      formData.append(
        "originalAmount",
        originalAmount
      );


      formData.append(
        "discountAmount",
        discount
      );


      formData.append(
        "finalAmount",
        finalAmount
      );


      formData.append(
        "paymentMethod",
        paymentMethod
      );


      formData.append(
        "transactionReference",
        transactionReference.trim()
      );


      formData.append(
        "paymentNote",
        paymentNote.trim()
      );


      if (
        referralCode.trim()
      ) {

        formData.append(
          "referralCode",
          referralCode.trim()
        );

      }


      formData.append(
        "paymentScreenshot",
        screenshot
      );


      const { data } =
        await api.post(
          "/payments/manual",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );


      if (!data.success) {

        throw new Error(
          data.message ||
          "Payment submission failed."
        );

      }


      alert(
        "Payment submitted successfully. Your payment is now under verification."
      );


      navigate(
        "/student/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit payment."
      );

    } finally {

      setSubmitting(false);

    }

  };


  if (loadingSettings) {

    return (

      <div className="flex min-h-[70vh] items-center justify-center">

        <FiRefreshCw
          className="animate-spin text-4xl text-[#D4AF37]"
        />

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-gray-50 px-4 py-8">


      <div className="mx-auto max-w-6xl">


        {/* Back */}

        <button

          onClick={() =>
            navigate(-1)
          }

          className="mb-6 flex items-center gap-2 font-semibold text-gray-600 hover:text-black"

        >

          <FiArrowLeft />

          Back

        </button>



        {/* Header */}

        <div className="mb-8">

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <FiCreditCard
              className="text-[#D4AF37]"
            />

            Complete Payment

          </h1>

          <p className="mt-2 text-gray-500">

            Pay manually using the company's QR or bank details and upload your payment proof.

          </p>

        </div>



        {!paymentSettings?.isActive ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow">

            <FiInfo
              className="mx-auto text-5xl text-red-500"
            />

            <h2 className="mt-4 text-2xl font-bold">

              Manual Payment Unavailable

            </h2>

            <p className="mt-2 text-gray-500">

              The payment team has temporarily disabled manual payments.

            </p>

          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-2">


            {/* =========================================
                PAYMENT DETAILS
            ========================================== */}

            <div className="space-y-6">


              {/* Program */}

              <div className="rounded-3xl bg-white p-6 shadow">

                <p className="text-sm text-gray-500">

                  Selected Program

                </p>

                <h2 className="mt-1 text-2xl font-bold">

                  {itemName}

                </h2>


                <div className="mt-6 space-y-3">

                  <Row
                    label="Original Amount"
                    value={`₹${originalAmount.toLocaleString("en-IN")}`}
                  />


                  <Row
                    label="Referral Discount"
                    value={`- ₹${discount.toLocaleString("en-IN")}`}
                    valueClass="text-green-600"
                  />


                  <div className="my-4 border-t" />


                  <Row
                    label="Final Amount"
                    value={`₹${finalAmount.toLocaleString("en-IN")}`}
                    valueClass="text-xl font-bold text-[#D4AF37]"
                  />

                </div>

              </div>



              {/* QR */}

              <div className="rounded-3xl bg-white p-6 shadow">

                <h2 className="text-xl font-bold">

                  Scan & Pay

                </h2>

                <p className="mt-1 text-sm text-gray-500">

                  Scan the QR code using your preferred UPI app.

                </p>


                {paymentSettings.qrCode ? (

                  <div className="mt-5 flex justify-center">

                    <img

                      src={getFileUrl(
                        paymentSettings.qrCode
                      )}

                      alt="Payment QR"

                      className="h-72 w-72 rounded-2xl border object-contain"

                    />

                  </div>

                ) : (

                  <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center text-gray-400">

                    QR code is not available.

                  </div>

                )}


                {paymentSettings.upiId && (

                  <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-center">

                    <p className="text-sm text-gray-500">

                      UPI ID

                    </p>

                    <p className="mt-1 font-bold">

                      {paymentSettings.upiId}

                    </p>

                  </div>

                )}

              </div>



              {/* Bank */}

              <div className="rounded-3xl bg-white p-6 shadow">

                <h2 className="text-xl font-bold">

                  Bank Transfer

                </h2>


                <div className="mt-5 space-y-4">

                  <BankRow
                    label="Account Holder"
                    value={
                      paymentSettings.accountHolderName
                    }
                  />

                  <BankRow
                    label="Account Number"
                    value={
                      paymentSettings.accountNumber
                    }
                  />

                  <BankRow
                    label="IFSC"
                    value={
                      paymentSettings.ifscCode
                    }
                  />

                  <BankRow
                    label="Bank"
                    value={
                      paymentSettings.bankName
                    }
                  />

                  <BankRow
                    label="Branch"
                    value={
                      paymentSettings.branch
                    }
                  />

                </div>

              </div>



              {/* Instructions */}

              {paymentSettings.paymentInstructions && (

                <div className="rounded-3xl bg-white p-6 shadow">

                  <h2 className="flex items-center gap-2 text-xl font-bold">

                    <FiInfo
                      className="text-[#D4AF37]"
                    />

                    Payment Instructions

                  </h2>

                  <p className="mt-4 whitespace-pre-line text-gray-600">

                    {
                      paymentSettings.paymentInstructions
                    }

                  </p>

                </div>

              )}

            </div>



            {/* =========================================
                PAYMENT FORM
            ========================================== */}

            <div className="rounded-3xl bg-white p-6 shadow lg:p-8">

              <h2 className="text-2xl font-bold">

                Submit Payment Proof

              </h2>

              <p className="mt-2 text-gray-500">

                After completing the payment, submit the transaction details below.

              </p>



              {/* Payment Method */}

              <div className="mt-7">

                <label className="mb-3 block text-sm font-semibold">

                  Payment Method

                </label>


                <div className="grid grid-cols-2 gap-3">

                  {[
                    ["upi", "UPI"],
                    [
                      "bank_transfer",
                      "Bank Transfer",
                    ],
                    ["card", "Card"],
                    ["other", "Other"],
                  ].map(
                    ([value, label]) => (

                      <button

                        key={value}

                        type="button"

                        onClick={() =>
                          setPaymentMethod(
                            value
                          )
                        }

                        className={`rounded-xl border p-3 font-semibold ${
                          paymentMethod === value
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-gray-200"
                        }`}

                      >

                        {label}

                      </button>

                    )
                  )}

                </div>

              </div>



              {/* Referral */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold">

                  Referral Code

                </label>


                <div className="flex gap-2">

                  <input

                    value={referralCode}

                    onChange={(e) =>
                      setReferralCode(
                        e.target.value
                      )
                    }

                    placeholder="Enter referral code"

                    className="min-w-0 flex-1 rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                  />


                  <button

                    type="button"

                    onClick={
                      validateReferral
                    }

                    disabled={
                      validatingReferral
                    }

                    className="rounded-xl bg-[#D4AF37] px-4 font-semibold text-white"

                  >

                    {validatingReferral
                      ? "..."
                      : "Apply"}

                  </button>

                </div>

              </div>



              {/* Transaction ID */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold">

                  Transaction ID / Reference Number
                  <span className="text-red-500">
                    {" "}*
                  </span>

                </label>


                <input

                  value={
                    transactionReference
                  }

                  onChange={(e) =>
                    setTransactionReference(
                      e.target.value
                    )
                  }

                  placeholder="Enter transaction ID"

                  className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                />

              </div>



              {/* Screenshot */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold">

                  Payment Screenshot
                  <span className="text-red-500">
                    {" "}*
                  </span>

                </label>


                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center hover:bg-gray-50">

                  <FiUpload
                    className="text-3xl text-[#D4AF37]"
                  />

                  <span className="mt-3 font-semibold">

                    Choose payment screenshot

                  </span>

                  <span className="mt-1 text-sm text-gray-500">

                    PNG, JPG or WEBP • Max 5MB

                  </span>


                  <input

                    type="file"

                    accept="image/png,image/jpeg,image/jpg,image/webp"

                    onChange={
                      handleScreenshot
                    }

                    className="hidden"

                  />

                </label>


                {screenshot && (

                  <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">

                    Selected:
                    {" "}
                    <strong>
                      {screenshot.name}
                    </strong>

                  </div>

                )}

              </div>



              {/* Note */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-semibold">

                  Note

                </label>


                <textarea

                  value={paymentNote}

                  onChange={(e) =>
                    setPaymentNote(
                      e.target.value
                    )
                  }

                  rows={4}

                  placeholder="Optional payment note"

                  className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                />

              </div>



              {/* Final Amount */}

              <div className="mt-7 rounded-2xl bg-gray-50 p-5">

                <div className="flex items-center justify-between">

                  <span className="font-semibold">

                    Amount to Pay

                  </span>

                  <span className="text-2xl font-bold text-[#D4AF37]">

                    ₹{finalAmount.toLocaleString("en-IN")}

                  </span>

                </div>

              </div>



              {/* Submit */}

              <button

                onClick={
                  submitPayment
                }

                disabled={
                  submitting
                }

                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-4 font-bold text-white disabled:opacity-60"

              >

                {submitting ? (

                  <>
                    <FiRefreshCw className="animate-spin" />
                    Submitting...
                  </>

                ) : (

                  <>
                    <FiCheckCircle />
                    Submit Payment for Verification
                  </>

                )}

              </button>



              <p className="mt-4 text-center text-xs text-gray-500">

                Your enrollment will become active only after the payment is verified and approved.

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


// =====================================================
// HELPERS
// =====================================================

const Row = ({
  label,
  value,
  valueClass = "",
}) => {

  return (

    <div className="flex items-center justify-between gap-4">

      <span className="text-gray-500">
        {label}
      </span>

      <span className={valueClass}>
        {value}
      </span>

    </div>

  );

};


const BankRow = ({
  label,
  value,
}) => {

  return (

    <div className="flex items-start justify-between gap-5">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-right font-semibold">
        {value || "-"}
      </span>

    </div>

  );

};


const getFileUrl = (file) => {

  if (!file) {
    return "";
  }

  if (
    file.startsWith("http")
  ) {
    return file;
  }

  return `${API_ORIGIN}${file}`;

};


export default ManualPayment;