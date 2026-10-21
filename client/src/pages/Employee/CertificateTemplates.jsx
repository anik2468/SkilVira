import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiUpload,
  FiTrash2,
  FiEdit3,
  FiFileText,
  FiRefreshCw,
  FiMapPin,
  FiMaximize,
  FiCheckCircle,
  FiEye,
  FiX,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(
    /\/api\/?$/,
    ""
  ) || API_ORIGIN;

// =====================================================
// DEFAULT FIELDS
// =====================================================

const DEFAULT_FIELDS = {
  studentName: true,
  courseName: true,
  marks: false,
  grade: false,
  duration: true,
  attendance: false,
  performance: false,
  feedback: false,
  issueDate: true,
  certificateId: true,
  qrCode: true,
};

// =====================================================
// DEFAULT POSITIONS
// =====================================================

const DEFAULT_POSITIONS = {
  studentName: {
    x: 0,
    y: 0,
  },

  courseName: {
    x: 0,
    y: 0,
  },

  marks: {
    x: 0,
    y: 0,
  },

  grade: {
    x: 0,
    y: 0,
  },

  duration: {
    x: 0,
    y: 0,
  },

  attendance: {
    x: 0,
    y: 0,
  },

  performance: {
    x: 0,
    y: 0,
  },

  feedback: {
    x: 0,
    y: 0,
  },

  issueDate: {
    x: 0,
    y: 0,
  },

  certificateId: {
    x: 0,
    y: 0,
  },

  qrCode: {
    x: 0,
    y: 0,
    width: 120,
    height: 120,
  },
};

// =====================================================
// EMPTY FORM
// =====================================================

const createEmptyForm = () => ({
  name: "",
  category: "certificate",
  type: "course",
  courseId: "",

  requiresApproval: true,

  fields: {
    ...DEFAULT_FIELDS,
  },

  positions: {
    ...DEFAULT_POSITIONS,

    qrCode: {
      ...DEFAULT_POSITIONS.qrCode,
    },
  },

  file: null,
});

// =====================================================
// COMPONENT
// =====================================================

const CertificateTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [courses, setCourses] = useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState(
    createEmptyForm()
  );

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [previewTemplate, setPreviewTemplate] =
    useState(null);

  const [search, setSearch] =
    useState("");

  // =====================================================
  // FETCH
  // =====================================================

  const fetchData = async () => {
    try {
      setFetching(true);

      const [
        templateRes,
        courseRes,
      ] = await Promise.all([
        api.get("/certificate-templates"),
        api.get("/courses"),
      ]);

      setTemplates(
        templateRes?.data?.templates || []
      );

      setCourses(
        courseRes?.data?.courses ||
          courseRes?.data?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to load certificate template data:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load certificate templates."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  // =====================================================
  // START CREATE
  // =====================================================

  const startCreate = () => {
    resetForm();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Enter template name.");
      return;
    }

    if (!editingId && !form.file) {
      alert(
        "Please upload a certificate template."
      );
      return;
    }

    if (
      form.type === "course" &&
      !form.courseId
    ) {
      alert(
        "Please select a course."
      );
      return;
    }

    const enabledFieldsCount =
      Object.values(form.fields).filter(
        Boolean
      ).length;

    if (enabledFieldsCount === 0) {
      alert(
        "Please enable at least one dynamic field."
      );
      return;
    }

    if (
      form.fields.qrCode &&
      (!isValidNumber(
        form.positions.qrCode.x
      ) ||
        !isValidNumber(
          form.positions.qrCode.y
        ) ||
        !isValidNumber(
          form.positions.qrCode.width
        ) ||
        !isValidNumber(
          form.positions.qrCode.height
        ))
    ) {
      alert(
        "Please enter valid QR position and size values."
      );
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "type",
        form.type
      );

      if (form.courseId) {
        formData.append(
          "courseId",
          form.courseId
        );
      }

      formData.append(
        "requiresApproval",
        String(
          form.requiresApproval
        )
      );

      formData.append(
        "fields",
        JSON.stringify(
          form.fields
        )
      );

      formData.append(
        "positions",
        JSON.stringify(
          form.positions
        )
      );

      if (form.file) {
        formData.append(
          "certificateTemplate",
          form.file
        );
      }

      if (editingId) {
        await api.put(
          `/certificate-templates/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      } else {
        await api.post(
          "/certificate-templates",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      const wasEditing =
        Boolean(editingId);

      resetForm();

      await fetchData();

      alert(
        wasEditing
          ? "Certificate template updated successfully."
          : "Certificate template saved successfully."
      );
    } catch (error) {
      console.error(
        "Save certificate template error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save certificate template."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT TEMPLATE
  // =====================================================

  const editTemplate = (template) => {
    const templatePositions = {
      ...DEFAULT_POSITIONS,
      ...(template?.positions || {}),

      qrCode: {
        ...DEFAULT_POSITIONS.qrCode,
        ...(template?.positions?.qrCode ||
          {}),
      },
    };

    setEditingId(
      template?._id || null
    );

    setForm({
      name: template?.name || "",

      category:
        template?.category ||
        "certificate",

      type:
        template?.type ||
        "course",

      courseId:
        template?.courseId?._id ||
        template?.courseId ||
        "",

      requiresApproval:
        template?.requiresApproval !==
        false,

      fields: {
        ...DEFAULT_FIELDS,
        ...(template?.fields || {}),
      },

      positions:
        templatePositions,

      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE / DEACTIVATE
  // =====================================================

  const deleteTemplate = async (id) => {
    const confirmed =
      window.confirm(
        "Deactivate this certificate template?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(
        `/certificate-templates/${id}`
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchData();

      alert(
        "Certificate template deactivated successfully."
      );
    } catch (error) {
      console.error(
        "Delete template error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to deactivate template."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FIELD TOGGLE
  // =====================================================

  const toggleField = (key) => {
    setForm((previous) => ({
      ...previous,

      fields: {
        ...previous.fields,

        [key]:
          !previous.fields[key],
      },
    }));
  };

  // =====================================================
  // POSITION CHANGE
  // =====================================================

  const handlePositionChange = (
    key,
    field,
    value
  ) => {
    const numericValue =
      value === ""
        ? ""
        : Number(value);

    setForm((previous) => ({
      ...previous,

      positions: {
        ...previous.positions,

        [key]: {
          ...previous.positions[key],

          [field]:
            numericValue,
        },
      },
    }));
  };

  // =====================================================
  // QR CHANGE
  // =====================================================

  const handleQRChange = (
    field,
    value
  ) => {
    const numericValue =
      value === ""
        ? ""
        : Number(value);

    setForm((previous) => ({
      ...previous,

      positions: {
        ...previous.positions,

        qrCode: {
          ...previous.positions.qrCode,

          [field]:
            numericValue,
        },
      },
    }));
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (event) => {
    const selected =
      event.target.files?.[0] ||
      null;

    if (!selected) {
      setForm((previous) => ({
        ...previous,
        file: null,
      }));

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (
      selected.type &&
      !allowedTypes.includes(
        selected.type
      )
    ) {
      alert(
        "Only PDF, PNG, JPG, JPEG and WEBP files are allowed."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      15 * 1024 * 1024;

    if (selected.size > maxSize) {
      alert(
        "Template file must be 15 MB or smaller."
      );

      event.target.value = "";

      return;
    }

    setForm((previous) => ({
      ...previous,
      file: selected,
    }));
  };

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (file) => {
    if (!file) {
      return "";
    }

    let value = file;

    if (
      typeof file === "object"
    ) {
      value =
        file?.url ||
        file?.path ||
        file?.location ||
        file?.secure_url ||
        "";
    }

    if (!value) {
      return "";
    }

    if (
      value.startsWith(
        "http://"
      ) ||
      value.startsWith(
        "https://"
      )
    ) {
      return value;
    }

    return `${API_BASE}${
      value.startsWith("/")
        ? ""
        : "/"
    }${value}`;
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTemplates = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return templates;
    }

    return templates.filter(
      (template) => {
        const name =
          template?.name || "";

        const type =
          template?.type || "";

        const courseName =
          template?.courseId?.title ||
          "";

        const category =
          template?.category || "";

        const searchable = [
          name,
          type,
          courseName,
          category,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          keyword
        );
      }
    );
  }, [templates, search]);

  // =====================================================
  // FILE TYPE
  // =====================================================

  const isPdf = (file) => {
    const value =
      typeof file === "string"
        ? file
        : file?.url ||
          file?.path ||
          "";

    return /\.pdf(\?.*)?$/i.test(
      value || ""
    );
  };

  // =====================================================
  // FIELD LABELS
  // =====================================================

  const fieldLabels = {
    studentName: "Student Name",
    courseName: "Course Name",
    marks: "Marks",
    grade: "Grade",
    duration: "Duration",
    attendance: "Attendance",
    performance: "Performance",
    feedback: "Feedback",
    issueDate: "Issue Date",
    certificateId:
      "Certificate ID",
    qrCode: "QR Code",
  };

  // =====================================================
  // TYPE LABEL
  // =====================================================

  const typeLabels = {
    course: "Course",
    internship: "Internship",
    achievement: "Achievement",
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-gray-900 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-bold text-[#9A7810]">
              <FiFileText size={13} />

              Certificate Operations
            </div>

            <h1 className="text-3xl font-black text-slate-900">
              Certificate Templates
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Upload certificate templates and configure
              dynamic fields, QR placement and QR size for
              each individual template.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={fetching}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <FiRefreshCw
                size={16}
                className={
                  fetching
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            {!editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#c29f32]"
              >
                <FiUpload size={16} />

                Add Template
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================== */}

        <form
          onSubmit={submit}
          className="mb-10 overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/5"
        >
          <div className="border-b border-[#D4AF37]/20 px-6 py-5">
            <h2 className="text-xl font-black text-slate-900">
              {editingId
                ? "Edit Certificate Template"
                : "Add Certificate Template"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure the template once. All certificates
              generated from it will use these settings.
            </p>
          </div>

          <div className="p-6">
            {/* BASIC */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Template Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target
                        .value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                  placeholder="Course Completion Certificate"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Type
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      type: event.target
                        .value,
                      courseId: "",
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
                >
                  <option value="course">
                    Course
                  </option>

                  <option value="internship">
                    Internship
                  </option>

                  <option value="achievement">
                    Achievement
                  </option>
                </select>
              </div>

              {/* COURSE */}
              {form.type === "course" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Course
                  </label>

                  <select
                    value={form.courseId}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        courseId:
                          event.target
                            .value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course._id}
                          value={
                            course._id
                          }
                        >
                          {course.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category:
                        event.target
                          .value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
                >
                  <option value="certificate">
                    Certificate
                  </option>

                  <option value="report">
                    Report
                  </option>
                </select>
              </div>

              {/* FILE */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Template File
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#D4AF37]/60 bg-white px-4 py-3 transition hover:bg-[#D4AF37]/5">
                  <FiUpload className="shrink-0 text-[#D4AF37]" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-700">
                      {form.file
                        ? form.file.name
                        : editingId
                        ? "Upload new file (optional)"
                        : "Upload PDF / Image"}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      PDF, PNG, JPG, JPEG or WEBP
                      • Max 15 MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={
                      handleFileChange
                    }
                  />
                </label>

                {editingId &&
                  !form.file &&
                  getTemplateFileForEdit(
                    templates,
                    editingId
                  ) && (
                    <p className="mt-2 text-xs text-gray-500">
                      Existing template will be retained
                      unless a new file is selected.
                    </p>
                  )}
              </div>
            </div>

            {/* DYNAMIC FIELDS */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-4">
                <h3 className="font-black text-gray-900">
                  Dynamic Fields
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Select which information should be generated
                  on certificates using this template.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.keys(
                  fieldLabels
                ).map((key) => {
                  const enabled =
                    !!form.fields[key];

                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                        enabled
                          ? "border-[#D4AF37] bg-[#FFF8E7]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          enabled
                        }
                        onChange={() =>
                          toggleField(
                            key
                          )
                        }
                        className="accent-[#D4AF37]"
                      />

                      <span className="text-sm font-medium">
                        {fieldLabels[key]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* QR CONFIGURATION */}
            <div className="mt-6 rounded-2xl border border-[#D4AF37]/30 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle
                      className="text-[#D4AF37]"
                      size={19}
                    />

                    <h3 className="font-black text-gray-900">
                      QR Code Configuration
                    </h3>
                  </div>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
                    Set the QR location and size for this
                    certificate template. Every generated
                    certificate using this template will use
                    these values automatically.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-semibold text-[#8D7010]">
                  <input
                    type="checkbox"
                    checked={
                      !!form.fields.qrCode
                    }
                    onChange={() =>
                      toggleField(
                        "qrCode"
                      )
                    }
                    className="accent-[#D4AF37]"
                  />

                  Enable QR Code
                </label>
              </div>

              {form.fields.qrCode && (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <QRInput
                      label="X Position"
                      icon={
                        <FiMapPin
                          size={15}
                        />
                      }
                      value={
                        form.positions
                          .qrCode.x
                      }
                      onChange={(value) =>
                        handleQRChange(
                          "x",
                          value
                        )
                      }
                      placeholder="820"
                    />

                    <QRInput
                      label="Y Position"
                      icon={
                        <FiMapPin
                          size={15}
                        />
                      }
                      value={
                        form.positions
                          .qrCode.y
                      }
                      onChange={(value) =>
                        handleQRChange(
                          "y",
                          value
                        )
                      }
                      placeholder="520"
                    />

                    <QRInput
                      label="Width"
                      icon={
                        <FiMaximize
                          size={15}
                        />
                      }
                      value={
                        form.positions
                          .qrCode
                          .width
                      }
                      onChange={(value) =>
                        handleQRChange(
                          "width",
                          value
                        )
                      }
                      placeholder="120"
                    />

                    <QRInput
                      label="Height"
                      icon={
                        <FiMaximize
                          size={15}
                        />
                      }
                      value={
                        form.positions
                          .qrCode
                          .height
                      }
                      onChange={(value) =>
                        handleQRChange(
                          "height",
                          value
                        )
                      }
                      placeholder="120"
                    />
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-[10px] font-bold text-gray-400">
                      QR
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        QR placement saved per template
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        X:{" "}
                        {form.positions
                          .qrCode.x ||
                          0}
                        {"  "}
                        Y:{" "}
                        {form.positions
                          .qrCode.y ||
                          0}
                        {"  "}
                        Width:{" "}
                        {form.positions
                          .qrCode
                          .width ||
                          120}
                        {"  "}
                        Height:{" "}
                        {form.positions
                          .qrCode
                          .height ||
                          120}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        The website will generate the QR
                        automatically using the public
                        certificate verification URL.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* APPROVAL */}
            <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <input
                type="checkbox"
                checked={
                  form.requiresApproval
                }
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    requiresApproval:
                      event.target
                        .checked,
                  }))
                }
                className="h-5 w-5 accent-[#D4AF37]"
              />

              <div>
                <p className="font-semibold text-gray-900">
                  Employee approval required
                </p>

                <p className="text-sm text-gray-500">
                  Generated certificates remain pending
                  until an employee approves them.
                </p>
              </div>
            </label>

            {/* BUTTONS */}
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <FiRefreshCw
                    size={16}
                    className="animate-spin"
                  />
                )}

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Template"
                  : "Save Template"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* =================================================
            SEARCH + LIST HEADER
        ================================================== */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Saved Templates
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Each template keeps its own QR configuration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search templates..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] sm:w-64"
            />

            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
              {filteredTemplates.length}{" "}
              Template
              {filteredTemplates.length ===
              1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        {/* =================================================
            TEMPLATE LIST
        ================================================== */}

        {filteredTemplates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <FiFileText
              size={35}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              {search
                ? "No matching templates"
                : "No certificate templates"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try another search term."
                : "Upload your first certificate template above."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={startCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white"
              >
                <FiUpload />

                Add Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(
              (template) => {
                const qr =
                  template?.positions
                    ?.qrCode || {};

                const qrEnabled =
                  template?.fields
                    ?.qrCode !== false;

                const fileUrl =
                  getFileUrl(
                    template?.templateFile
                  );

                const assignedCourse =
                  template?.courseId
                    ?.title ||
                  "General Template";

                return (
                  <div
                    key={template._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* TOP */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <FiFileText
                          size={22}
                        />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold capitalize text-[#9A7810]">
                          {typeLabels[
                            template.type
                          ] ||
                            template.type ||
                            "Template"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            template.isActive !==
                            false
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {template.isActive !==
                          false
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* NAME */}
                    <h3 className="font-bold text-gray-900">
                      {template.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {assignedCourse}
                    </p>

                    {/* APPROVAL */}
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Approval
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            template.requiresApproval !==
                            false
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {template.requiresApproval !==
                          false
                            ? "Required"
                            : "Disabled"}
                        </span>
                      </div>
                    </div>

                    {/* QR INFO */}
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          QR Code
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            qrEnabled
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {qrEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>

                      {qrEnabled && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <QRInfo
                            label="X"
                            value={
                              qr.x ?? 0
                            }
                          />

                          <QRInfo
                            label="Y"
                            value={
                              qr.y ?? 0
                            }
                          />

                          <QRInfo
                            label="Width"
                            value={
                              qr.width ??
                              120
                            }
                          />

                          <QRInfo
                            label="Height"
                            value={
                              qr.height ??
                              120
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* FIELDS */}
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Dynamic Fields
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(
                          template?.fields ||
                            {}
                        )
                          .filter(
                            ([, enabled]) =>
                              enabled
                          )
                          .map(
                            ([field]) => (
                              <span
                                key={field}
                                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600"
                              >
                                {fieldLabels[
                                  field
                                ] ||
                                  formatField(
                                    field
                                  )}
                              </span>
                            )
                          )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {fileUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTemplate(
                              template
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          <FiEye />

                          Preview
                        </button>
                      )}

                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          <FiFileText />

                          Open
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          editTemplate(
                            template
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 px-3 py-2.5 text-sm font-semibold text-[#9A7810] transition hover:bg-[#D4AF37]/5"
                      >
                        <FiEdit3 />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTemplate(
                            template._id
                          )
                        }
                        className="rounded-xl border border-red-200 px-3 py-2.5 text-red-500 transition hover:bg-red-50"
                        title="Deactivate"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =================================================
          PREVIEW MODAL
      ================================================== */}

      {previewTemplate && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() =>
            setPreviewTemplate(null)
          }
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {previewTemplate.name}
                </h2>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  {typeLabels[
                    previewTemplate.type
                  ] ||
                    previewTemplate.type ||
                    "Template"}
                  {" • "}
                  {previewTemplate
                    .courseId?.title ||
                    "General Template"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(
                    null
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {getFileUrl(
                previewTemplate.templateFile
              ) ? (
                isPdf(
                  previewTemplate.templateFile
                ) ? (
                  <iframe
                    title="Certificate Template Preview"
                    src={getFileUrl(
                      previewTemplate.templateFile
                    )}
                    className="h-[78vh] w-full rounded-2xl bg-white"
                  />
                ) : (
                  <div className="flex min-h-[75vh] items-center justify-center rounded-2xl bg-white p-6">
                    <img
                      src={getFileUrl(
                        previewTemplate.templateFile
                      )}
                      alt={
                        previewTemplate.name
                      }
                      className="max-h-[75vh] max-w-full object-contain"
                    />
                  </div>
                )
              ) : (
                <div className="flex min-h-[75vh] items-center justify-center rounded-2xl bg-white">
                  <p className="text-sm font-semibold text-gray-500">
                    Template preview is not
                    available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// QR INPUT
// =====================================================

const QRInput = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        {icon}

        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};

// =====================================================
// QR INFO
// =====================================================

const QRInfo = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-lg bg-white p-2.5 ring-1 ring-gray-100">
      <p className="text-[10px] font-bold uppercase text-gray-400">
        {label}
      </p>

      <p className="mt-0.5 font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
};

// =====================================================
// HELPERS
// =====================================================

const isValidNumber = (value) => {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
};

const formatField = (field) => {
  return String(field)
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );
};

const getTemplateFileForEdit = (
  templates,
  id
) => {
  const template = templates.find(
    (item) =>
      item?._id === id
  );

  return template?.templateFile || "";
};

export default CertificateTemplates;