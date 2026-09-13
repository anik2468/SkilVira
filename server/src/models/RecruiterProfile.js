import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    // =====================================
    // User
    // =====================================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // =====================================
    // Company Information
    // =====================================
    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    foundedYear: {
      type: Number,
    },

    headquarters: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // =====================================
    // Contact
    // =====================================
    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    hrName: {
      type: String,
      default: "",
    },

    hrDesignation: {
      type: String,
      default: "",
    },

    // =====================================
    // Description
    // =====================================
    about: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },

    vision: {
      type: String,
      default: "",
    },

    // =====================================
    // Social Links
    // =====================================
    linkedin: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    // =====================================
    // Verification
    // =====================================
    isVerified: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Number,
      default: 0,
    },

    // =====================================
    // Analytics
    // =====================================
    totalInternships: {
      type: Number,
      default: 0,
    },

    totalApplications: {
      type: Number,
      default: 0,
    },

    totalHires: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema
);