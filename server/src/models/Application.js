import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ==========================
    // References
    // ==========================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================
    // Resume
    // ==========================
    resume: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Status
    // ==========================
    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Pending",
    },

    recruiterRemarks: {
      type: String,
      default: "",
      trim: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    // ==========================
    // Soft Delete
    // ==========================
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// Prevent Duplicate Applications
// ===================================
applicationSchema.index(
  {
    student: 1,
    internship: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Application",
  applicationSchema
);