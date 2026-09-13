import { useState } from "react";
import {
  FiUpload,
  FiX,
  FiCheckCircle,
  FiTag,
  FiCreditCard,
} from "react-icons/fi";

import { applyInternship } from "../../services/applicationService";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";
import { uploadFile } from "../../services/uploadService";

const ApplyInternshipModal = ({
  internship,
  studentId,
  onClose,
  onSuccess,
}) => {
  const originalAmount = Number(internship?.price || 0);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [referralLoading, setReferralLoading] = useState(false);

  const [form, setForm] = useState({
    resume: "",
    coverLetter: "",
    portfolio: "",
    referralCode: "",
    discount: 0,
    finalAmount: originalAmount,
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadResume = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload your resume in PDF format.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const data = await uploadFile(file);

      if (!data?.url) {
        throw new Error("Upload URL was not returned.");
      }

      setForm((prev) => ({
        ...prev,
        resume: data.url,
      }));
    } catch (error) {
      console.error("Resume upload failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Resume upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const applyReferral = async () => {
    const code = form.referralCode.trim();

    if (!code) {
      alert("Please enter a referral code.");
      return;
    }

    try {
      setReferralLoading(true);

      const { default: api } = await import("../../services/api");

      const { data } = await api.post("/referral/validate", {
        code,
        internshipId: internship._id,
      });

      if (!data?.success) {
        throw new Error(
          data?.message || "Invalid referral code."
        );
      }

      const discount = Number(data.discount || 0);

      const finalAmount =
        data.finalAmount !== undefined
          ? Number(data.finalAmount)
          : Math.max(originalAmount - discount, 0);

      setForm((prev) => ({
        ...prev,
        referralCode: code,
        discount,
        finalAmount,
      }));

      alert("Referral discount applied successfully.");
    } catch (error) {
      console.error("Referral validation failed:", error);

      setForm((prev) => ({
        ...prev,
        discount: 0,
        finalAmount: originalAmount,
      }));

      alert(
        error?.response?.data?.message ||
          "Invalid referral code."
      );
    } finally {
      setReferralLoading(false);
    }
  };

  const submitApplication = async () => {
    return applyInternship({
      student: studentId,
      internship: internship._id,
      resume: form.resume,
      coverLetter: form.coverLetter.trim(),
      portfolio: form.portfolio.trim(),
    });
  };

  const payNow = async () => {
    try {
      setLoading(true);

      const amountToPay = Number(form.finalAmount || 0);

      const orderData = await createPaymentOrder({
        student: studentId,
        type: "internship",
        internship: internship._id,
        amount: amountToPay,
        referralCode: form.referralCode.trim() || undefined,
      });

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is not available. Please refresh the page."
        );
      }

      if (!orderData?.order?.id) {
        throw new Error("Payment order could not be created.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "SkilVira",
        description:
          internship.title || "Internship Application",
        order_id: orderData.order.id,

        handler: async (response) => {
          try {
            setLoading(true);

            await verifyPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              paymentId: orderData.paymentId,
            });

            await submitApplication();

            alert(
              "Payment successful and application submitted successfully."
            );

            if (onSuccess) {
              await onSuccess();
            }

            onClose();
          } catch (error) {
            console.error(
              "Payment verification/application failed:",
              error
            );

            alert(
              error?.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#D4AF37",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Payment could not be started."
      );

      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!internship?._id) {
      alert("Internship information is missing.");
      return;
    }

    if (!studentId) {
      alert("Student information is missing.");
      return;
    }

    if (!form.resume) {
      alert("Please upload your resume first.");
      return;
    }

    const amount = Number(form.finalAmount || 0);

    try {
      if (amount > 0) {
        await payNow();
        return;
      }

      setLoading(true);

      await submitApplication();

      alert("Application submitted successfully.");

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      console.error(
        "Application submission failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit application."
      );
    } finally {
      if (amount === 0) {
        setLoading(false);
      }
    }
  };

  if (!internship) return null;

  const hasDiscount = Number(form.discount || 0) > 0;
  const finalAmount = Number(form.finalAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.30)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B58A18]">
              Internship Application
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Apply for Internship
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Submit your application details to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              loading ||
              uploading ||
              referralLoading
            }
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="overflow-y-auto px-6 py-6 sm:px-8"
        >
          <div className="space-y-6">

            {/* Internship Summary */}
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#FCFBF5] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#9A7B14]">
                    Applying for
                  </p>

                  <h3 className="mt-1 text-lg font-black text-slate-900">
                    {internship.title}
                  </h3>

                  {internship.company && (
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {internship.company}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {hasDiscount && (
                    <p className="text-xs font-semibold text-slate-400 line-through">
                      ₹{originalAmount}
                    </p>
                  )}

                  <p className="text-xl font-black text-[#9A7B14]">
                    {finalAmount === 0
                      ? "Free"
                      : `₹${finalAmount}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div>
              <div className="mb-3">
                <label className="text-sm font-black text-slate-700">
                  Resume{" "}
                  <span className="text-red-500">*</span>
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  PDF only, maximum 5 MB.
                </p>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-[#D4AF37] hover:bg-[#FFF8E7]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#B58A18] shadow-sm">
                    <FiUpload size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800">
                      {uploading
                        ? "Uploading resume..."
                        : form.resume
                          ? "Resume uploaded"
                          : "Choose your resume"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {form.resume
                        ? "You can replace it anytime"
                        : "Upload PDF"}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-xl border border-[#D4AF37]/40 bg-white px-4 py-2 text-xs font-black text-[#9A7B14]">
                  {uploading ? "Uploading..." : "Browse"}
                </span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  disabled={loading || uploading}
                  onChange={uploadResume}
                />
              </label>

              {form.resume && (
                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
                  <FiCheckCircle size={16} />
                  Resume ready for submission
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="coverLetter"
                className="mb-2 block text-sm font-black text-slate-700"
              >
                Cover Letter
              </label>

              <textarea
                id="coverLetter"
                name="coverLetter"
                placeholder="Tell the company why you are a good fit..."
                value={form.coverLetter}
                onChange={changeHandler}
                rows={6}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label
                htmlFor="portfolio"
                className="mb-2 block text-sm font-black text-slate-700"
              >
                Portfolio / GitHub
              </label>

              <input
                id="portfolio"
                type="url"
                name="portfolio"
                placeholder="https://github.com/username"
                value={form.portfolio}
                onChange={changeHandler}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* Referral */}
            <div>
              <label
                htmlFor="referralCode"
                className="mb-2 block text-sm font-black text-slate-700"
              >
                Referral Code
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <FiTag
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="referralCode"
                    name="referralCode"
                    placeholder="Enter referral code"
                    value={form.referralCode}
                    onChange={changeHandler}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyReferral}
                  disabled={
                    referralLoading ||
                    loading ||
                    !form.referralCode.trim()
                  }
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {referralLoading
                    ? "Checking..."
                    : "Apply"}
                </button>
              </div>

              {hasDiscount && (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-emerald-700">
                        Referral discount applied
                      </p>

                      <p className="mt-1 text-xs text-emerald-600">
                        You save ₹
                        {Number(form.discount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400 line-through">
                        ₹{originalAmount}
                      </p>

                      <p className="text-lg font-black text-emerald-700">
                        ₹{finalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <FiCreditCard
                  size={18}
                  className="text-[#B58A18]"
                />

                <h3 className="font-black text-slate-900">
                  Application Summary
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Internship fee</span>
                  <span className="font-bold">
                    ₹{originalAmount}
                  </span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Referral discount</span>
                    <span className="font-bold">
                      -₹{Number(form.discount)}
                    </span>
                  </div>
                )}

                <div className="my-3 border-t border-slate-200" />

                <div className="flex justify-between">
                  <span className="font-black text-slate-900">
                    Total payable
                  </span>

                  <span className="text-lg font-black text-[#9A7B14]">
                    {finalAmount === 0
                      ? "Free"
                      : `₹${finalAmount}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={
                loading ||
                uploading ||
                referralLoading
              }
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                uploading ||
                referralLoading ||
                !form.resume
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-7 py-3 text-sm font-black text-black shadow-sm transition hover:bg-[#E1C14E] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Processing...
                </>
              ) : finalAmount > 0 ? (
                <>
                  <FiCreditCard size={17} />
                  Pay ₹{finalAmount} & Apply
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternshipModal;