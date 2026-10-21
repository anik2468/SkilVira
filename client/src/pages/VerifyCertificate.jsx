import { API_ORIGIN } from "../services/urlConfig.js";
import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiShield,
  FiBookOpen,
  FiCalendar,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  API_ORIGIN;

const VerifyCertificate = () => {
  const {
    credentialId,
  } = useParams();

  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    verify();
  }, [credentialId]);

  const verify = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } =
        await api.get(
          `/generated-certificates/verify/${encodeURIComponent(
            credentialId
          )}`
        );

      setCertificate(
        data?.certificate ||
          null
      );
    } catch (err) {
      console.error(
        "PUBLIC CERTIFICATE VERIFY ERROR:",
        err
      );

      setCertificate(null);

      setError(
        err?.response?.data?.message ||
          "Certificate could not be verified."
      );
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (
    file
  ) => {
    if (!file) return "";

    if (
      file.startsWith(
        "http://"
      ) ||
      file.startsWith(
        "https://"
      )
    ) {
      return file;
    }

    return `${API_BASE}${file}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F6] px-5">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiShield
              size={30}
              className="animate-pulse"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Verifying Certificate
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Checking this certificate against
            SkilVira records...
          </p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F6] px-5">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-100 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FiXCircle
              size={32}
            />
          </div>

          <h1 className="mt-5 text-3xl font-black text-gray-900">
            Certificate Not Verified
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            {error ||
              "This certificate does not exist or has not been verified by SkilVira."}
          </p>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Certificate ID
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-gray-800">
              {credentialId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data =
    certificate.data || {};

  const program =
    data.courseName ||
    certificate.course
      ?.title ||
    certificate.internship
      ?.title ||
    "SkilVira Program";

  const studentName =
    data.studentName ||
    certificate.student
      ?.name ||
    "Student";

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiAward size={31} />
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#9A7810]">
            SkilVira Certificate Verification
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
            Certificate Verified
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This credential has been successfully
            verified against SkilVira records.
          </p>
        </div>

        {/* VERIFIED BAR */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FiCheckCircle
              size={24}
              className="text-emerald-600"
            />

            <div>
              <p className="font-black text-emerald-800">
                VERIFIED & VALID
              </p>

              <p className="mt-0.5 text-xs text-emerald-700">
                Issued by SkilVira
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-sm">
            {certificate.certificateId}
          </div>
        </div>

        {/* CARD */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">

          {/* STUDENT */}

          <div className="border-b border-gray-100 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Certificate Holder
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900">
              {studentName}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <FiBookOpen />
              {program}
            </p>
          </div>

          {/* DETAILS */}

          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <Detail
                label="Certificate ID"
                value={
                  certificate.certificateId
                }
                icon={
                  <FiShield />
                }
              />

              <Detail
                label="Marks"
                value={
                  data.marks ||
                  "Not specified"
                }
                icon={
                  <FiBarChart2 />
                }
              />

              <Detail
                label="Grade"
                value={
                  data.grade ||
                  "Not specified"
                }
                icon={
                  <FiAward />
                }
              />

              <Detail
                label="Attendance"
                value={
                  data.attendance ||
                  "Not specified"
                }
                icon={
                  <FiCheckCircle />
                }
              />

              <Detail
                label="Duration"
                value={
                  data.duration ||
                  "Not specified"
                }
                icon={
                  <FiClock />
                }
              />

              <Detail
                label="Issue Date"
                value={
                  data.issueDate ||
                  "Not specified"
                }
                icon={
                  <FiCalendar />
                }
              />

            </div>

            {/* PERFORMANCE */}

            {data.performance && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                  Performance
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {data.performance}
                </p>
              </div>
            )}

            {/* FEEDBACK */}

            {data.feedback && (
              <div className="mt-4 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                  Feedback
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {data.feedback}
                </p>
              </div>
            )}

            {/* DOWNLOAD */}

            {certificate.certificateFile && (
              <a
                href={getFileUrl(
                  certificate.certificateFile
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#c29f32]"
              >
                <FiDownload
                  size={17}
                />
                View Official Certificate
              </a>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Verification provided by SkilVira.
            This page can be accessed directly by
            scanning the QR code printed on the certificate.
          </p>
        </div>
      </div>
    </div>
  );
};

const Detail = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
    <div className="flex items-center gap-2 text-[#D4AF37]">
      {icon}

      <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </span>
    </div>

    <p className="mt-2 break-words text-sm font-black text-gray-900">
      {value}
    </p>
  </div>
);

export default VerifyCertificate;