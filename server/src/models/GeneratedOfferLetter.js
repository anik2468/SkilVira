import mongoose from "mongoose";

const generatedOfferLetterSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      default: null,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfferLetterTemplate",
      required: true,
    },

    // ================================
    // AUTO-FILLED + EMPLOYEE EDITABLE
    // ================================

    data: {
      studentName: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default: "",
      },

      companyName: {
        type: String,
        default: "",
      },

      duration: {
        type: String,
        default: "",
      },

      joiningDate: {
        type: String,
        default: "",
      },

      endDate: {
        type: String,
        default: "",
      },

      stipend: {
        type: String,
        default: "",
      },

      location: {
        type: String,
        default: "",
      },

      workMode: {
        type: String,
        default: "",
      },

      offerId: {
        type: String,
        default: "",
      },

      issueDate: {
        type: String,
        default: "",
      },

      reportingManager: {
        type: String,
        default: "",
      },
    },

    offerLetterFile: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "revision",
        "approved",
        "rejected",
      ],
      default: "pending",
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

export default mongoose.model(
  "GeneratedOfferLetter",
  generatedOfferLetterSchema
);