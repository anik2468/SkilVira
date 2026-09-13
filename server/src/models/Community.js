import mongoose from "mongoose";

const communitySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 3000,
      },

      type: {
        type: String,
        enum: [
          "student",
          "professional",
          "technical",
          "career",
          "general",
        ],
        default: "student",
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      // =========================================
      // OWNER
      // =========================================

      ambassador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // =========================================
      // COLLEGE
      // =========================================

      collegeId: {
        type: String,
        default: "",
        trim: true,
        index: true,
      },

      collegeName: {
        type: String,
        default: "",
        trim: true,
      },

      universityId: {
        type: String,
        default: "",
        trim: true,
      },

      universityName: {
        type: String,
        default: "",
        trim: true,
      },

      // =========================================
      // MEDIA
      // =========================================

      logo: {
        type: String,
        default: "",
      },

      banner: {
        type: String,
        default: "",
      },

      // =========================================
      // COMMUNITY SETTINGS
      // =========================================

      rules: {
        type: String,
        default: "",
        trim: true,
      },

      joinMode: {
        type: String,
        enum: [
          "open",
          "approval",
          "invite-only",
        ],
        default: "open",
      },

      joinLink: {
        type: String,
        default: "",
      },

      memberCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "active",
          "archived",
        ],
        default: "active",
      },

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

communitySchema.index({
  ambassador: 1,
  isDeleted: 1,
});

communitySchema.index({
  collegeId: 1,
  status: 1,
});

export default mongoose.model(
  "Community",
  communitySchema
);