import { useEffect, useState } from "react";

import {
  FiCheck,
  FiEdit3,
  FiFileText,
  FiRefreshCw,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";

import api from "../../services/api";


const API_BASE =
  "http://localhost:5000";


const OfferLetterTemplates = () => {

  const [templates, setTemplates] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTemplate, setEditingTemplate] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [form, setForm] =
    useState({

      name: "",

      type: "internship",

      courseId: "",

      internshipId: "",

      requiresApproval: true,

      fields: {

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

      },

    });


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

        api.get(
          "/offer-letter-templates"
        ),

        api.get(
          "/courses"
        ),

        api.get(
          "/internships"
        ),

      ]);


      setTemplates(
        templatesResponse.data?.templates ||
        []
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

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load offer letter templates."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({

      ...prev,

      [name]:
        value,

    }));


    if (
      name === "type"
    ) {

      setForm((prev) => ({

        ...prev,

        courseId: "",
        internshipId: "",

      }));

    }

  };


  // =====================================================
  // FIELD TOGGLE
  // =====================================================

  const toggleField = (
    field
  ) => {

    setForm((prev) => ({

      ...prev,

      fields: {

        ...prev.fields,

        [field]:
          !prev.fields[field],

      },

    }));

  };


  // =====================================================
  // NEW TEMPLATE
  // =====================================================

  const openCreate = () => {

    setEditingTemplate(null);

    setFile(null);

    setForm({

      name: "",

      type: "internship",

      courseId: "",

      internshipId: "",

      requiresApproval: true,

      fields: {

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

      },

    });

    setShowForm(true);

  };


  // =====================================================
  // EDIT TEMPLATE
  // =====================================================

  const openEdit = (
    template
  ) => {

    setEditingTemplate(
      template
    );

    setFile(null);

    setForm({

      name:
        template.name || "",

      type:
        template.type || "internship",

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

        studentName:
          template.fields?.studentName !== false,

        role:
          template.fields?.role !== false,

        companyName:
          template.fields?.companyName !== false,

        duration:
          template.fields?.duration !== false,

        joiningDate:
          template.fields?.joiningDate !== false,

        endDate:
          template.fields?.endDate === true,

        stipend:
          template.fields?.stipend !== false,

        location:
          template.fields?.location === true,

        workMode:
          template.fields?.workMode === true,

        offerId:
          template.fields?.offerId !== false,

        issueDate:
          template.fields?.issueDate !== false,

        reportingManager:
          template.fields?.reportingManager === true,

        qrCode:
          template.fields?.qrCode !== false,

      },

    });


    setShowForm(true);

  };


  // =====================================================
  // SAVE
  // =====================================================

  const saveTemplate = async () => {

    if (
      !form.name.trim()
    ) {

      alert(
        "Template name is required."
      );

      return;

    }


    if (
      !editingTemplate &&
      !file
    ) {

      alert(
        "Please upload a template file."
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


    if (
      form.type === "internship" &&
      !form.internshipId
    ) {

      alert(
        "Please select an internship or choose a generic template option."
      );

      return;

    }


    try {

      setSaving(true);


      // =========================================
      // UPDATE EXISTING
      // =========================================

      if (editingTemplate) {

        const { data } =
          await api.put(

            `/offer-letter-templates/${editingTemplate._id}`,

            {

              name:
                form.name.trim(),

              type:
                form.type,

              courseId:
                form.courseId || null,

              internshipId:
                form.internshipId || null,

              requiresApproval:
                form.requiresApproval,

              fields:
                form.fields,

            }

          );


        if (!data.success) {

          throw new Error(
            data.message ||
            "Update failed."
          );

        }


        alert(
          "Offer letter template updated successfully."
        );

      } else {

        // =========================================
        // CREATE
        // =========================================

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


        if (
          form.courseId
        ) {

          formData.append(
            "courseId",
            form.courseId
          );

        }


        if (
          form.internshipId
        ) {

          formData.append(
            "internshipId",
            form.internshipId
          );

        }


        formData.append(
          "requiresApproval",
          form.requiresApproval
        );


        formData.append(
          "fields",
          JSON.stringify(
            form.fields
          )
        );


        formData.append(
          "offerLetter",
          file
        );


        const { data } =
          await api.post(

            "/offer-letter-templates",

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
            "Template creation failed."
          );

        }


        alert(
          "Offer letter template uploaded successfully."
        );

      }


      setShowForm(false);

      setEditingTemplate(null);

      setFile(null);

      await loadAll();

    } catch (error) {

      console.error(error);

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
        `Delete "${template.name}"?`
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

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete template."
      );

    }

  };


  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (
    file
  ) => {

    if (!file) {
      return "";
    }


    if (
      file.startsWith("http")
    ) {

      return file;

    }


    return `${API_BASE}${file}`;

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <FiRefreshCw
          className="animate-spin text-5xl text-[#D4AF37]"
        />

      </div>

    );

  }


  return (

    <div className="space-y-8">


      {/* =============================================
          HEADER
      ============================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <FiFileText
              className="text-[#D4AF37]"
            />

            Offer Letter Templates

          </h1>

          <p className="mt-2 text-gray-500">

            Upload and assign offer letter templates to courses and internships.

          </p>

        </div>


        <button

          onClick={
            openCreate
          }

          className="flex w-fit items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-white"

        >

          <FiUpload />

          Add Template

        </button>

      </div>



      {/* =============================================
          TEMPLATE LIST
      ============================================== */}

      {templates.length === 0 ? (

        <div className="rounded-3xl bg-white p-12 text-center shadow">

          <FiFileText
            className="mx-auto text-6xl text-gray-300"
          />

          <h2 className="mt-5 text-2xl font-bold">

            No Offer Letter Templates

          </h2>

          <p className="mt-2 text-gray-500">

            Upload your first company offer letter template.

          </p>

        </div>

      ) : (

        <div className="grid gap-6 lg:grid-cols-2">

          {templates.map(
            (template) => {

              const assignedTo =
                template.internshipId?.title ||
                template.courseId?.title ||
                "Generic Template";


              return (

                <div

                  key={
                    template._id
                  }

                  className="overflow-hidden rounded-3xl bg-white shadow"

                >

                  <div className="p-6">


                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-xl font-bold">

                          {template.name}

                        </h2>

                        <p className="mt-1 text-sm text-gray-500">

                          {
                            template.type === "internship"
                              ? "Internship"
                              : "Course"
                          }

                          {" • "}

                          {assignedTo}

                        </p>

                      </div>


                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                        {
                          template.isActive !== false
                            ? "Active"
                            : "Inactive"
                        }

                      </span>

                    </div>


                    {/* Assignment */}

                    <div className="mt-5 rounded-2xl bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">

                        Assigned To

                      </p>

                      <p className="mt-1 font-semibold">

                        {assignedTo}

                      </p>

                    </div>


                    {/* Fields */}

                    <div className="mt-5">

                      <p className="text-sm font-semibold text-gray-500">

                        Dynamic Fields

                      </p>


                      <div className="mt-3 flex flex-wrap gap-2">

                        {Object.entries(
                          template.fields || {}
                        )
                          .filter(
                            ([, enabled]) =>
                              enabled
                          )
                          .map(
                            ([field]) => (

                              <span
                                key={field}
                                className="rounded-full border px-3 py-1 text-xs"
                              >

                                {formatField(
                                  field
                                )}

                              </span>

                            )
                          )}

                      </div>

                    </div>


                    {/* Actions */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {template.templateFile && (

                        <a

                          href={
                            getFileUrl(
                              template.templateFile
                            )
                          }

                          target="_blank"

                          rel="noreferrer"

                          className="flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold"

                        >

                          <FiFileText />

                          View Template

                        </a>

                      )}


                      <button

                        onClick={() =>
                          openEdit(
                            template
                          )
                        }

                        className="flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold"

                      >

                        <FiEdit3 />

                        Edit

                      </button>


                      <button

                        onClick={() =>
                          deleteTemplate(
                            template
                          )
                        }

                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white"

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



      {/* =============================================
          FORM MODAL
      ============================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white">


            {/* Header */}

            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">

              <div>

                <h2 className="text-2xl font-bold">

                  {
                    editingTemplate
                      ? "Edit Offer Letter Template"
                      : "Upload Offer Letter Template"
                  }

                </h2>

                <p className="text-sm text-gray-500">

                  Configure which program uses this template and which dynamic fields it supports.

                </p>

              </div>


              <button

                onClick={() =>
                  setShowForm(false)
                }

                className="rounded-xl border p-2"

              >

                <FiX />

              </button>

            </div>



            <div className="space-y-6 p-6">


              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-semibold">

                  Template Name

                </label>

                <input

                  name="name"

                  value={
                    form.name
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Example: SkilVira Internship Offer Letter"

                  className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                />

              </div>



              {/* Type */}

              <div>

                <label className="mb-2 block text-sm font-semibold">

                  Template Type

                </label>

                <select

                  name="type"

                  value={
                    form.type
                  }

                  onChange={
                    handleChange
                  }

                  className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

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



              {/* Course */}

              {form.type === "course" && (

                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Select Course

                  </label>

                  <select

                    name="courseId"

                    value={
                      form.courseId
                    }

                    onChange={
                      handleChange
                    }

                    className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                  >

                    <option value="">

                      Select Course

                    </option>

                    {courses.map(
                      (course) => (

                        <option
                          key={
                            course._id
                          }
                          value={
                            course._id
                          }
                        >

                          {
                            course.title
                          }

                        </option>

                      )
                    )}

                  </select>

                </div>

              )}



              {/* Internship */}

              {form.type === "internship" && (

                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Select Internship

                  </label>

                  <select

                    name="internshipId"

                    value={
                      form.internshipId
                    }

                    onChange={
                      handleChange
                    }

                    className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

                  >

                    <option value="">

                      Select Internship

                    </option>

                    {internships.map(
                      (internship) => (

                        <option
                          key={
                            internship._id
                          }
                          value={
                            internship._id
                          }
                        >

                          {
                            internship.title
                          }

                          {internship.company
                            ? ` - ${internship.company}`
                            : ""}

                        </option>

                      )
                    )}

                  </select>

                </div>

              )}



              {/* File */}

              {!editingTemplate && (

                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Template File

                  </label>


                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center hover:bg-gray-50">

                    <FiUpload
                      className="text-3xl text-[#D4AF37]"
                    />

                    <span className="mt-3 font-semibold">

                      Upload Offer Letter Template

                    </span>

                    <span className="mt-1 text-sm text-gray-500">

                      PDF, JPG, PNG or WEBP

                    </span>


                    <input

                      type="file"

                      accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"

                      onChange={(e) =>
                        setFile(
                          e.target.files?.[0] ||
                          null
                        )
                      }

                      className="hidden"

                    />

                  </label>


                  {file && (

                    <p className="mt-3 text-sm text-gray-500">

                      Selected:
                      {" "}
                      <strong>
                        {file.name}
                      </strong>

                    </p>

                  )}

                </div>

              )}



              {/* Dynamic Fields */}

              <div>

                <div className="mb-3">

                  <h3 className="font-bold">

                    Dynamic Fields

                  </h3>

                  <p className="text-sm text-gray-500">

                    Select the information that this template supports.

                  </p>

                </div>


                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {Object.keys(
                    form.fields
                  ).map(
                    (field) => (

                      <button

                        key={
                          field
                        }

                        type="button"

                        onClick={() =>
                          toggleField(
                            field
                          )
                        }

                        className={`flex items-center justify-between rounded-xl border p-4 text-left ${
                          form.fields[field]
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-gray-200"
                        }`}

                      >

                        <span className="font-semibold">

                          {
                            formatField(
                              field
                            )
                          }

                        </span>


                        {form.fields[field] ? (

                          <FiCheck
                            className="text-[#D4AF37]"
                          />

                        ) : (

                          <FiX
                            className="text-gray-400"
                          />

                        )}

                      </button>

                    )
                  )}

                </div>

              </div>



              {/* Approval */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">

                <input

                  type="checkbox"

                  checked={
                    form.requiresApproval
                  }

                  onChange={(e) =>
                    setForm((prev) => ({

                      ...prev,

                      requiresApproval:
                        e.target.checked,

                    }))
                  }

                  className="h-5 w-5"

                />

                <div>

                  <p className="font-semibold">

                    Employee approval required

                  </p>

                  <p className="text-sm text-gray-500">

                    Offer letter remains pending until an employee approves it.

                  </p>

                </div>

              </label>



              {/* Submit */}

              <div className="flex flex-wrap justify-end gap-3 border-t pt-5">

                <button

                  onClick={() =>
                    setShowForm(false)
                  }

                  className="rounded-xl border px-6 py-3 font-semibold"

                >

                  Cancel

                </button>


                <button

                  onClick={
                    saveTemplate
                  }

                  disabled={
                    saving
                  }

                  className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-white disabled:opacity-60"

                >

                  {saving ? (

                    <>

                      <FiRefreshCw className="animate-spin" />

                      {
                        uploading
                          ? "Uploading..."
                          : "Saving..."
                      }

                    </>

                  ) : (

                    <>

                      <FiCheck />

                      {
                        editingTemplate
                          ? "Update Template"
                          : "Upload Template"
                      }

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


// =====================================================
// FORMAT FIELD NAME
// =====================================================

const formatField = (
  field
) => {

  return field

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


export default OfferLetterTemplates;