import mongoose from "mongoose";

const offerLetterTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "course",
        "internship",
        "job",
        "achievement",
      ],
      default: "internship",
    },

    // ================================
    // OPTIONAL SPECIFIC ASSIGNMENT
    // ================================

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      default: null,
    },

    // ================================
    // TEMPLATE FILE
    // ================================

    templateFile: {
      type: String,
      required: true,
    },

    // ================================
    // DYNAMIC FIELDS
    // ================================

    fields: {
      studentName: {
        type: Boolean,
        default: true,
      },

      role: {
        type: Boolean,
        default: true,
      },

      companyName: {
        type: Boolean,
        default: true,
      },

      duration: {
        type: Boolean,
        default: true,
      },

      joiningDate: {
        type: Boolean,
        default: true,
      },

      endDate: {
        type: Boolean,
        default: false,
      },

      stipend: {
        type: Boolean,
        default: true,
      },

      location: {
        type: Boolean,
        default: false,
      },

      workMode: {
        type: Boolean,
        default: false,
      },

      offerId: {
        type: Boolean,
        default: true,
      },

      issueDate: {
        type: Boolean,
        default: true,
      },

      reportingManager: {
        type: Boolean,
        default: false,
      },

      qrCode: {
        type: Boolean,
        default: true,
      },
    },

    // ================================
    // FIELD POSITIONS
    // ================================

    positions: {
      studentName: {
        x: Number,
        y: Number,
      },

      role: {
        x: Number,
        y: Number,
      },

      companyName: {
        x: Number,
        y: Number,
      },

      duration: {
        x: Number,
        y: Number,
      },

      joiningDate: {
        x: Number,
        y: Number,
      },

      endDate: {
        x: Number,
        y: Number,
      },

      stipend: {
        x: Number,
        y: Number,
      },

      location: {
        x: Number,
        y: Number,
      },

      workMode: {
        x: Number,
        y: Number,
      },

      offerId: {
        x: Number,
        y: Number,
      },

      issueDate: {
        x: Number,
        y: Number,
      },

      reportingManager: {
        x: Number,
        y: Number,
      },

      qrCode: {
        x: Number,
        y: Number,
      },
    },

    requiresApproval: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "OfferLetterTemplate",
  offerLetterTemplateSchema
);