import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    // =========================================
    // AMBASSADOR
    // =========================================

    ambassador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================================
    // STUDENT
    // null for anonymous click
    // =========================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // =========================================
    // REFERRAL CODE
    // =========================================

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // =========================================
    // PRODUCT
    // Course / Internship
    // =========================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    productType: {
      type: String,
      enum: [
        "course",
        "internship",
        "other",
        null,
      ],
      default: null,
    },

    // =========================================
    // TRACKING
    // =========================================

    clicked: {
      type: Boolean,
      default: false,
    },

    registered: {
      type: Boolean,
      default: false,
    },

    enrolled: {
      type: Boolean,
      default: false,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    // =========================================
    // EVENT DATES
    // =========================================

    clickedAt: {
      type: Date,
      default: null,
    },

    registeredAt: {
      type: Date,
      default: null,
    },

    enrolledAt: {
      type: Date,
      default: null,
    },

    certificateIssuedAt: {
      type: Date,
      default: null,
    },

    // =========================================
    // PAYMENT / DISCOUNT
    // =========================================

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
    },

    // =========================================
    // CERTIFICATE
    // CURRENT FLOW USES GeneratedCertificate
    // =========================================

    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneratedCertificate",
      default: null,
    },

    // =========================================
    // STATUS
    // =========================================

    status: {
      type: String,
      enum: [
        "Active",
        "Used",
        "Expired",
      ],
      default: "Active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// =========================================
// INDEXES
// =========================================

referralSchema.index({
  ambassador: 1,
  code: 1,
});

referralSchema.index({
  student: 1,
  ambassador: 1,
});

referralSchema.index({
  enrolled: 1,
  ambassador: 1,
});

referralSchema.index({
  certificateIssued: 1,
  ambassador: 1,
});


export default mongoose.model(
  "Referral",
  referralSchema
);