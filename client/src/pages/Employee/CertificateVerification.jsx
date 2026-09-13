import { useEffect, useState } from "react";

import {
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiEye,
  FiSave,
  FiRefreshCw,
  FiFileText,
} from "react-icons/fi";

import api from "../../services/api";


const CertificateVerification = () => {

  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({});


  useEffect(() => {

    loadCertificates();

  }, []);




  const loadCertificates = async () => {

    try {

      setLoading(true);

      const { data } = await api.get(
        "/generated-certificate/pending"
      );

      setCertificates(
        data.certificates || []
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to load certificate verification queue."
      );

    } finally {

      setLoading(false);

    }

  };




  const startEditing = (certificate) => {

    setEditingId(certificate._id);

    setEditData({

      studentName:
        certificate.data?.studentName ||
        certificate.student?.name ||
        "",

      courseName:
        certificate.data?.courseName ||
        certificate.course?.title ||
        "",

      marks:
        certificate.data?.marks ||
        "",

      grade:
        certificate.data?.grade ||
        "",

      duration:
        certificate.data?.duration ||
        "",

      attendance:
        certificate.data?.attendance ||
        "",

      performance:
        certificate.data?.performance ||
        "",

      feedback:
        certificate.data?.feedback ||
        "",

      issueDate:
        certificate.data?.issueDate ||
        "",

      certificateId:
        certificate.certificateId ||
        certificate.data?.certificateId ||
        "",

    });

  };




  const cancelEditing = () => {

    setEditingId(null);

    setEditData({});

  };




  const handleChange = (e) => {

    setEditData((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };




  const saveChanges = async (id) => {

    try {

      setSaving(true);

      await api.put(

        `/generated-certificate/${id}/update`,

        {
          data: editData,
        }

      );

      alert(
        "Certificate details updated successfully."
      );

      cancelEditing();

      await loadCertificates();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update certificate."
      );

    } finally {

      setSaving(false);

    }

  };




  const approveCertificate = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to approve this certificate?"
    );

    if (!confirmed) {
      return;
    }


    try {

      await api.put(
        `/generated-certificate/${id}/approve`
      );

      alert(
        "Certificate approved successfully."
      );

      await loadCertificates();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to approve certificate."
      );

    }

  };




  const rejectCertificate = async (id) => {

    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) {
      return;
    }


    try {

      await api.put(

        `/generated-certificate/${id}/reject`,

        {
          reason,
        }

      );

      alert(
        "Certificate rejected successfully."
      );

      await loadCertificates();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to reject certificate."
      );

    }

  };




  const requestRevision = async (id) => {

    const reason = window.prompt(
      "Enter correction/revision instructions:"
    );

    if (!reason) {
      return;
    }


    try {

      await api.put(

        `/generated-certificate/${id}/update`,

        {
          data: {
            ...editData,
          },

        }

      );

      alert(
        `Revision requested: ${reason}`
      );

      await loadCertificates();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to request revision."
      );

    }

  };




  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <FiRefreshCw className="mx-auto animate-spin text-4xl text-[#D4AF37]" />

          <p className="mt-4 font-semibold">

            Loading Certificate Verification...

          </p>

        </div>

      </div>

    );

  }




  return (

    <div className="space-y-8">


      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <FiAward className="text-[#D4AF37]" />

            Certificate Verification

          </h1>

          <p className="mt-2 text-gray-500">

            Review, edit and approve automatically generated certificates.

          </p>

        </div>



        <button

          onClick={loadCertificates}

          className="flex w-fit items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"

        >

          <FiRefreshCw />

          Refresh

        </button>

      </div>





      {/* Empty State */}

      {
        certificates.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow">

            <FiAward className="mx-auto text-6xl text-[#D4AF37]" />

            <h2 className="mt-5 text-2xl font-bold">

              No Pending Certificates

            </h2>

            <p className="mt-2 text-gray-500">

              New generated certificates waiting for verification will appear here.

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {
              certificates.map((certificate) => {

                const editing =
                  editingId === certificate._id;


                return (

                  <div

                    key={certificate._id}

                    className="rounded-3xl bg-white p-6 shadow"

                  >


                    {/* Top */}

                    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">

                      <div>

                        <h2 className="text-2xl font-bold">

                          {
                            certificate.student?.name ||
                            certificate.data?.studentName ||
                            "Student"
                          }

                        </h2>

                        <p className="mt-1 text-gray-500">

                          {
                            certificate.student?.email ||
                            "No email"
                          }

                        </p>

                      </div>



                      <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                          {certificate.status}

                        </span>

                      </div>

                    </div>





                    {/* Course */}

                    <div className="mt-5 rounded-2xl bg-gray-50 p-5">

                      <p className="text-sm text-gray-500">

                        Course / Internship

                      </p>

                      <h3 className="mt-1 text-xl font-bold">

                        {
                          certificate.course?.title ||
                          certificate.data?.courseName ||
                          "Not specified"
                        }

                      </h3>

                    </div>





                    {/* Details */}

                    {
                      editing ? (

                        <div className="mt-6 grid gap-4 md:grid-cols-2">

                          <Field
                            label="Student Name"
                            name="studentName"
                            value={editData.studentName}
                            onChange={handleChange}
                          />

                          <Field
                            label="Course Name"
                            name="courseName"
                            value={editData.courseName}
                            onChange={handleChange}
                          />

                          <Field
                            label="Marks"
                            name="marks"
                            value={editData.marks}
                            onChange={handleChange}
                          />

                          <Field
                            label="Grade"
                            name="grade"
                            value={editData.grade}
                            onChange={handleChange}
                          />

                          <Field
                            label="Duration"
                            name="duration"
                            value={editData.duration}
                            onChange={handleChange}
                          />

                          <Field
                            label="Attendance"
                            name="attendance"
                            value={editData.attendance}
                            onChange={handleChange}
                          />

                          <Field
                            label="Performance"
                            name="performance"
                            value={editData.performance}
                            onChange={handleChange}
                          />

                          <Field
                            label="Issue Date"
                            name="issueDate"
                            value={editData.issueDate}
                            onChange={handleChange}
                          />

                          <Field
                            label="Certificate ID"
                            name="certificateId"
                            value={editData.certificateId}
                            onChange={handleChange}
                          />

                          <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold">

                              Feedback

                            </label>

                            <textarea
                              name="feedback"
                              value={editData.feedback}
                              onChange={handleChange}
                              rows={4}
                              className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"
                              placeholder="Enter feedback"
                            />

                          </div>

                        </div>

                      ) : (

                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                          <Info
                            label="Student Name"
                            value={
                              certificate.data?.studentName ||
                              certificate.student?.name
                            }
                          />

                          <Info
                            label="Course"
                            value={
                              certificate.data?.courseName ||
                              certificate.course?.title
                            }
                          />

                          <Info
                            label="Marks"
                            value={certificate.data?.marks}
                          />

                          <Info
                            label="Grade"
                            value={certificate.data?.grade}
                          />

                          <Info
                            label="Duration"
                            value={certificate.data?.duration}
                          />

                          <Info
                            label="Attendance"
                            value={certificate.data?.attendance}
                          />

                          <Info
                            label="Performance"
                            value={certificate.data?.performance}
                          />

                          <Info
                            label="Issue Date"
                            value={certificate.data?.issueDate}
                          />

                          <Info
                            label="Certificate ID"
                            value={certificate.certificateId}
                          />

                          <Info
                            label="Feedback"
                            value={certificate.data?.feedback}
                          />

                        </div>

                      )

                    }





                    {/* Preview */}

                    <div className="mt-6 flex flex-wrap gap-3">


                      {
                        certificate.certificateFile && (

                          <a
                            href={`http://localhost:5000${certificate.certificateFile}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
                          >

                            <FiEye />

                            Preview Certificate

                          </a>

                        )
                      }



                      {
                        certificate.reportFile && (

                          <a
                            href={`http://localhost:5000${certificate.reportFile}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
                          >

                            <FiFileText />

                            Preview Report

                          </a>

                        )
                      }


                    </div>





                    {/* Actions */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {
                        editing ? (

                          <>

                            <button
                              onClick={() =>
                                saveChanges(
                                  certificate._id
                                )
                              }
                              disabled={saving}
                              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white"
                            >

                              <FiSave />

                              {
                                saving
                                  ? "Saving..."
                                  : "Save Changes"
                              }

                            </button>



                            <button
                              onClick={cancelEditing}
                              className="rounded-xl border px-5 py-3"
                            >

                              Cancel

                            </button>

                          </>

                        ) : (

                          <button

                            onClick={() =>
                              startEditing(
                                certificate
                              )
                            }

                            className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold"

                          >

                            <FiEdit3 />

                            Edit Details

                          </button>

                        )

                      }



                      <button

                        onClick={() =>
                          approveCertificate(
                            certificate._id
                          )
                        }

                        className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"

                      >

                        <FiCheckCircle />

                        Approve

                      </button>




                      <button

                        onClick={() =>
                          requestRevision(
                            certificate._id
                          )
                        }

                        className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold"

                      >

                        <FiRefreshCw />

                        Request Revision

                      </button>




                      <button

                        onClick={() =>
                          rejectCertificate(
                            certificate._id
                          )
                        }

                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white"

                      >

                        <FiXCircle />

                        Reject

                      </button>

                    </div>


                  </div>

                );

              })

            }

          </div>

        )

      }

    </div>

  );

};





const Field = ({
  label,
  name,
  value,
  onChange,
}) => {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold">

        {label}

      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"
      />

    </div>

  );

};





const Info = ({
  label,
  value,
}) => {

  return (

    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="mt-1 font-semibold">

        {value || "-"}

      </p>

    </div>

  );

};





export default CertificateVerification;