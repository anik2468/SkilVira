import { useEffect, useState } from "react";

import {
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiXCircle,
  FiSave,
} from "react-icons/fi";

import api from "../../services/api";


const API_BASE =
  "http://localhost:5000";


const OfferLetterVerification = () => {

  const [offerLetters, setOfferLetters] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  const [selectedOffer, setSelectedOffer] =
    useState(null);


  useEffect(() => {

    loadOfferLetters();

  }, []);


  // =====================================================
  // LOAD PENDING OFFER LETTERS
  // =====================================================

  const loadOfferLetters = async () => {

    try {

      setLoading(true);

      const { data } =
        await api.get(
          "/generated-offer-letter/pending"
        );


      setOfferLetters(
        data.offerLetters || []
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load offer letters."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // START EDIT
  // =====================================================

  const startEditing = (offer) => {

    setEditingId(
      offer._id
    );


    setEditData({

      studentName:
        offer.data?.studentName ||
        offer.student?.name ||
        "",

      role:
        offer.data?.role ||
        "",

      companyName:
        offer.data?.companyName ||
        offer.internship?.company ||
        "SkilVira",

      duration:
        offer.data?.duration ||
        offer.internship?.duration ||
        offer.course?.duration ||
        "",

      joiningDate:
        offer.data?.joiningDate ||
        "",

      endDate:
        offer.data?.endDate ||
        "",

      stipend:
        offer.data?.stipend ||
        "",

      location:
        offer.data?.location ||
        offer.internship?.location ||
        "",

      workMode:
        offer.data?.workMode ||
        offer.internship?.workMode ||
        "",

      offerId:
        offer.data?.offerId ||
        "",

      issueDate:
        offer.data?.issueDate ||
        "",

      reportingManager:
        offer.data?.reportingManager ||
        "",

    });

  };


  // =====================================================
  // HANDLE EDIT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setEditData((prev) => ({

      ...prev,

      [name]:
        value,

    }));

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEditing = () => {

    setEditingId(null);

    setEditData({});

  };


  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveChanges = async (
    id
  ) => {

    try {

      setProcessingId(id);

      await api.put(

        `/generated-offer-letter/${id}/update`,

        {
          data:
            editData,
        }

      );


      alert(
        "Offer letter details updated successfully."
      );


      cancelEditing();

      setSelectedOffer(null);

      await loadOfferLetters();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update offer letter."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // REQUEST REVISION
  // =====================================================

  const requestRevision = async (
    offer
  ) => {

    const remark =
      window.prompt(
        "Enter revision instructions:"
      );


    if (!remark?.trim()) {
      return;
    }


    try {

      setProcessingId(
        offer._id
      );


      await api.put(

        `/generated-offer-letter/${offer._id}/revision`,

        {
          remark:
            remark.trim(),
        }

      );


      alert(
        "Revision requested successfully."
      );


      setSelectedOffer(null);

      await loadOfferLetters();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to request revision."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // APPROVE
  // =====================================================

  const approveOfferLetter = async (
    offer
  ) => {

    const confirmed =
      window.confirm(
        `Approve offer letter for ${
          offer.student?.name ||
          "this student"
        }?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(
        offer._id
      );


      const { data } =
        await api.put(

          `/generated-offer-letter/${offer._id}/approve`

        );


      alert(
        data.message ||
        "Offer letter approved successfully."
      );


      setSelectedOffer(null);

      await loadOfferLetters();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to approve offer letter."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // REJECT
  // =====================================================

  const rejectOfferLetter = async (
    offer
  ) => {

    const reason =
      window.prompt(
        "Enter rejection reason:"
      );


    if (!reason?.trim()) {
      return;
    }


    try {

      setProcessingId(
        offer._id
      );


      const { data } =
        await api.put(

          `/generated-offer-letter/${offer._id}/reject`,

          {
            reason:
              reason.trim(),
          }

        );


      alert(
        data.message ||
        "Offer letter rejected successfully."
      );


      setSelectedOffer(null);

      await loadOfferLetters();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to reject offer letter."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // FILTER
  // =====================================================

  const filteredOfferLetters =
    offerLetters.filter(
      (offer) => {

        const studentName =
          offer.student?.name ||
          offer.data?.studentName ||
          "";

        const studentEmail =
          offer.student?.email ||
          "";

        const company =
          offer.data?.companyName ||
          offer.internship?.company ||
          "";

        const role =
          offer.data?.role ||
          "";

        const offerId =
          offer.data?.offerId ||
          "";


        const searchable = [

          studentName,

          studentEmail,

          company,

          role,

          offerId,

        ]
          .join(" ")
          .toLowerCase();


        return searchable.includes(
          search.toLowerCase()
        );

      }
    );


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


      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <FiFileText
              className="text-[#D4AF37]"
            />

            Offer Letter Verification

          </h1>

          <p className="mt-2 text-gray-500">

            Review, edit and approve offer letters before sending them to students.

          </p>

        </div>


        <button

          onClick={
            loadOfferLetters
          }

          className="flex w-fit items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"

        >

          <FiRefreshCw />

          Refresh

        </button>

      </div>



      {/* =========================================
          SEARCH
      ========================================== */}

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">

        <div className="relative w-full max-w-md">

          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input

            value={
              search
            }

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search student, company, role, offer ID..."

            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-[#D4AF37]"

          />

        </div>


        <div className="rounded-xl bg-[#D4AF37]/10 px-5 py-3">

          <p className="text-sm text-gray-500">

            Pending Reviews

          </p>

          <p className="text-xl font-bold">

            {filteredOfferLetters.length}

          </p>

        </div>

      </div>



      {/* =========================================
          EMPTY
      ========================================== */}

      {
        filteredOfferLetters.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow">

            <FiCheckCircle
              className="mx-auto text-6xl text-green-500"
            />

            <h2 className="mt-5 text-2xl font-bold">

              No Pending Offer Letters

            </h2>

            <p className="mt-2 text-gray-500">

              Offer letters generated after approved purchases will appear here.

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {
              filteredOfferLetters.map(
                (offer) => {

                  const editing =
                    editingId ===
                    offer._id;


                  const student =
                    offer.student;


                  const programName =
                    offer.internship?.title ||
                    offer.course?.title ||
                    "Program";


                  const isProcessing =
                    processingId ===
                    offer._id;


                  return (

                    <div

                      key={
                        offer._id
                      }

                      className="rounded-3xl bg-white p-6 shadow"

                    >


                      {/* =================================
                          TOP
                      ================================= */}

                      <div className="flex flex-col gap-5 border-b pb-5 md:flex-row md:items-start md:justify-between">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10">

                            <FiUser
                              className="text-xl text-[#D4AF37]"
                            />

                          </div>


                          <div>

                            <h2 className="text-xl font-bold">

                              {
                                student?.name ||
                                offer.data?.studentName ||
                                "Student"
                              }

                            </h2>

                            <p className="text-gray-500">

                              {
                                student?.email ||
                                "No email"
                              }

                            </p>

                            <p className="mt-1 text-sm text-gray-400">

                              {programName}

                            </p>

                          </div>

                        </div>


                        <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                          {offer.status}

                        </span>

                      </div>



                      {/* =================================
                          VIEW DATA
                      ================================= */}

                      {
                        editing ? (

                          <div className="mt-6 grid gap-4 md:grid-cols-2">

                            <Field
                              label="Student Name"
                              name="studentName"
                              value={
                                editData.studentName
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Role"
                              name="role"
                              value={
                                editData.role
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Company Name"
                              name="companyName"
                              value={
                                editData.companyName
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Duration"
                              name="duration"
                              value={
                                editData.duration
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Joining Date"
                              name="joiningDate"
                              value={
                                editData.joiningDate
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="End Date"
                              name="endDate"
                              value={
                                editData.endDate
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Stipend"
                              name="stipend"
                              value={
                                editData.stipend
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Location"
                              name="location"
                              value={
                                editData.location
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Work Mode"
                              name="workMode"
                              value={
                                editData.workMode
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Offer ID"
                              name="offerId"
                              value={
                                editData.offerId
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Issue Date"
                              name="issueDate"
                              value={
                                editData.issueDate
                              }
                              onChange={
                                handleChange
                              }
                            />

                            <Field
                              label="Reporting Manager"
                              name="reportingManager"
                              value={
                                editData.reportingManager
                              }
                              onChange={
                                handleChange
                              }
                            />

                          </div>

                        ) : (

                          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                            <Info
                              label="Student"
                              value={
                                offer.data?.studentName ||
                                student?.name
                              }
                            />

                            <Info
                              label="Role"
                              value={
                                offer.data?.role
                              }
                            />

                            <Info
                              label="Company"
                              value={
                                offer.data?.companyName ||
                                offer.internship?.company
                              }
                            />

                            <Info
                              label="Program"
                              value={
                                programName
                              }
                            />

                            <Info
                              label="Duration"
                              value={
                                offer.data?.duration
                              }
                            />

                            <Info
                              label="Joining Date"
                              value={
                                offer.data?.joiningDate
                              }
                            />

                            <Info
                              label="End Date"
                              value={
                                offer.data?.endDate
                              }
                            />

                            <Info
                              label="Stipend"
                              value={
                                offer.data?.stipend
                              }
                            />

                            <Info
                              label="Location"
                              value={
                                offer.data?.location
                              }
                            />

                            <Info
                              label="Work Mode"
                              value={
                                offer.data?.workMode
                              }
                            />

                            <Info
                              label="Offer ID"
                              value={
                                offer.data?.offerId
                              }
                            />

                            <Info
                              label="Issue Date"
                              value={
                                offer.data?.issueDate
                              }
                            />

                            <Info
                              label="Reporting Manager"
                              value={
                                offer.data?.reportingManager
                              }
                            />

                          </div>

                        )
                      }



                      {/* =================================
                          EXISTING FILE
                      ================================= */}

                      {
                        offer.offerLetterFile && (

                          <div className="mt-6">

                            <a

                              href={
                                getFileUrl(
                                  offer.offerLetterFile
                                )
                              }

                              target="_blank"

                              rel="noreferrer"

                              className="flex w-fit items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"

                            >

                              <FiEye />

                              Preview Offer Letter

                            </a>

                          </div>

                        )
                      }



                      {/* =================================
                          ACTIONS
                      ================================= */}

                      <div className="mt-6 flex flex-wrap gap-3">


                        {
                          editing ? (

                            <>

                              <button

                                onClick={() =>
                                  saveChanges(
                                    offer._id
                                  )
                                }

                                disabled={
                                  isProcessing
                                }

                                className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white disabled:opacity-60"

                              >

                                <FiSave />

                                {
                                  isProcessing
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                              </button>


                              <button

                                onClick={
                                  cancelEditing
                                }

                                className="rounded-xl border px-5 py-3 font-semibold"

                              >

                                Cancel

                              </button>

                            </>

                          ) : (

                            <button

                              onClick={() =>
                                startEditing(
                                  offer
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
                            approveOfferLetter(
                              offer
                            )
                          }

                          disabled={
                            isProcessing
                          }

                          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white disabled:opacity-60"

                        >

                          <FiCheckCircle />

                          {
                            isProcessing
                              ? "Processing..."
                              : "Approve & Send"
                          }

                        </button>


                        <button

                          onClick={() =>
                            requestRevision(
                              offer
                            )
                          }

                          disabled={
                            isProcessing
                          }

                          className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold"

                        >

                          <FiRefreshCw />

                          Revision

                        </button>


                        <button

                          onClick={() =>
                            rejectOfferLetter(
                              offer
                            )
                          }

                          disabled={
                            isProcessing
                          }

                          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white"

                        >

                          <FiXCircle />

                          Reject

                        </button>


                        <button

                          onClick={() =>
                            setSelectedOffer(
                              offer
                            )
                          }

                          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white"

                        >

                          <FiEye />

                          Full Review

                        </button>

                      </div>

                    </div>

                  );

                }
              )
            }

          </div>

        )
      }



      {/* =========================================
          FULL REVIEW MODAL
      ========================================== */}

      {
        selectedOffer && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white">


              <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">

                <div>

                  <h2 className="text-2xl font-bold">

                    Offer Letter Review

                  </h2>

                  <p className="text-sm text-gray-500">

                    Review the complete offer letter details.

                  </p>

                </div>


                <button

                  onClick={() =>
                    setSelectedOffer(
                      null
                    )
                  }

                  className="rounded-xl border px-4 py-2 font-semibold"

                >

                  Close

                </button>

              </div>


              <div className="space-y-6 p-6">


                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <Info
                    label="Student"
                    value={
                      selectedOffer.data?.studentName ||
                      selectedOffer.student?.name
                    }
                  />

                  <Info
                    label="Email"
                    value={
                      selectedOffer.student?.email
                    }
                  />

                  <Info
                    label="Role"
                    value={
                      selectedOffer.data?.role
                    }
                  />

                  <Info
                    label="Company"
                    value={
                      selectedOffer.data?.companyName ||
                      selectedOffer.internship?.company
                    }
                  />

                  <Info
                    label="Duration"
                    value={
                      selectedOffer.data?.duration
                    }
                  />

                  <Info
                    label="Joining Date"
                    value={
                      selectedOffer.data?.joiningDate
                    }
                  />

                  <Info
                    label="End Date"
                    value={
                      selectedOffer.data?.endDate
                    }
                  />

                  <Info
                    label="Stipend"
                    value={
                      selectedOffer.data?.stipend
                    }
                  />

                  <Info
                    label="Location"
                    value={
                      selectedOffer.data?.location
                    }
                  />

                  <Info
                    label="Work Mode"
                    value={
                      selectedOffer.data?.workMode
                    }
                  />

                  <Info
                    label="Offer ID"
                    value={
                      selectedOffer.data?.offerId
                    }
                  />

                  <Info
                    label="Issue Date"
                    value={
                      selectedOffer.data?.issueDate
                    }
                  />

                  <Info
                    label="Reporting Manager"
                    value={
                      selectedOffer.data?.reportingManager
                    }
                  />

                </div>


                {
                  selectedOffer.offerLetterFile && (

                    <a

                      href={
                        getFileUrl(
                          selectedOffer.offerLetterFile
                        )
                      }

                      target="_blank"

                      rel="noreferrer"

                      className="flex w-fit items-center gap-2 rounded-xl border px-5 py-3 font-semibold"

                    >

                      <FiFileText />

                      Open Current PDF

                    </a>

                  )
                }


                <div className="flex flex-wrap gap-3 border-t pt-5">

                  <button

                    onClick={() => {

                      setSelectedOffer(
                        null
                      );

                      startEditing(
                        selectedOffer
                      );

                    }}

                    className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold"

                  >

                    <FiEdit3 />

                    Edit Details

                  </button>


                  <button

                    onClick={() =>
                      approveOfferLetter(
                        selectedOffer
                      )
                    }

                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white"

                  >

                    <FiCheckCircle />

                    Approve & Send

                  </button>


                  <button

                    onClick={() =>
                      requestRevision(
                        selectedOffer
                      )
                    }

                    className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-6 py-3 font-bold"

                  >

                    <FiRefreshCw />

                    Request Revision

                  </button>


                  <button

                    onClick={() =>
                      rejectOfferLetter(
                        selectedOffer
                      )
                    }

                    className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white"

                  >

                    <FiXCircle />

                    Reject

                  </button>

                </div>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


// =====================================================
// FIELD
// =====================================================

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

        type="text"

        name={name}

        value={
          value || ""
        }

        onChange={
          onChange
        }

        className="w-full rounded-xl border p-3 outline-none focus:border-[#D4AF37]"

      />

    </div>

  );

};


// =====================================================
// INFO
// =====================================================

const Info = ({
  label,
  value,
}) => {

  return (

    <div className="rounded-2xl bg-gray-50 p-4">

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="mt-1 break-words font-semibold">

        {value || "-"}

      </p>

    </div>

  );

};


export default OfferLetterVerification;