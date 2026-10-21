import mongoose from "mongoose";
import Referral from "./Referral.js";
import User from "./User.js";

const generatedCertificateSchema =
  new mongoose.Schema(
    {
      // =================================================
      // STUDENT
      // =================================================

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // =================================================
      // COURSE
      // =================================================

      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null,
      },

      // =================================================
      // INTERNSHIP
      // =================================================

      internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        default: null,
      },

      // =================================================
      // TEMPLATE
      // =================================================

      template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CertificateTemplate",
        required: true,
      },

      // =================================================
      // CERTIFICATE DATA
      // =================================================

      data: {
        studentName: {
          type: String,
          default: "",
          trim: true,
        },

        courseName: {
          type: String,
          default: "",
          trim: true,
        },

        marks: {
          type: String,
          default: "",
        },

        grade: {
          type: String,
          default: "",
        },

        duration: {
          type: String,
          default: "",
        },

        attendance: {
          type: String,
          default: "",
        },

        performance: {
          type: String,
          default: "",
        },

        feedback: {
          type: String,
          default: "",
        },

        issueDate: {
          type: String,
          default: "",
        },

        certificateId: {
          type: String,
          default: "",
        },
      },

      // =================================================
      // FILES
      // =================================================

      certificateFile: {
        type: String,
        default: "",
      },

      // Kept for backward compatibility with old records.
      // Current report flow uses GeneratedReport.
      reportFile: {
        type: String,
        default: "",
      },

      qrCode: {
        type: String,
        default: "",
      },

      // =================================================
      // UNIQUE CERTIFICATE ID
      // =================================================

      certificateId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
      },

      // =================================================
      // VERIFICATION STATUS
      // =================================================

      status: {
        type: String,
        enum: [
          "pending",
          "revision",
          "approved",
          "rejected",
        ],
        default: "pending",
        index: true,
      },

      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },

      employeeRemark: {
        type: String,
        default: "",
      },

      // =================================================
      // EMAIL
      // =================================================

      emailSent: {
        type: Boolean,
        default: false,
      },

      emailSentAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );


// =====================================================
// CERTIFICATE APPROVAL DETECTOR
//
// Referral certificateIssued should become true ONLY
// when certificate changes to "approved".
// Draft / revision / rejected certificate must NOT
// trigger referral certificate issuance.
// =====================================================

generatedCertificateSchema.pre(
  "save",
  function (next) {
    try {
      this.$locals = this.$locals || {};

      this.$locals.certificateJustApproved =
        this.isModified("status") &&
        this.status === "approved";

      next();
    } catch (error) {
      next(error);
    }
  }
);


// =====================================================
// REFERRAL CERTIFICATE TRACKING
//
// Runs after GeneratedCertificate is successfully saved.
// =====================================================

generatedCertificateSchema.post(
  "save",
  async function (certificate) {
    try {
      // Only process the transition to APPROVED.
      if (
        !certificate.$locals
          ?.certificateJustApproved
      ) {
        return;
      }

      // -------------------------------------------------
      // Find student referral owner
      // -------------------------------------------------

      const student =
        await User.findById(
          certificate.student
        ).select(
          "referredBy"
        );

      if (!student?.referredBy) {
        return;
      }

      // -------------------------------------------------
      // Find active referral
      // -------------------------------------------------

      const referral =
        await Referral.findOne({
          ambassador:
            student.referredBy,

          student:
            certificate.student,

          registered: true,

          isDeleted: false,
        }).sort({
          createdAt: -1,
        });

      if (!referral) {
        return;
      }

      // -------------------------------------------------
      // Mark certificate as issued
      // -------------------------------------------------

      referral.certificateIssued =
        true;

      referral.certificateIssuedAt =
        referral.certificateIssuedAt ||
        new Date();

      referral.certificate =
        certificate._id;

      await referral.save();

    } catch (error) {
      console.error(
        "GENERATED CERTIFICATE REFERRAL TRACKING ERROR:",
        error
      );
    } finally {
      // Prevent duplicate processing on later saves.
      if (certificate.$locals) {
        certificate.$locals
          .certificateJustApproved = false;
      }
    }
  }
);


// =====================================================
// MODEL
// =====================================================

export default mongoose.model(
  "GeneratedCertificate",
  generatedCertificateSchema
);