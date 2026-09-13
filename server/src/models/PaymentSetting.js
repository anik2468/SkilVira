import mongoose from "mongoose";

const paymentSettingSchema = new mongoose.Schema(
  {
    qrCode: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
      trim: true,
    },

    accountHolderName: {
      type: String,
      default: "",
      trim: true,
    },

    accountNumber: {
      type: String,
      default: "",
      trim: true,
    },

    ifscCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    bankName: {
      type: String,
      default: "",
      trim: true,
    },

    branch: {
      type: String,
      default: "",
      trim: true,
    },

    paymentInstructions: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    updatedBy: {
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
  "PaymentSetting",
  paymentSettingSchema
);