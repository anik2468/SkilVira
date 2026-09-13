import { useEffect, useState } from "react";

import {
  FiSave,
  FiUpload,
  FiTrash2,
  FiRefreshCw,
  FiCreditCard,
  FiImage,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiEdit3,
  FiCopy,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = "http://localhost:5000";

const PaymentSettings = () => {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingQR, setUploadingQR] =
    useState(false);

  const [removingQR, setRemovingQR] =
    useState(false);

  const [qrFile, setQrFile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showAccountNumber, setShowAccountNumber] =
    useState(false);

  const [settings, setSettings] = useState({
    upiId: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    paymentInstructions: "",
    isActive: true,
    qrCode: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } =
        await api.get(
          "/payment-settings"
        );

      const current =
        data?.settings || {};

      setSettings({
        upiId:
          current?.upiId || "",

        accountHolderName:
          current?.accountHolderName || "",

        accountNumber:
          current?.accountNumber || "",

        ifscCode:
          current?.ifscCode || "",

        bankName:
          current?.bankName || "",

        branch:
          current?.branch || "",

        paymentInstructions:
          current?.paymentInstructions || "",

        isActive:
          current?.isActive !== false,

        qrCode:
          current?.qrCode || "",
      });
    } catch (err) {
      console.error(
        "Load payment settings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load payment settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data } =
        await api.put(
          "/payment-settings",
          {
            upiId:
              settings.upiId.trim(),

            accountHolderName:
              settings.accountHolderName.trim(),

            accountNumber:
              settings.accountNumber.trim(),

            ifscCode:
              settings.ifscCode.trim().toUpperCase(),

            bankName:
              settings.bankName.trim(),

            branch:
              settings.branch.trim(),

            paymentInstructions:
              settings.paymentInstructions.trim(),

            isActive:
              settings.isActive,
          }
        );

      setSettings((previous) => ({
        ...previous,
        qrCode:
          data?.settings?.qrCode ||
          previous.qrCode,
      }));

      setSuccess(
        "Payment settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Save payment settings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save payment settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadQR = async () => {
    if (!qrFile) {
      setError(
        "Please select a QR image first."
      );
      return;
    }

    try {
      setUploadingQR(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "qrCode",
        qrFile
      );

      const { data } =
        await api.post(
          "/payment-settings/qr",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setSettings((previous) => ({
        ...previous,
        qrCode:
          data?.settings?.qrCode ||
          "",
      }));

      setQrFile(null);

      setSuccess(
        "Payment QR code uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Upload QR error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload QR code."
      );
    } finally {
      setUploadingQR(false);
    }
  };

  const removeQR = async () => {
    const confirmed =
      window.confirm(
        "Remove the current payment QR code?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingQR(true);
      setError("");
      setSuccess("");

      await api.delete(
        "/payment-settings/qr"
      );

      setSettings((previous) => ({
        ...previous,
        qrCode: "",
      }));

      setSuccess(
        "Payment QR code removed successfully."
      );
    } catch (err) {
      console.error(
        "Remove QR error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove QR code."
      );
    } finally {
      setRemovingQR(false);
    }
  };

  const getFileUrl = (file) => {
    if (!file) {
      return "";
    }

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${API_BASE}${file}`;
  };

  const copyUPI = async () => {
    if (!settings.upiId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        settings.upiId
      );

      setSuccess(
        "UPI ID copied to clipboard."
      );
    } catch (err) {
      console.error(
        "Copy UPI error:",
        err
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
            <FiRefreshCw
              size={21}
              className="text-[#D4AF37]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Loading Payment Settings...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fetching the current payment configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              Payment Configuration
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Payment Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Manage the UPI, bank account and QR information students use for
              manual payments on SkilVira.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              settings.isActive
                ? "border-green-400/20 bg-green-400/10 text-green-300"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                settings.isActive
                  ? "bg-green-400"
                  : "bg-gray-400"
              }`}
            />

            {settings.isActive
              ? "Manual Payments Active"
              : "Manual Payments Inactive"}
          </div>
        </div>
      </section>

      {/* Alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          <FiCheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* QR */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <SectionHeader
          icon={<FiImage size={20} />}
          title="Payment QR Code"
          description="Upload the QR code students should scan for manual payment."
        />

        <div className="grid gap-6 p-5 lg:grid-cols-2 lg:p-6">
          {/* Current QR */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Current QR
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Active payment QR displayed to students.
                </p>
              </div>

              {settings.qrCode && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <FiCheckCircle size={13} />
                  Uploaded
                </span>
              )}
            </div>

            {settings.qrCode ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex justify-center">
                  <img
                    src={getFileUrl(
                      settings.qrCode
                    )}
                    alt="SkilVira Payment QR"
                    className="h-64 w-64 rounded-xl object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={getFileUrl(
                      settings.qrCode
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiEye size={16} />
                    View QR
                  </a>

                  <button
                    type="button"
                    onClick={removeQR}
                    disabled={removingQR}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiTrash2 size={16} />

                    {removingQR
                      ? "Removing..."
                      : "Remove QR"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[310px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <FiImage size={25} />
                  </div>

                  <p className="mt-4 font-semibold text-gray-800">
                    No QR code uploaded
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Students will not see a QR payment option until one is
                    uploaded.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-5">
              <p className="text-sm font-bold text-gray-900">
                Upload New QR
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Supported image formats: PNG, JPG, JPEG and WebP.
              </p>
            </div>

            <label
              htmlFor="payment-qr"
              className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiUpload size={21} />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                {qrFile
                  ? "QR image selected"
                  : "Choose QR image"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Click here to browse files.
              </p>

              <input
                id="payment-qr"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) =>
                  setQrFile(
                    event.target.files?.[0] ||
                      null
                  )
                }
                className="hidden"
              />
            </label>

            {qrFile && (
              <div className="mt-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Selected File
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                      {qrFile.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {(
                        qrFile.size /
                        1024
                      ).toFixed(1)}{" "}
                      KB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setQrFile(null)
                    }
                    className="text-lg font-bold text-gray-400 hover:text-red-500"
                    aria-label="Remove selected file"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={uploadQR}
              disabled={
                uploadingQR ||
                !qrFile
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingQR ? (
                <>
                  <FiRefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={17} />
                  Upload QR Code
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* UPI */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <SectionHeader
          icon={<FiCreditCard size={20} />}
          title="UPI Details"
          description="This UPI ID can be shown to students during manual payment."
        />

        <div className="p-5 sm:p-6">
          <div className="max-w-2xl">
            <label
              htmlFor="upiId"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              UPI ID
            </label>

            <div className="relative">
              <input
                id="upiId"
                name="upiId"
                value={settings.upiId}
                onChange={handleChange}
                placeholder="example@upi"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />

              {settings.upiId && (
                <button
                  type="button"
                  onClick={copyUPI}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#D4AF37]"
                  title="Copy UPI ID"
                >
                  <FiCopy size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bank */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <SectionHeader
          icon={<FiShield size={20} />}
          title="Bank Details"
          description="Bank information students may use for direct manual transfers."
        />

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <InputField
            label="Account Holder Name"
            name="accountHolderName"
            value={
              settings.accountHolderName
            }
            onChange={handleChange}
            placeholder="Enter account holder name"
          />

          <div>
            <label
              htmlFor="accountNumber"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Account Number
            </label>

            <div className="relative">
              <input
                id="accountNumber"
                name="accountNumber"
                type={
                  showAccountNumber
                    ? "text"
                    : "password"
                }
                value={
                  settings.accountNumber
                }
                onChange={handleChange}
                placeholder="Enter account number"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowAccountNumber(
                    (previous) =>
                      !previous
                  )
                }
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label={
                  showAccountNumber
                    ? "Hide account number"
                    : "Show account number"
                }
              >
                {showAccountNumber ? (
                  <FiEyeOff size={16} />
                ) : (
                  <FiEye size={16} />
                )}
              </button>
            </div>
          </div>

          <InputField
            label="IFSC Code"
            name="ifscCode"
            value={
              settings.ifscCode
            }
            onChange={handleChange}
            placeholder="SBIN0000000"
          />

          <InputField
            label="Bank Name"
            name="bankName"
            value={
              settings.bankName
            }
            onChange={handleChange}
            placeholder="Enter bank name"
          />

          <InputField
            label="Branch"
            name="branch"
            value={
              settings.branch
            }
            onChange={handleChange}
            placeholder="Enter branch name"
          />
        </div>
      </section>

      {/* Instructions */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <SectionHeader
          icon={<FiInfo size={20} />}
          title="Student Payment Instructions"
          description="Tell students exactly how to complete and submit a manual payment."
        />

        <div className="p-5 sm:p-6">
          <label
            htmlFor="paymentInstructions"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Instructions
          </label>

          <textarea
            id="paymentInstructions"
            name="paymentInstructions"
            value={
              settings.paymentInstructions
            }
            onChange={handleChange}
            rows={7}
            placeholder="Example: Pay the exact final amount, use the UPI ID or scan the QR code, and upload the payment screenshot with the transaction ID."
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
          />

          <p className="mt-2 text-xs text-gray-400">
            These instructions should be clear enough for a student to
            complete the payment without additional guidance.
          </p>
        </div>
      </section>

      {/* Activation */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <SectionHeader
          icon={<FiCheckCircle size={20} />}
          title="Manual Payment Availability"
          description="Control whether students can use the current manual payment configuration."
        />

        <div className="p-5 sm:p-6">
          <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  settings.isActive
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <FiCreditCard size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Accept manual payments
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {settings.isActive
                    ? "Manual payment details are currently active."
                    : "Manual payment details are currently disabled."}
                </p>
              </div>
            </div>

            <span className="relative shrink-0">
              <input
                type="checkbox"
                name="isActive"
                checked={
                  settings.isActive
                }
                onChange={handleChange}
                className="peer sr-only"
              />

              <span className="block h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-[#D4AF37]" />

              <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:left-6" />
            </span>
          </label>
        </div>
      </section>

      {/* Save */}
      <div className="sticky bottom-4 z-10">
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FiEdit3
              size={18}
              className="mt-0.5 shrink-0 text-[#D4AF37]"
            />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Save payment configuration
              </p>

              <p className="text-xs text-gray-500">
                Changes will affect the current manual payment information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiRefreshCw
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={17} />
                Save Payment Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// INPUT FIELD
// =====================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};

export default PaymentSettings;