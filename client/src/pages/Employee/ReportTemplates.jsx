import React, { useEffect, useState } from "react";
import {
  FiUpload,
  FiTrash2,
  FiEdit3,
  FiFileText,
  FiSave,
} from "react-icons/fi";

import api from "../../services/api";

const defaultFields = {
  studentName: true,
  courseName: true,
  marks: true,
  grade: true,
  attendance: true,
  duration: true,
  performance: true,
  feedback: true,
  issueDate: true,
  reportId: true,
  instructorName: true,
  qrCode: true,
};

const fieldLabels = {
  studentName: "Student Name",
  courseName: "Course Name",
  marks: "Marks",
  grade: "Grade",
  attendance: "Attendance",
  duration: "Duration",
  performance: "Performance",
  feedback: "Feedback",
  issueDate: "Issue Date",
  reportId: "Report ID",
  instructorName: "Instructor Name",
  qrCode: "QR Code",
};

const initialForm = {
  name: "",
  type: "course",
  courseId: "",
  internshipId: "",
  requiresApproval: true,
  fields: { ...defaultFields },
  file: null,
};

const ReportTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [internships, setInternships] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      setFetching(true);

      const [templatesRes, coursesRes, internshipsRes] =
        await Promise.all([
          api.get("/report-templates"),
          api.get("/courses"),
          api.get("/internships"),
        ]);

      setTemplates(
        templatesRes.data?.templates ||
          templatesRes.data?.data ||
          []
      );

      setCourses(
        coursesRes.data?.courses ||
          coursesRes.data?.data ||
          []
      );

      setInternships(
        internshipsRes.data?.internships ||
          internshipsRes.data?.data ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to load report templates:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load report templates."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      ...initialForm,
      fields: { ...defaultFields },
    });

    setEditingId(null);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      courseId: "",
      internshipId: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setForm((prev) => ({
        ...prev,
        file: null,
      }));
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, PNG, JPG, JPEG or WEBP files are allowed.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const toggleField = (key) => {
    setForm((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: !prev.fields[key],
      },
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Enter template name.");
      return false;
    }

    if (!editingId && !form.file) {
      alert("Please upload a report template.");
      return false;
    }

    if (form.type === "course" && !form.courseId) {
      alert("Please select a course.");
      return false;
    }

    if (form.type === "internship" && !form.internshipId) {
      alert("Please select an internship.");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("type", form.type);
      formData.append("courseId", form.courseId || "");
      formData.append("internshipId", form.internshipId || "");
      formData.append(
        "requiresApproval",
        String(form.requiresApproval)
      );
      formData.append("fields", JSON.stringify(form.fields));

      if (form.file) {
        formData.append("reportTemplate", form.file);
      }

      if (editingId) {
        await api.put(
          `/report-templates/${editingId}`,
          formData
        );

        alert("Report template updated successfully.");
      } else {
        await api.post(
          "/report-templates",
          formData
        );

        alert("Report template created successfully.");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(
        "Failed to save report template:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save report template."
      );
    } finally {
      setLoading(false);
    }
  };

  const editTemplate = (template) => {
    setEditingId(template._id);

    setForm({
      name: template.name || "",
      type: template.type || "course",

      courseId:
        template.courseId?._id ||
        template.courseId ||
        "",

      internshipId:
        template.internshipId?._id ||
        template.internshipId ||
        "",

      requiresApproval:
        template.requiresApproval !== false,

      fields: {
        ...defaultFields,
        ...(template.fields || {}),
      },

      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteTemplate = async (id) => {
    const confirmed = window.confirm(
      "Deactivate this report template?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(
        `/report-templates/${id}`
      );

      alert("Report template deactivated successfully.");

      await fetchData();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Failed to delete report template:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to deactivate report template."
      );
    } finally {
      setLoading(false);
    }
  };

  const getTemplateStatus = (template) => {
    if (template.isActive === false) {
      return {
        label: "Inactive",
        className:
          "bg-red-100 text-red-700",
      };
    }

    return {
      label: "Active",
      className:
        "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-gray-900 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Report Templates
          </h1>

          <p className="mt-2 text-gray-500">
            Configure report templates for courses and internships.
          </p>
        </div>

        {/* Create / Edit Form */}
        <form
          onSubmit={submit}
          className="mb-10 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-6"
        >
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Report Template"
                  : "Add Report Template"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload the report design and configure the fields
                that will be used in generated reports.
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#9A7810]">
                Editing Template
              </span>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Template Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Template Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  updateForm("name", e.target.value)
                }
                placeholder="Internship Performance Report"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  handleTypeChange(e.target.value)
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

            {/* Course */}
            {form.type === "course" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Course
                </label>

                <select
                  value={form.courseId}
                  onChange={(e) =>
                    updateForm(
                      "courseId",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Internship */}
            {form.type === "internship" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Internship
                </label>

                <select
                  value={form.internshipId}
                  onChange={(e) =>
                    updateForm(
                      "internshipId",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
                >
                  <option value="">
                    Select Internship
                  </option>

                  {internships.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Template File */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Template File
              </label>

              <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#D4AF37]/60 bg-white px-4 py-3 transition hover:border-[#D4AF37]">
                <FiUpload className="shrink-0 text-[#D4AF37]" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {form.file
                      ? form.file.name
                      : editingId
                      ? "Choose new file (optional)"
                      : "Upload PDF / Image"}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    PDF, PNG, JPG, JPEG, WEBP
                  </p>
                </div>

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="mt-7">
            <p className="mb-3 font-semibold">
              Dynamic Fields
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.keys(fieldLabels).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 transition hover:border-[#D4AF37]/40"
                >
                  <input
                    type="checkbox"
                    checked={!!form.fields[key]}
                    onChange={() =>
                      toggleField(key)
                    }
                    className="h-4 w-4 accent-[#D4AF37]"
                  />

                  <span className="text-sm">
                    {fieldLabels[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Approval */}
          <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.requiresApproval}
              onChange={(e) =>
                updateForm(
                  "requiresApproval",
                  e.target.checked
                )
              }
              className="h-4 w-4 accent-[#D4AF37]"
            />

            <span>
              Employee approval required before final report
            </span>
          </label>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white transition hover:bg-[#c5a02f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave />

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
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Templates List */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Saved Report Templates
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {templates.length} template
                {templates.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {fetching ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

              <p className="mt-4 text-gray-500">
                Loading report templates...
              </p>
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiFileText size={26} />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No Report Templates
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first report template using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const status = getTemplateStatus(template);

                return (
                  <div
                    key={template._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Card Header */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <FiFileText size={22} />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold capitalize text-[#9A7810]">
                          {template.type || "course"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold">
                      {template.name}
                    </h3>

                    {/* Course / Internship */}
                    <p className="mt-2 text-sm text-gray-500">
                      {template.courseId?.title ||
                        template.internshipId?.title ||
                        "General Template"}
                    </p>

                    {/* Fields */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Enabled Fields
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Object.keys(fieldLabels)
                          .filter(
                            (key) =>
                              template.fields?.[key]
                          )
                          .slice(0, 6)
                          .map((key) => (
                            <span
                              key={key}
                              className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                            >
                              {fieldLabels[key]}
                            </span>
                          ))}

                        {Object.keys(fieldLabels).filter(
                          (key) =>
                            template.fields?.[key]
                        ).length > 6 && (
                          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                            +
                            {Object.keys(fieldLabels).filter(
                              (key) =>
                                template.fields?.[key]
                            ).length - 6}
                            {" more"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Approval */}
                    <div className="mt-4 text-sm">
                      <span className="text-gray-500">
                        Approval:
                      </span>{" "}
                      <span className="font-medium">
                        {template.requiresApproval !== false
                          ? "Required"
                          : "Not Required"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          editTemplate(template)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 px-3 py-2.5 text-sm font-medium text-[#9A7810] transition hover:bg-[#D4AF37]/5"
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
                        disabled={loading}
                        title="Deactivate template"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportTemplates;