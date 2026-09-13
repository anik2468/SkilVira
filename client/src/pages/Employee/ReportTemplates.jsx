import React, { useEffect, useState } from "react";
import {
  FiUpload,
  FiTrash2,
  FiEdit3,
  FiFileText,
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

const ReportTemplates = () => {
  const [templates, setTemplates] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [internships, setInternships] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "course",
    courseId: "",
    internshipId: "",
    requiresApproval: true,
    fields: defaultFields,
    file: null,
  });

  const fetchData = async () => {
    try {
      const [
        templatesRes,
        coursesRes,
        internshipsRes,
      ] = await Promise.all([
        api.get("/report-templates"),
        api.get("/courses"),
        api.get("/internships"),
      ]);

      setTemplates(
        templatesRes.data?.templates ||
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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      type: "course",
      courseId: "",
      internshipId: "",
      requiresApproval: true,
      fields: {
        ...defaultFields,
      },
      file: null,
    });

    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Enter template name.");
      return;
    }

    if (!editingId && !form.file) {
      alert("Please upload a template.");
      return;
    }

    if (
      form.type === "course" &&
      !form.courseId
    ) {
      alert("Please select a course.");
      return;
    }

    if (
      form.type === "internship" &&
      !form.internshipId
    ) {
      alert(
        "Please select an internship."
      );
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "type",
        form.type
      );

      formData.append(
        "courseId",
        form.courseId
      );

      formData.append(
        "internshipId",
        form.internshipId
      );

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

      if (form.file) {
        formData.append(
          "reportTemplate",
          form.file
        );
      }

      if (editingId) {
        await api.put(
          `/report-templates/${editingId}`,
          formData
        );
      } else {
        await api.post(
          "/report-templates",
          formData
        );
      }

      resetForm();

      await fetchData();

      alert(
        "Report template saved successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to save report template."
      );
    } finally {
      setLoading(false);
    }
  };

  const editTemplate = (
    template
  ) => {
    setEditingId(
      template._id
    );

    setForm({
      name:
        template.name || "",
      type:
        template.type ||
        "course",
      courseId:
        template.courseId?._id ||
        template.courseId ||
        "",
      internshipId:
        template.internshipId?._id ||
        template.internshipId ||
        "",
      requiresApproval:
        template.requiresApproval !==
        false,
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

  const deleteTemplate = async (
    id
  ) => {
    if (
      !window.confirm(
        "Deactivate this report template?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/report-templates/${id}`
      );

      await fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete template."
      );
    }
  };

  const toggleField = (key) => {
    setForm((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]:
          !prev.fields[key],
      },
    }));
  };

  const labels = {
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
    instructorName:
      "Instructor Name",
    qrCode: "QR Code",
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-gray-900 md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Report Templates
          </h1>

          <p className="mt-2 text-gray-500">
            Configure report templates for
            courses and internships.
          </p>
        </div>


        <form
          onSubmit={submit}
          className="mb-10 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-6"
        >
          <h2 className="mb-6 text-xl font-semibold">
            {editingId
              ? "Edit Report Template"
              : "Add Report Template"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Template Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Internship Performance Report"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#D4AF37]"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                    courseId: "",
                    internshipId:
                      "",
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
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


            {form.type === "course" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Course
                </label>

                <select
                  value={form.courseId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courseId:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
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


            {form.type ===
              "internship" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Internship
                </label>

                <select
                  value={
                    form.internshipId
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      internshipId:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                >
                  <option value="">
                    Select Internship
                  </option>

                  {internships.map(
                    (item) => (
                      <option
                        key={item._id}
                        value={
                          item._id
                        }
                      >
                        {item.title}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}


            <div>
              <label className="mb-2 block text-sm font-medium">
                Template File
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#D4AF37]/60 bg-white px-4 py-3">
                <FiUpload className="text-[#D4AF37]" />

                <span className="truncate text-sm">
                  {form.file
                    ? form.file.name
                    : "Upload PDF / Image"}
                </span>

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                />
              </label>
            </div>

          </div>


          <div className="mt-6">
            <p className="mb-3 font-semibold">
              Dynamic Fields
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.keys(
                labels
              ).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={
                      !!form.fields[key]
                    }
                    onChange={() =>
                      toggleField(key)
                    }
                    className="accent-[#D4AF37]"
                  />

                  <span className="text-sm">
                    {labels[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>


          <label className="mt-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={
                form.requiresApproval
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  requiresApproval:
                    e.target.checked,
                })
              }
              className="accent-[#D4AF37]"
            />

            Employee approval required
          </label>


          <div className="mt-6 flex gap-3">
            <button
              disabled={loading}
              className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
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
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>


        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(
            (template) => (
              <div
                key={template._id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                    <FiFileText
                      size={22}
                    />
                  </div>

                  <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#9A7810]">
                    {template.type}
                  </span>
                </div>

                <h3 className="font-semibold">
                  {template.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {template.courseId?.title ||
                    template.internshipId?.title ||
                    "General Template"}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() =>
                      editTemplate(
                        template
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 px-3 py-2 text-sm font-medium text-[#9A7810]"
                  >
                    <FiEdit3 />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTemplate(
                        template._id
                      )
                    }
                    className="rounded-xl border border-red-200 px-3 py-2 text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default ReportTemplates;