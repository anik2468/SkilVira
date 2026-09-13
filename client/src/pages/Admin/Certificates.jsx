import { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiShield,
  FiUser,
} from "react-icons/fi";

import {
  getCertificates,
  verifyCertificate as verifyCertificateApi,
  rejectCertificate as rejectCertificateApi,
} from "../../services/certificateService";

const GOLD = "#D4AF37";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const [processingId, setProcessingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getCertificates();

      const list =
        data?.certificates ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setCertificates(
        Array.isArray(list) ? list : []
      );
    } catch (err) {
      console.error(
        "ADMIN CERTIFICATES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load certificates."
      );

      setCertificates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const verifyCertificate = async (id) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await verifyCertificateApi(id);

      setCertificates((prev) =>
        prev.map((item) =>
          item?._id === id
            ? {
                ...item,
                verified: true,
              }
            : item
        )
      );

      setSelectedCertificate((prev) =>
        prev?._id === id
          ? {
              ...prev,
              verified: true,
            }
          : prev
      );

      setSuccess(
        "Certificate verified successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "VERIFY CERTIFICATE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to verify certificate."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const rejectCertificate = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this certificate?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await rejectCertificateApi(id);

      setCertificates((prev) =>
        prev.filter(
          (item) => item?._id !== id
        )
      );

      setSelectedCertificate(null);

      setSuccess(
        "Certificate rejected successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "REJECT CERTIFICATE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject certificate."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const verified = certificates.filter(
      (item) => item?.verified === true
    ).length;

    const pending = certificates.filter(
      (item) => !item?.verified
    ).length;

    const withFiles = certificates.filter(
      (item) =>
        Boolean(
          item?.certificateFile ||
            item?.certificateUrl ||
            item?.credentialUrl
        )
    ).length;

    return {
      total: certificates.length,
      verified,
      pending,
      withFiles,
    };
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return certificates.filter(
      (item) => {
        const text = [
          item?.title,
          item?.issuer,
          item?.credentialId,
          item?.student?.name,
          item?.student?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          text.includes(query);

        const matchesStatus =
          filter === "All" ||
          (filter === "Verified" &&
            item?.verified === true) ||
          (filter === "Pending" &&
            item?.verified !== true);

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    certificates,
    search,
    filter,
  ]);

  if (loading) {
    return <CertificatesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShield
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Certificate Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Certificate Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Review certificate records, verify issued credentials
                and maintain trust across the SkilVira platform.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchCertificates(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw
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

        {/* =====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <section>
          <div className="mb-4">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Credential Overview
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
              Certificate health
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Certificates"
              value={stats.total}
              icon={<FiAward />}
              tone="gold"
            />

            <MetricCard
              label="Verified"
              value={stats.verified}
              icon={<FiCheckCircle />}
              tone="green"
            />

            <MetricCard
              label="Pending Review"
              value={stats.pending}
              icon={<FiClock />}
              tone="amber"
            />

            <MetricCard
              label="With Certificate File"
              value={stats.withFiles}
              icon={<FiFileText />}
              tone="blue"
            />
          </div>
        </section>

        {/* =====================================================
            VERIFICATION HEALTH
        ===================================================== */}

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Verification Health
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Credential verification
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Current balance between verified and certificates
                  waiting for review.
                </p>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiShield />
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  Verification rate
                </span>

                <span className="text-sm font-black text-gray-900">
                  {stats.total > 0
                    ? Math.round(
                        (stats.verified /
                          stats.total) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (stats.verified /
                                stats.total) *
                                100
                            )
                          )
                        : 0
                    }%`,
                    backgroundColor: GOLD,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <SummaryBox
                label="Verified"
                value={stats.verified}
              />

              <SummaryBox
                label="Pending"
                value={stats.pending}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Admin Responsibility
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Credential trust layer
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Verify certificate records before they are treated as
              trusted platform credentials.
            </p>

            <div className="mt-6 space-y-3">
              <TrustRow
                icon={<FiUser />}
                title="Student identity"
                description="Confirm the certificate belongs to the correct student."
              />

              <TrustRow
                icon={<FiAward />}
                title="Certificate details"
                description="Review title, issuer and credential information."
              />

              <TrustRow
                icon={<FiFileText />}
                title="Certificate document"
                description="Open the available certificate file before verification."
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-2xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student, certificate, issuer or credential ID..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Pending",
                "Verified",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFilter(item)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                    filter === item
                      ? "text-black"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={
                    filter === item
                      ? {
                          backgroundColor:
                            GOLD,
                        }
                      : undefined
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Credential Directory
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                Certificate records
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              {filteredCertificates.length} result
              {filteredCertificates.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredCertificates.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Student
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Certificate
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Issuer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Issue Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCertificates.map(
                    (item) => (
                      <CertificateRow
                        key={item?._id}
                        item={item}
                        processingId={
                          processingId
                        }
                        onView={() =>
                          setSelectedCertificate(
                            item
                          )
                        }
                        onVerify={
                          verifyCertificate
                        }
                        onReject={
                          rejectCertificate
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedCertificate && (
        <CertificateModal
          certificate={
            selectedCertificate
          }
          processingId={processingId}
          onClose={() =>
            setSelectedCertificate(
              null
            )
          }
          onVerify={
            verifyCertificate
          }
          onReject={
            rejectCertificate
          }
        />
      )}
    </div>
  );
};

/* =========================================================
   ROW
========================================================= */

const CertificateRow = ({
  item,
  processingId,
  onView,
  onVerify,
  onReject,
}) => {
  const student =
    item?.student || {};

  const title =
    item?.title ||
    "Certificate";

  const issuer =
    item?.issuer ||
    "Issuer unavailable";

  const verified =
    item?.verified === true;

  const file =
    item?.certificateFile ||
    item?.certificateUrl ||
    item?.credentialUrl ||
    "";

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-black"
            style={{
              backgroundColor: GOLD,
            }}
          >
            {getInitials(
              student?.name ||
                "Student"
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-900">
              {student?.name ||
                "Student"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {student?.email ||
                "Email unavailable"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="max-w-[260px] truncate text-sm font-black text-gray-800">
          {title}
        </p>

        {item?.credentialId && (
          <p className="mt-1 text-xs text-gray-500">
            ID: {item.credentialId}
          </p>
        )}
      </td>

      <td className="px-5 py-4">
        <p className="max-w-[200px] truncate text-sm font-semibold text-gray-600">
          {issuer}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-600">
          {formatDate(
            item?.issueDate ||
              item?.createdAt
          )}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          verified={verified}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
          >
            <FiEye />
            View
          </button>

          {file && (
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-blue-600"
            >
              <FiExternalLink />
              File
            </a>
          )}

          {!verified && (
            <button
              type="button"
              disabled={
                processingId ===
                item?._id
              }
              onClick={() =>
                onVerify(
                  item?._id
                )
              }
              className="rounded-xl px-3 py-2 text-xs font-black text-black disabled:opacity-50"
              style={{
                backgroundColor: GOLD,
              }}
            >
              Verify
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MODAL
========================================================= */

const CertificateModal = ({
  certificate,
  processingId,
  onClose,
  onVerify,
  onReject,
}) => {
  const student =
    certificate?.student || {};

  const verified =
    certificate?.verified === true;

  const file =
    certificate?.certificateFile ||
    certificate?.certificateUrl ||
    certificate?.credentialUrl ||
    "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiAward size={22} />
              </div>

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Certificate Review
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  {certificate?.title ||
                    "Certificate"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-500 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">

          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock
              title="Student"
              icon={<FiUsers />}
            >
              <DetailLine
                icon={<FiUser />}
                label="Name"
                value={
                  student?.name ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiFileText />}
                label="Email"
                value={
                  student?.email ||
                  "Not available"
                }
              />
            </InfoBlock>

            <InfoBlock
              title="Certificate"
              icon={<FiAward />}
            >
              <DetailLine
                icon={<FiAward />}
                label="Title"
                value={
                  certificate?.title ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiShield />}
                label="Issuer"
                value={
                  certificate?.issuer ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiCalendar />}
                label="Issue Date"
                value={formatDate(
                  certificate?.issueDate ||
                    certificate?.createdAt
                )}
              />
            </InfoBlock>
          </div>

          {certificate?.credentialId && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                Credential ID
              </p>

              <p className="mt-2 break-all text-lg font-black text-[#8D7414]">
                {certificate.credentialId}
              </p>
            </div>
          )}

          {certificate?.skills?.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-[#FAFAF8] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {certificate.skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {file && (
            <div className="rounded-3xl border border-gray-200 bg-black p-5 text-white sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.15em]"
                    style={{ color: GOLD }}
                  >
                    Certificate Document
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Open the available certificate file for review.
                  </p>
                </div>

                <a
                  href={file}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black text-black"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiExternalLink />
                  Open Certificate
                </a>
              </div>
            </div>
          )}

          <section className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">
                  Verification Status
                </p>

                <div className="mt-2">
                  <StatusBadge
                    verified={verified}
                  />
                </div>
              </div>

              {!verified && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      processingId ===
                      certificate?._id
                    }
                    onClick={() =>
                      onVerify(
                        certificate?._id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black text-black disabled:opacity-50"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    <FiCheckCircle />
                    Verify Certificate
                  </button>

                  <button
                    type="button"
                    disabled={
                      processingId ===
                      certificate?._id
                    }
                    onClick={() =>
                      onReject(
                        certificate?._id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
                  >
                    <FiXCircle />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    green:
      "bg-emerald-50 text-emerald-600",
    amber:
      "bg-amber-50 text-amber-600",
    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const SummaryBox = ({
  label,
  value,
}) => (
  <div className="rounded-2xl bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-2xl font-black text-gray-950">
      {value}
    </p>
  </div>
);

const TrustRow = ({
  icon,
  title,
  description,
}) => (
  <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      {icon}
    </div>

    <div>
      <p className="text-sm font-black text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  </div>
);

const StatusBadge = ({
  verified,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
      verified
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700"
    }`}
  >
    {verified ? (
      <FiCheckCircle />
    ) : (
      <FiClock />
    )}

    {verified
      ? "Verified"
      : "Pending"}
  </span>
);

const InfoBlock = ({
  title,
  icon,
  children,
}) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <h3 className="text-lg font-black text-gray-950">
        {title}
      </h3>
    </div>

    <div className="mt-4 space-y-3">
      {children}
    </div>
  </section>
);

const DetailLine = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 rounded-xl bg-[#FAFAF8] p-3">
    <span
      className="mt-0.5"
      style={{ color: GOLD }}
    >
      {icon}
    </span>

    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  </div>
);

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="px-6 py-16 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      <FiAward size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Certificates"
        : "No Certificates Found"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or verification filter."
        : "Certificate records will appear here when they are generated."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const CertificatesSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-3xl bg-white" />
        <div className="h-80 rounded-3xl bg-gray-900" />
      </div>

      <div className="h-20 rounded-3xl bg-white" />
      <div className="h-[520px] rounded-3xl bg-white" />
    </div>
  </div>
);

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "U";
  }

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default Certificates;