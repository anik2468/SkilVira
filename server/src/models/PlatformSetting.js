import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "SkilVira",
      trim: true,
    },
    platformLogoUrl: { type: String, default: "", trim: true },
    maintenance: {
      type: Boolean,
      default: false,
    },
    allowRegistration: {
      type: Boolean,
      default: true,
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    smsNotification: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PlatformSetting ||
  mongoose.model("PlatformSetting", platformSettingSchema);