import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import GeneratedOfferLetter from "../models/GeneratedOfferLetter.js";
import GeneratedCertificate from "../models/GeneratedCertificate.js";
import GeneratedReport from "../models/GeneratedReport.js";
import Application from "../models/Application.js";

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const buildStep = (label, status, message, data = null) => ({
  label,
  status,
  message,
  data,
});

export const getMyStatus = async (req, res) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await Payment.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .populate("course", "title name")
      .populate(
        "internship",
        "title company companyLogo internshipType workMode location duration"
      )
      .sort({ createdAt: -1 })
      .lean();

    if (!payments.length) {
      return res.status(200).json({
        success: true,
        data: [],
        count: 0,
      });
    }

    const paymentIds = payments.map((item) => item._id);

    const enrollments = await Enrollment.find({
      student: studentId,
      payment: { $in: paymentIds },
      isDeleted: { $ne: true },
    })
      .populate("course", "title name")
      .populate(
        "internship",
        "title company companyLogo internshipType workMode location duration"
      )
      .populate("offerLetter")
      .populate("certificate")
      .populate("report")
      .sort({ createdAt: -1 })
      .lean();

    const applications = await Application.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const offerLetters = await GeneratedOfferLetter.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const certificates = await GeneratedCertificate.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const reports = await GeneratedReport.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = payments.map((payment) => {
      const enrollment = enrollments.find(
        (item) =>
          String(item.payment) === String(payment._id)
      );

      const application = applications.find(
        (item) => String(item.payment) === String(payment._id)
      );

      const offerLetter =
        enrollment?.offerLetter ||
        offerLetters.find((item) => {
          return (
            String(item.payment || "") === String(payment._id) ||
            (enrollment &&
              String(item.enrollment || "") === String(enrollment._id))
          );
        }) ||
        null;

      const certificate =
        enrollment?.certificate ||
        certificates.find((item) => {
          return (
            enrollment &&
            (String(item.enrollment || "") === String(enrollment._id) ||
              String(item.student || "") === String(studentId))
          );
        }) ||
        null;

      const report =
        enrollment?.report ||
        reports.find((item) => {
          return (
            enrollment &&
            (String(item.enrollment || "") === String(enrollment._id) ||
              String(item.student || "") === String(studentId))
          );
        }) ||
        null;

      const paymentStatus = payment.status;

      let paymentStep = "pending";

      if (paymentStatus === "approved") {
        paymentStep = "completed";
      } else if (paymentStatus === "rejected") {
        paymentStep = "rejected";
      }

      let enrollmentStep = "pending";

      if (enrollment?.status === "Active") {
        enrollmentStep = "completed";
      } else if (enrollment?.status === "Completed") {
        enrollmentStep = "completed";
      } else if (enrollment?.status === "Cancelled") {
        enrollmentStep = "rejected";
      }

      let offerStep = "pending";

      if (offerLetter?.status === "approved") {
        offerStep = "completed";
      } else if (offerLetter?.status === "rejected") {
        offerStep = "rejected";
      } else if (
        offerLetter?.status === "revision" ||
        offerLetter?.status === "pending"
      ) {
        offerStep = "processing";
      }

      let learningStep = "pending";

      if (
        enrollment &&
        enrollment.status !== "Cancelled" &&
        Number(enrollment.progress || 0) > 0
      ) {
        learningStep = "processing";
      }

      if (enrollment?.status === "Completed") {
        learningStep = "completed";
      }

      let certificateStep = "pending";

      if (certificate?.status === "approved") {
        certificateStep = "completed";
      } else if (
        certificate?.status === "pending" ||
        certificate?.status === "revision"
      ) {
        certificateStep = "processing";
      } else if (certificate?.status === "rejected") {
        certificateStep = "rejected";
      }

      let reportStep = "pending";

      if (report?.status === "approved") {
        reportStep = "completed";
      } else if (
        report?.status === "pending" ||
        report?.status === "revision"
      ) {
        reportStep = "processing";
      } else if (report?.status === "rejected") {
        reportStep = "rejected";
      }

      const isInternship = Boolean(payment.internship);
      const programName =
        payment?.course?.title ||
        payment?.course?.name ||
        payment?.internship?.title ||
        "Program";

      const companyName =
        payment?.internship?.company ||
        offerLetter?.data?.companyName ||
        "";

      return {
        id: payment._id,
        paymentId: payment._id,

        type: payment.type,

        program: {
          name: programName,
          company: companyName,
          isInternship,
          course: payment.course || null,
          internship: payment.internship || null,
        },

        amount: {
          original: payment.originalAmount,
          discount: payment.discountAmount,
          final: payment.finalAmount,
        },

        payment: {
          status: payment.status,
          method: payment.paymentMethod,
          transactionReference: payment.transactionReference,
          submittedAt: payment.createdAt,
          approvedAt: payment.verifiedAt,
          rejectionReason: payment.rejectionReason || "",
        },

        enrollment: enrollment || null,

        application: application || null,

        offerLetter: offerLetter || null,

        certificate: certificate || null,

        report: report || null,

        steps: [
          buildStep(
            "Payment",
            paymentStep,
            paymentStatus === "approved"
              ? "Payment approved"
              : paymentStatus === "rejected"
              ? payment.rejectionReason || "Payment rejected"
              : "Payment submitted and waiting for verification"
          ),

          buildStep(
            "Enrollment",
            enrollmentStep,
            enrollment
              ? enrollment.status === "Completed"
                ? "Enrollment completed"
                : enrollment.status === "Cancelled"
                ? "Enrollment cancelled"
                : "Enrollment is active"
              : "Enrollment will activate after payment approval"
          ),

          buildStep(
            "Offer Letter",
            offerStep,
            offerLetter?.status === "approved"
              ? "Offer letter approved"
              : offerLetter?.status === "revision"
              ? "Offer letter sent back for revision"
              : offerLetter?.status === "rejected"
              ? "Offer letter rejected"
              : offerLetter
              ? "Offer letter is under review"
              : "Offer letter will be generated after approval"
          ),

          buildStep(
            "Learning",
            learningStep,
            enrollment
              ? `${Number(enrollment.progress || 0)}% completed`
              : "Learning has not started yet",
            {
              progress: Number(enrollment?.progress || 0),
            }
          ),

          buildStep(
            "Certificate",
            certificateStep,
            certificate?.status === "approved"
              ? "Certificate approved"
              : certificate?.status
              ? "Certificate is under review"
              : "Certificate will be generated after completion"
          ),

          ...(isInternship
            ? [
                buildStep(
                  "Report",
                  reportStep,
                  report?.status === "approved"
                    ? "Report approved"
                    : report?.status
                    ? "Report is under review"
                    : "Report will be generated after completion"
                ),
              ]
            : []),
        ],
      };
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("getMyStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student status",
      error: error.message,
    });
  }
};

export const getMyStatusById = async (req, res) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const payment = await Payment.findOne({
      _id: id,
      student: studentId,
      isDeleted: { $ne: true },
    })
      .populate("course", "title name description")
      .populate(
        "internship",
        "title company companyLogo companyWebsite internshipType workMode location duration skills description responsibilities requirements perks benefits"
      )
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      payment: payment._id,
      isDeleted: { $ne: true },
    })
      .populate("course", "title name description")
      .populate(
        "internship",
        "title company companyLogo companyWebsite internshipType workMode location duration"
      )
      .populate("offerLetter")
      .populate("certificate")
      .populate("report")
      .lean();

    const application = await Application.findOne({
      student: studentId,
      payment: payment._id,
      isDeleted: { $ne: true },
    }).lean();

    return res.status(200).json({
      success: true,
      data: {
        payment,
        enrollment,
        application,
        offerLetter: enrollment?.offerLetter || null,
        certificate: enrollment?.certificate || null,
        report: enrollment?.report || null,
      },
    });
  } catch (error) {
    console.error("getMyStatusById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application status",
      error: error.message,
    });
  }
};