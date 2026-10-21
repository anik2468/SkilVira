import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiCheck,
  FiEdit3,
  FiFileText,
  FiRefreshCw,
  FiTrash2,
  FiUpload,
  FiX,
  FiEye,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  API_ORIGIN;

const DEFAULT_FIELDS = {
  studentName: true,
  role: true,
  companyName: true,
  duration: true,
  joiningDate: true,
  endDate: false,
  stipend: true,
  location: false,
  workMode: false,
  offerId: true,
  issueDate: true,
  reportingManager: false,
  qrCode: true,
};

const INITIAL_FORM = {
  name: "",
  type: "internship",
  courseId: "",
  internshipId: "",
  requiresApproval: true,
  fields: {
    ...DEFAULT_FIELDS,
  },
};

const OfferLetterTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [internships, setInternships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [previewTemplate, setPreviewTemplate] =
    useState(null);

  const [editingTemplate, setEditingTemplate] =
    useState(null);

  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    fields: {
      ...DEFAULT_FIELDS,
    },
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [
        templatesResponse,
        coursesResponse,
        internshipsResponse,
      ] = await Promise.all([
        api.get("/offer-letter-templates"),
        api.get("/courses"),
        api.get("/internships"),
      ]);

      setTemplates(
        templatesResponse.data?.templates || []
      );

      setCourses(
        coursesResponse.data?.courses ||
          coursesResponse.data?.data ||
          []
      );

      setInternships(
        internshipsResponse.data?.internships ||
          internshipsResponse.data?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Load offer letter templates error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load offer letter templates."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM RESET
  // =====================================================

  const resetForm = () => {
    setForm({
      ...INITIAL_FORM,
      fields: {
        ...DEFAULT_FIELDS,
      },
    });

    setFile(null);
    setEditingTemplate(null);
  };

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "type") {
      setForm((previous) => ({
        ...previous,
        type: value,
        courseId: "",
        internshipId: "",
      }));
    }
  };

  // =====================================================
  // FIELD TOGGLE
  // =====================================================

  const toggleField = (field) => {
    setForm((previous) => ({
      ...previous,
      fields: {
        ...previous.fields,
        [field]: !previous.fields[field],
      },
    }));
  };

  // =====================================================
  // CREATE
  // =====================================================

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const openEdit = (template) => {
    setEditingTemplate(template);
    setFile(null);

    setForm({
      name: template?.name || "",

      type:
        template?.type ||
        "internship",

      courseId:
        template?.courseId?._id ||
        template?.courseId ||
        "",

      internshipId:
        template?.internshipId?._id ||
        template?.internshipId ||
        "",

      requiresApproval:
        template?.requiresApproval !== false,

      fields: {
        studentName:
          template?.fields?.studentName !== false,

        role:
          template?.fields?.role !== false,

        companyName:
          template?.fields?.companyName !== false,

        duration:
          template?.fields?.duration !== false,

        joiningDate:
          template?.fields?.joiningDate !== false,

        endDate:
          template?.fields?.endDate === true,

        stipend:
          template?.fields?.stipend !== false,

        location:
          template?.fields?.location === true,

        workMode:
          template?.fields?.workMode === true,

        offerId:
          template?.fields?.offerId !== false,

        issueDate:
          template?.fields?.issueDate !== false,

        reportingManager:
          template?.fields?.reportingManager === true,

        qrCode:
          template?.fields?.qrCode !== false,
      },
    });

    setShowForm(true);
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
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
      selectedFile.type &&
      !allowedTypes.includes(selectedFile.type)
    ) {
      alert(
        "Only PDF, PNG, JPG, JPEG and WEBP files are allowed."
      );

      e.target.value = "";
      setFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert(
        "Template file must be 10 MB or smaller."
      );

      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Template name is required.");
      return false;
    }

    if (!editingTemplate && !file) {
      alert(
        "Please upload a template file."
      );
      return false;
    }

    if (
      form.type === "course" &&
      !form.courseId
    ) {
      alert("Please select a course.");
      return false;
    }

    if (
      form.type === "internship" &&
      !form.internshipId
    ) {
      alert("Please select an internship.");
      return false;
    }

    const hasEnabledField = Object.values(
      form.fields || {}
    ).some(Boolean);

    if (!hasEnabledField) {
      alert(
        "Please enable at least one dynamic field."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // SAVE
  // =====================================================

  const saveTemplate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setUploading(false);

      // =========================================
      // UPDATE EXISTING
      // =========================================

      if (editingTemplate) {
        const { data } = await api.put(
          `/offer-letter-templates/${editingTemplate._id}`,
          {
            name: form.name.trim(),

            type: form.type,

            courseId:
              form.courseId || null,

            internshipId:
              form.internshipId || null,

            requiresApproval:
              form.requiresApproval,

            fields: form.fields,
          }
        );

        if (data?.success === false) {
          throw new Error(
            data?.message ||
              "Update failed."
          );
        }

        alert(
          "Offer letter template updated successfully."
        );
      } else {
        // =========================================
        // CREATE NEW
        // =========================================

        if (!file) {
          throw new Error(
            "Template file is required."
          );
        }

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          form.name.trim()
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

        if (form.internshipId) {
          formData.append(
            "internshipId",
            form.internshipId
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
          JSON.stringify(form.fields)
        );

        formData.append(
          "offerLetter",
          file
        );

        const { data } = await api.post(
          "/offer-letter-templates",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        if (data?.success === false) {
          throw new Error(
            data?.message ||
              "Template creation failed."
          );
        }

        alert(
          "Offer letter template uploaded successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await loadAll();
    } catch (error) {
      console.error(
        "Save offer letter template error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save template."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE / DEACTIVATE
  // =====================================================

  const deleteTemplate = async (
    template
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${template?.name || "this template"}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/offer-letter-templates/${template._id}`
      );

      alert(
        "Template deleted successfully."
      );

      await loadAll();
    } catch (error) {
      console.error(
        "Delete offer letter template error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete template."
      );
    }
  };

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (fileValue) => {
    if (!fileValue) {
      return "";
    }

    let filePath = fileValue;

    if (
      typeof fileValue === "object"
    ) {
      filePath =
        fileValue?.url ||
        fileValue?.path ||
        fileValue?.location ||
        fileValue?.secure_url ||
        "";
    }

    if (!filePath) {
      return "";
    }

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    if (filePath.startsWith("/")) {
      return `${API_BASE}${filePath}`;
    }

    return `${API_BASE}/${filePath}`;
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

        const internshipName =
          template?.internshipId?.title ||
          "";

        const searchable = [
          name,
          type,
          courseName,
          internshipName,
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
  // ASSIGNMENT NAME
  // =====================================================

  const getAssignedTo = (template) => {
    return (
      template?.internshipId?.title ||
      template?.courseId?.title ||
      "Generic Template"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="mx-auto animate-spin text-5xl text-[#D4AF37]" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading offer letter templates...
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
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF8E7]">
              <FiFileText className="text-xl text-[#D4AF37]" />
            </div>

            <h1 className="text-3xl font-black text-slate-900">
              Offer Letter Templates
            </h1>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Upload and assign offer letter templates
            to courses and internships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAll}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <FiRefreshCw />

            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-white transition hover:bg-[#c29f32]"
          >
            <FiUpload />

            Add Template
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search template, course, internship..."
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
          />

          <div className="rounded-xl bg-[#FFF8E7] px-5 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Templates
            </span>

            <p className="mt-1 text-xl font-black text-slate-900">
              {filteredTemplates.length}
            </p>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FiFileText className="mx-auto text-6xl text-slate-300" />

          <h2 className="mt-5 text-2xl font-black text-slate-900">
            {search
              ? "No Matching Templates"
              : "No Offer Letter Templates"}
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {search
              ? "Try a different search term."
              : "Upload your first offer letter template."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-white"
            >
              Add Template
            </button>
          )}
        </div>
      ) : (
        /* TEMPLATE LIST */
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTemplates.map(
            (template) => {
              const assignedTo =
                getAssignedTo(template);

              const fileUrl =
                getFileUrl(
                  template?.templateFile
                );

              const enabledFields =
                Object.entries(
                  template?.fields || {}
                )
                  .filter(
                    ([, enabled]) =>
                      enabled
                  )
                  .map(
                    ([field]) =>
                      field
                  );

              return (
                <div
                  key={template._id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="p-6">
                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-black text-slate-900">
                          {template.name}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {formatType(
                            template.type
                          )}

                          {" • "}

                          {assignedTo}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                          template.isActive !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {template.isActive !== false
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    {/* ASSIGNMENT */}
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Assigned To
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {assignedTo}
                      </p>
                    </div>

                    {/* APPROVAL */}
                    <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Employee Approval
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Generated offer letters will
                            require employee verification
                            before sending.
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            template.requiresApproval !==
                            false
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {template.requiresApproval !==
                          false
                            ? "Required"
                            : "Disabled"}
                        </span>
                      </div>
                    </div>

                    {/* DYNAMIC FIELDS */}
                    <div className="mt-5">
                      <p className="text-sm font-bold text-slate-500">
                        Dynamic Fields
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {enabledFields.length > 0 ? (
                          enabledFields.map(
                            (field) => (
                              <span
                                key={field}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600"
                              >
                                {formatField(
                                  field
                                )}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-slate-400">
                            No dynamic fields
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEye />

                          View Template
                        </a>
                      )}

                      {fileUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTemplate(
                              template
                            )
                          }
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiFileText />

                          Preview
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(template)
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FiEdit3 />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTemplate(
                            template
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
                      >
                        <FiTrash2 />

                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* =================================================
          FORM MODAL
      ================================================== */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!saving) {
              setShowForm(false);
              resetForm();
            }
          }}
        >
          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingTemplate
                    ? "Edit Offer Letter Template"
                    : "Upload Offer Letter Template"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the program and dynamic fields
                  supported by this template.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setShowForm(false);
                    resetForm();
                  }
                }}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Template Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: SkilVira Internship Offer Letter"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Template Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
                >
                  <option value="internship">
                    Internship
                  </option>

                  <option value="course">
                    Course
                  </option>

                  <option value="job">
                    Job
                  </option>

                  <option value="achievement">
                    Achievement
                  </option>
                </select>
              </div>

              {/* COURSE */}
              {form.type === "course" && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Select Course
                  </label>

                  <select
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course._id}
                          value={course._id}
                        >
                          {course.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* INTERNSHIP */}
              {form.type === "internship" && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Select Internship
                  </label>

                  <select
                    name="internshipId"
                    value={form.internshipId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
                  >
                    <option value="">
                      Select Internship
                    </option>

                    {internships.map(
                      (internship) => (
                        <option
                          key={internship._id}
                          value={internship._id}
                        >
                          {internship.title}

                          {internship.company
                            ? ` - ${internship.company}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* FILE */}
              {!editingTemplate && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Template File
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5">
                    <FiUpload className="text-3xl text-[#D4AF37]" />

                    <span className="mt-3 font-bold text-slate-800">
                      Upload Offer Letter Template
                    </span>

                    <span className="mt-1 text-sm text-slate-500">
                      PDF, JPG, PNG or WEBP — max 10 MB
                    </span>

                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                      onChange={
                        handleFileChange
                      }
                      className="hidden"
                    />
                  </label>

                  {file && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#FFF8E7] p-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Selected File
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-slate-800">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {(
                            file.size / 1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFile(null)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* EXISTING FILE */}
              {editingTemplate &&
                editingTemplate.templateFile && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Current Template File
                    </p>

                    <a
                      href={getFileUrl(
                        editingTemplate.templateFile
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#9A7B14] hover:underline"
                    >
                      <FiEye />

                      View Current Template
                    </a>
                  </div>
                )}

              {/* DYNAMIC FIELDS */}
              <div>
                <div className="mb-3">
                  <h3 className="font-black text-slate-900">
                    Dynamic Fields
                  </h3>

                  <p className="text-sm text-slate-500">
                    Select the information that the generated
                    offer letter should support.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(
                    form.fields
                  ).map((field) => {
                    const enabled =
                      Boolean(
                        form.fields[field]
                      );

                    return (
                      <button
                        key={field}
                        type="button"
                        onClick={() =>
                          toggleField(
                            field
                          )
                        }
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                          enabled
                            ? "border-[#D4AF37] bg-[#FFF8E7]"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            enabled
                              ? "text-[#8D7216]"
                              : "text-slate-700"
                          }`}
                        >
                          {formatField(
                            field
                          )}
                        </span>

                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            enabled
                              ? "bg-[#D4AF37] text-black"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {enabled ? (
                            <FiCheck />
                          ) : (
                            <FiX />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* APPROVAL */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={
                    form.requiresApproval
                  }
                  onChange={(e) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        requiresApproval:
                          e.target
                            .checked,
                      })
                    )
                  }
                  className="h-5 w-5 accent-[#D4AF37]"
                />

                <div>
                  <p className="font-bold text-slate-900">
                    Employee approval required
                  </p>

                  <p className="text-sm text-slate-500">
                    Generated offer letters remain pending
                    until an employee approves them.
                  </p>
                </div>
              </label>

              {/* SUBMIT */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setShowForm(false);
                      resetForm();
                    }
                  }}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTemplate}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-black text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="animate-spin" />

                      {uploading
                        ? "Uploading..."
                        : "Saving..."}
                    </>
                  ) : (
                    <>
                      <FiCheck />

                      {editingTemplate
                        ? "Update Template"
                        : "Upload Template"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          TEMPLATE PREVIEW
      ================================================== */}

      {previewTemplate && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() =>
            setPreviewTemplate(null)
          }
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {previewTemplate.name}
                </h2>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {formatType(
                    previewTemplate.type
                  )}
                  {" • "}
                  {getAssignedTo(
                    previewTemplate
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(
                    null
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-100 p-4">
              {getFileUrl(
                previewTemplate.templateFile
              ) ? (
                isPdf(
                  previewTemplate.templateFile
                ) ? (
                  <iframe
                    title="Offer Letter Template Preview"
                    src={getFileUrl(
                      previewTemplate.templateFile
                    )}
                    className="h-[75vh] w-full rounded-2xl bg-white"
                  />
                ) : (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-2xl bg-white p-6">
                    <img
                      src={getFileUrl(
                        previewTemplate.templateFile
                      )}
                      alt={previewTemplate.name}
                      className="max-h-[70vh] max-w-full object-contain"
                    />
                  </div>
                )
              ) : (
                <div className="flex min-h-[70vh] items-center justify-center rounded-2xl bg-white">
                  <p className="text-sm font-semibold text-slate-500">
                    Preview is not available.
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
// FORMAT FIELD
// =====================================================

const formatField = (field) => {
  const specialNames = {
    studentName: "Student Name",
    companyName: "Company Name",
    joiningDate: "Joining Date",
    endDate: "End Date",
    workMode: "Work Mode",
    offerId: "Offer ID",
    issueDate: "Issue Date",
    reportingManager:
      "Reporting Manager",
    qrCode: "QR Code",
  };

  if (specialNames[field]) {
    return specialNames[field];
  }

  return String(field)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) =>
      char.toUpperCase()
    );
};

// =====================================================
// FORMAT TYPE
// =====================================================

const formatType = (type) => {
  const labels = {
    internship: "Internship",
    course: "Course",
    job: "Job",
    achievement: "Achievement",
  };

  return (
    labels[type] ||
    String(type || "Template")
  );
};

// =====================================================
// PDF CHECK
// =====================================================

const isPdf = (file) => {
  if (!file) {
    return false;
  }

  const value =
    typeof file === "string"
      ? file
      : file?.url ||
        file?.path ||
        file?.location ||
        "";

  return /\.pdf(\?.*)?$/i.test(
    value
  );
};

export default OfferLetterTemplates;