import { useEffect, useState } from "react";

import {
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiFileText,
  FiSave,
} from "react-icons/fi";

import api from "../../services/api";


const ReportsVerification = () => {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({});


  useEffect(() => {

    loadReports();

  }, []);


  const loadReports = async () => {

    try {

      setLoading(true);

      const { data } = await api.get(
        "/generated-certificate/pending"
      );

      const reportItems = (data.certificates || []).filter(
        (item) =>
          item.template?.category === "report" ||
          item.reportFile
      );

      setReports(reportItems);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  const startEdit = (report) => {

    setEditingId(report._id);

    setEditData({
      studentName: report.data?.studentName || "",
      courseName: report.data?.courseName || "",
      marks: report.data?.marks || "",
      grade: report.data?.grade || "",
      attendance: report.data?.attendance || "",
      performance: report.data?.performance || "",
      feedback: report.data?.feedback || "",
      duration: report.data?.duration || "",
      issueDate: report.data?.issueDate || "",
    });

  };


  const changeHandler = (e) => {

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

      alert("Report details updated successfully.");

      setEditingId(null);

      setEditData({});

      loadReports();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update report."
      );

    } finally {

      setSaving(false);

    }

  };


  const approveReport = async (id) => {

    try {

      await api.put(
        `/generated-certificate/${id}/approve`
      );

      alert("Report approved successfully.");

      loadReports();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to approve report."
      );

    }

  };


  const rejectReport = async (id) => {

    const reason =
      window.prompt(
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

      alert("Report rejected.");

      loadReports();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to reject report."
      );

    }

  };


  if (loading) {

    return (

      <div className="flex min-h-[50vh] items-center justify-center">

        <h2 className="text-xl font-bold">
          Loading Reports...
        </h2>

      </div>

    );

  }


  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Report Verification
        </h1>

        <p className="mt-2 text-gray-500">
          Review, edit and approve generated student reports.
        </p>

      </div>


      {
        reports.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow">

            <FiFileText className="mx-auto text-5xl text-[#D4AF37]" />

            <h2 className="mt-4 text-xl font-bold">
              No Pending Reports
            </h2>

            <p className="mt-2 text-gray-500">
              Generated reports waiting for verification will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {
              reports.map((report) => {

                const isEditing =
                  editingId === report._id;

                return (

                  <div
                    key={report._id}
                    className="rounded-2xl bg-white p-6 shadow"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <h2 className="text-xl font-bold">
                          {report.student?.name || "Student"}
                        </h2>

                        <p className="text-gray-500">
                          {report.course?.title || "Course / Internship"}
                        </p>

                      </div>


                      <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                        {report.status}

                      </span>

                    </div>


                    {
                      isEditing ? (

                        <div className="mt-6 grid gap-4 md:grid-cols-2">

                          <input
                            name="studentName"
                            value={editData.studentName}
                            onChange={changeHandler}
                            placeholder="Student Name"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="courseName"
                            value={editData.courseName}
                            onChange={changeHandler}
                            placeholder="Course Name"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="marks"
                            value={editData.marks}
                            onChange={changeHandler}
                            placeholder="Marks"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="grade"
                            value={editData.grade}
                            onChange={changeHandler}
                            placeholder="Grade"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="attendance"
                            value={editData.attendance}
                            onChange={changeHandler}
                            placeholder="Attendance"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="performance"
                            value={editData.performance}
                            onChange={changeHandler}
                            placeholder="Performance"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="duration"
                            value={editData.duration}
                            onChange={changeHandler}
                            placeholder="Duration"
                            className="rounded-xl border p-3"
                          />

                          <input
                            name="issueDate"
                            value={editData.issueDate}
                            onChange={changeHandler}
                            placeholder="Issue Date"
                            className="rounded-xl border p-3"
                          />

                          <textarea
                            name="feedback"
                            value={editData.feedback}
                            onChange={changeHandler}
                            placeholder="Feedback"
                            rows={4}
                            className="md:col-span-2 rounded-xl border p-3"
                          />

                        </div>

                      ) : (

                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                          <Info
                            label="Student Name"
                            value={report.data?.studentName}
                          />

                          <Info
                            label="Course"
                            value={report.data?.courseName || report.course?.title}
                          />

                          <Info
                            label="Marks"
                            value={report.data?.marks}
                          />

                          <Info
                            label="Grade"
                            value={report.data?.grade}
                          />

                          <Info
                            label="Attendance"
                            value={report.data?.attendance}
                          />

                          <Info
                            label="Performance"
                            value={report.data?.performance}
                          />

                          <Info
                            label="Duration"
                            value={report.data?.duration}
                          />

                          <Info
                            label="Issue Date"
                            value={report.data?.issueDate}
                          />

                          <Info
                            label="Feedback"
                            value={report.data?.feedback}
                          />

                        </div>

                      )
                    }


                    {
                      report.reportFile && (

                        <a
                          href={`http://localhost:5000${report.reportFile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
                        >

                          <FiFileText className="mr-2" />

                          View Report

                        </a>

                      )
                    }


                    <div className="mt-6 flex flex-wrap gap-3">

                      {
                        isEditing ? (

                          <>

                            <button
                              onClick={() => saveChanges(report._id)}
                              disabled={saving}
                              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white"
                            >

                              <FiSave />

                              {saving
                                ? "Saving..."
                                : "Save Changes"
                              }

                            </button>


                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditData({});
                              }}
                              className="rounded-xl border px-5 py-3"
                            >
                              Cancel
                            </button>

                          </>

                        ) : (

                          <button
                            onClick={() => startEdit(report)}
                            className="flex items-center gap-2 rounded-xl border px-5 py-3"
                          >

                            <FiEdit3 />

                            Edit Details

                          </button>

                        )
                      }


                      <button
                        onClick={() => approveReport(report._id)}
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"
                      >

                        <FiCheckCircle />

                        Approve

                      </button>


                      <button
                        onClick={() => rejectReport(report._id)}
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


const Info = ({ label, value }) => {

  return (

    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value || "-"}
      </p>

    </div>

  );

};


export default ReportsVerification;