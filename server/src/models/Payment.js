import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // =================================================
    // STUDENT
    // =================================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =================================================
    // PRODUCT TYPE
    // =================================================

    type: {
      type: String,
      enum: [
        "course",
        "internship",
      ],
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

    // =================================================
    // AMOUNT
    // =================================================

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

    // =================================================
    // REFERRAL
    // =================================================

    referralCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

  studentReferralDiscountType: { type: String, enum: ["percent", "fixed"] },
  studentReferralDiscountValue: { type: Number, min: 0 },
  ambassadorCommissionType: { type: String, enum: ["percent", "fixed"] },
  ambassadorCommissionValue: { type: Number, min: 0 },
  ambassadorCommissionAmount: { type: Number, min: 0 },


    ambassador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // =================================================
    // RAZORPAY
    //
    // Kept for current backend support and
    // future online payment activation.
    // =================================================

    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // MANUAL PAYMENT
    // =================================================

    paymentMode: {
      type: String,
      enum: ["manual", "razorpay"],
      index: true,
    },

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

    // =================================================
    // PAYMENT STATUS
    // =================================================

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
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

    // =================================================
    // OFFER LETTER
    // =================================================

    offerLetterGenerated: {
      type: Boolean,
      default: false,
    },

    offerLetter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneratedOfferLetter",
      default: null,
    },

    // =================================================
    // SOFT DELETE
    // =================================================

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


// =================================================
// INDEXES
// =================================================

paymentSchema.index({
  student: 1,
  status: 1,
});

paymentSchema.index({
  student: 1,
  course: 1,
  internship: 1,
});

paymentSchema.index({
  ambassador: 1,
  status: 1,
});


export default mongoose.model(
  "Payment",
  paymentSchema
);