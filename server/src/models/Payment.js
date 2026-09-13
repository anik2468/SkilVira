import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["course", "internship"],
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

    originalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    referralCode: {
      type: String,
      default: "",
      trim: true,
    },

    ambassador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ================================
    // MANUAL PAYMENT
    // ================================

    paymentMethod: {
      type: String,
      enum: [
        "upi",
        "bank_transfer",
        "card",
        "cash",
        "other",
      ],
      default: "upi",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    transactionReference: {
      type: String,
      default: "",
      trim: true,
    },

    paymentNote: {
      type: String,
      default: "",
      trim: true,
    },

    // ================================
    // PAYMENT STATUS
    // ================================

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
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

    // ================================
    // OFFER LETTER
    // ================================

    offerLetterGenerated: {
      type: Boolean,
      default: false,
    },

    offerLetter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneratedOfferLetter",
      default: null,
    },

    // ================================
    // SOFT DELETE
    // ================================

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Payment",
  paymentSchema
);