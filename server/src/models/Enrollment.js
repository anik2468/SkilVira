import mongoose from "mongoose";
import Referral from "./Referral.js";
import User from "./User.js";

const enrollmentSchema =
  new mongoose.Schema(
    {
      // =========================================
      // STUDENT
      // =========================================

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // =========================================
      // COURSE
      // =========================================

      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null,
      },

      // =========================================
      // INTERNSHIP
      // =========================================

      internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        default: null,
      },

      // =========================================
      // PAYMENT
      // =========================================

      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
        index: true,
      },

      // =========================================
      // DATES
      // =========================================

      enrollmentDate: {
        type: Date,
        default: Date.now,
      },

      startDate: {
        type: Date,
        default: null,
      },

      completionDate: {
        type: Date,
        default: null,
      },

      // =========================================
      // PROGRESS
      // =========================================

      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      // =========================================
      // STATUS
      // =========================================

      status: {
        type: String,
        enum: [
          "Active",
          "Completed",
          "Cancelled",
        ],
        default: "Active",
      },

      // =========================================
      // OFFER LETTER
      // =========================================

      offerLetter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GeneratedOfferLetter",
        default: null,
      },

      offerLetterGenerated: {
        type: Boolean,
        default: false,
      },

      offerLetterSent: {
        type: Boolean,
        default: false,
      },

      // =========================================
      // CERTIFICATE
      // =========================================

      certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GeneratedCertificate",
        default: null,
      },

      certificateGenerated: {
        type: Boolean,
        default: false,
      },

      certificateSent: {
        type: Boolean,
        default: false,
      },

      // =========================================
      // REPORT
      // =========================================

      report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GeneratedReport",
        default: null,
      },

      reportGenerated: {
        type: Boolean,
        default: false,
      },

      reportSent: {
        type: Boolean,
        default: false,
      },

      // =========================================
      // COMPLETION
      // =========================================

      completionTriggered: {
        type: Boolean,
        default: false,
      },

      // =========================================
      // NOTES
      // =========================================

      notes: {
        type: String,
        default: "",
        trim: true,
      },

      // =========================================
      // SOFT DELETE
      // =========================================

      isDeleted: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

// =========================================
// VALIDATION
// =========================================

enrollmentSchema.pre(
  "validate",
  function (next) {
    if (
      !this.course &&
      !this.internship
    ) {
      return next(
        new Error(
          "Enrollment must have either a course or internship."
        )
      );
    }

    next();
  }
);

// =========================================
// REFERRAL ENROLLMENT TRACKING
// =========================================

enrollmentSchema.post(
  "save",
  async function (enrollment) {
    try {
      if (
        enrollment.isDeleted ||
        ![
          "Active",
          "Completed",
        ].includes(
          enrollment.status
        )
      ) {
        return;
      }

      const student =
        await User.findById(
          enrollment.student
        ).select(
          "referredBy"
        );

      if (!student?.referredBy) {
        return;
      }

      const referral =
        await Referral.findOne({
          ambassador:
            student.referredBy,

          student:
            enrollment.student,

          registered: true,

          isDeleted: false,
        }).sort({
          createdAt: -1,
        });

      if (!referral) {
        return;
      }

      referral.enrolled =
        true;

      referral.enrolledAt =
        referral.enrolledAt ||
        new Date();

      referral.enrollment =
        enrollment._id;

      referral.product =
        enrollment.course ||
        enrollment.internship ||
        null;

      referral.productType =
        enrollment.course
          ? "course"
          : enrollment.internship
          ? "internship"
          : null;

      try {
        const Payment =
          mongoose.model(
            "Payment"
          );

        const payment =
          await Payment.findById(
            enrollment.payment
          ).select(
            "discountAmount ambassador referralCode"
          );

        if (payment) {
          referral.payment =
            payment._id;

          referral.discountAmount =
            Number(
              payment.discountAmount ||
                0
            );
        }
      } catch (paymentError) {
        console.error(
          "REFERRAL PAYMENT LINK ERROR:",
          paymentError
        );
      }

      referral.status =
        "Used";

      await referral.save();
    } catch (error) {
      console.error(
        "REFERRAL ENROLLMENT TRACKING ERROR:",
        error
      );
    }
  }
);

export default mongoose.model(
  "Enrollment",
  enrollmentSchema
);