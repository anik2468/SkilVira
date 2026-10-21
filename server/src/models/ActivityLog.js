import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      maxlength: 300,
    },
    entityType: { type: String, default: "" },
    entityId: { type: String, default: "" },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    method: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
      maxlength: 500,
    },
    statusCode: {
      type: Number,
      default: 0,
    },
    success: {
      type: Boolean,
      default: false,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ actorRole: 1, createdAt: -1 });

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);