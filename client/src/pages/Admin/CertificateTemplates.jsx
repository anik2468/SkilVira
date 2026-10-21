import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createCertificateTemplate,
  getCertificateTemplates,
  deleteCertificateTemplate,
} from "../../services/certificateTemplateService";

const GOLD = "#D4AF37";

const CertificateTemplates = () => {
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    name: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getCertificateTemplates();

      const list =
        data?.templates ||
        data?.data ||
        (Array.isArray(data)
          ? data
          : []);

      setTemplates(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "CERTIFICATE TEMPLATES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load certificate templates."
      );

      setTemplates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFile = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowed =
      file.type.startsWith("image/") ||
      file.type === "application/pdf";

    if (!allowed) {
      setError(
        "Please select an image or PDF template."
      );
      e.target.value = "";
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Template file must be smaller than 10 MB."
      );
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      file,
    }));

    setError("");
    setSuccess("");
  };

  const submitTemplate = async () => {
    if (!form.name.trim()) {
      setError(
        "Please enter a template name."
      );
      return;
    }

    if (!form.file) {
      setError(
        "Please select a certificate template file."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      /*
       * Current service expects the uploaded
       * certificate template field.
       */
      formData.append(
        "certificate",
        form.file
      );

      await createCertificateTemplate(
        formData
      );

      setForm({
        name: "",
        file: null,
      });

      setSuccess(
        "Certificate template uploaded successfully."
      );

      await loadTemplates();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "UPLOAD CERTIFICATE TEMPLATE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Template upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeTemplate = async (id) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Delete this certificate template?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteCertificateTemplate(
        id
      );

      setTemplates((prev) =>
        prev.filter(
          (item) =>
            item?._id !== id
        )
      );

      setSuccess(
        "Certificate template deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "DELETE CERTIFICATE TEMPLATE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete template."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const active = templates.filter(
      (item) =>
        item?.isActive !== false
    ).length;

    const inactive = templates.filter(
      (item) =>
        item?.isActive === false
    ).length;

    const files = templates.filter(
      (item) =>
        Boolean(
          item?.templateFile ||
            item?.file ||
            item?.url
        )
    ).length;

    return {
      total: templates.length,
      active,
      inactive,
      files,
    };
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return templates.filter(
      (template) => {
        const text = [
          template?.name,
          template?.type,
          template?.templateFile,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          text.includes(query);

        const matchesFilter =
          filter === "All" ||
          (filter === "Active" &&
            template?.isActive !== false) ||
          (filter === "Inactive" &&
            template?.isActive === false);

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    templates,
    search,
    filter,
  ]);

  if (loading) {
    return <TemplatesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiAward
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Credential Design System
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Certificate Templates
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Upload and maintain the official certificate designs
                used across the SkilVira credential system.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadTemplates(true)
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

        {/* ALERTS */}
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

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Templates"
            value={stats.total}
            icon={<FiAward />}
            tone="gold"
          />

          <MetricCard
            label="Active"
            value={stats.active}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <MetricCard
            label="Inactive"
            value={stats.inactive}
            icon={<FiClock />}
            tone="amber"
          />

          <MetricCard
            label="Files Available"
            value={stats.files}
            icon={<FiFileText />}
            tone="blue"
          />
        </div>

        {/* UPLOAD */}
        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Template Studio
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Upload New Certificate Design
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Add the official image or PDF file that will be used by
              the certificate workflow.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <label className="mb-2 block text-sm font-black text-gray-800">
                Template Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g. SkilVira Course Certificate 2026"
                className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />

              <div className="mt-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
                <div className="flex items-start gap-3">
                  <FiAward
                    className="mt-0.5 shrink-0"
                    style={{ color: GOLD }}
                  />

                  <div>
                    <p className="text-sm font-black text-gray-900">
                      Template guidelines
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Use a high-quality final design. The uploaded
                      file becomes part of the certificate generation
                      workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-gray-800">
                Certificate Template File
              </label>

              <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] p-6 text-center transition hover:border-[#D4AF37]/50 hover:bg-white">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiUpload size={25} />
                </div>

                <p className="mt-4 text-sm font-black text-gray-900">
                  {form.file
                    ? form.file.name
                    : "Choose certificate template"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP or PDF · Max 10 MB
                </p>

                <span className="mt-4 inline-flex rounded-xl bg-black px-4 py-2.5 text-xs font-black text-white">
                  {form.file
                    ? "Change File"
                    : "Browse Files"}
                </span>

                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFile}
                />
              </label>

              {form.file && (
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FiFileText
                      style={{ color: GOLD }}
                    />

                    <p className="truncate text-sm font-bold text-gray-700">
                      {form.file.name}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-gray-400">
                    {formatBytes(
                      form.file.size
                    )}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={submitTemplate}
                disabled={uploading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiUpload />

                {uploading
                  ? "Uploading Template..."
                  : "Save Certificate Template"}
              </button>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search certificate templates..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex gap-2">
              {[
                "All",
                "Active",
                "Inactive",
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
                          backgroundColor: GOLD,
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

        {/* EXISTING */}
        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Certificate Library
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Existing Templates
              </h2>
            </div>

            <span className="text-sm font-semibold text-gray-500">
              {filteredTemplates.length} result
              {filteredTemplates.length !==
              1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredTemplates.length ===
          0 ? (
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
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map(
                (template) => (
                  <TemplateCard
                    key={template?._id}
                    template={template}
                    deletingId={
                      deletingId
                    }
                    onDelete={
                      removeTemplate
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const TemplateCard = ({
  template,
  deletingId,
  onDelete,
}) => {
  const file =
    template?.templateFile ||
    template?.file ||
    template?.url ||
    "";

  const active =
    template?.isActive !== false;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#FCFCFA]">
      <div className="flex h-40 items-center justify-center bg-black">
        {file &&
        isImageFile(file) ? (
          <img
            src={getAssetUrl(file)}
            alt={
              template?.name ||
              "Certificate template"
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center">
            <FiAward
              className="mx-auto"
              size={36}
              style={{ color: GOLD }}
            />

            <p className="mt-2 text-xs font-black uppercase tracking-wide text-gray-400">
              Certificate Template
            </p>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-gray-950">
              {template?.name ||
                "Unnamed Template"}
            </h3>

            {template?.type && (
              <p className="mt-1 text-xs font-semibold text-gray-500">
                Type:{" "}
                {template.type}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${
              active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-gray-100 text-gray-600"
            }`}
          >
            {active
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 break-all text-xs leading-5 text-gray-500">
          {file ||
            "Template file unavailable"}
        </p>

        <div className="mt-5 flex gap-2">
          {file && (
            <a
              href={getAssetUrl(file)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
            >
              <FiEye />
              Preview
            </a>
          )}

          <button
            type="button"
            disabled={
              deletingId ===
              template?._id
            }
            onClick={() =>
              onDelete(
                template?._id
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
          >
            <FiTrash2 />
            {deletingId ===
            template?._id
              ? "..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <FiAward
      className="mx-auto text-gray-300"
      size={34}
    />

    <h3 className="mt-4 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Templates"
        : "No Templates Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or filter."
        : "Upload your first certificate design to start the credential library."}
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

const TemplatesSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1500px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-96 rounded-[30px] bg-white" />
      <div className="h-20 rounded-3xl bg-white" />
      <div className="h-[500px] rounded-[30px] bg-white" />
    </div>
  </div>
);

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index ? 1 : 0)} ${
    units[index] || "B"
  }`;
};

const isImageFile = (
  value = ""
) => {
  const clean =
    String(value)
      .split("?")[0]
      .toLowerCase();

  return [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
  ].some((ext) =>
    clean.endsWith(ext)
  );
};

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
};

export default CertificateTemplates;