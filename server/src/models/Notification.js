import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema(

  {

    // =========================================
    // RECEIVER
    // =========================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    // =========================================
    // NOTIFICATION TYPE
    // =========================================

    type: {
      type: String,
      enum: [
        "payment",
        "offer_letter",
        "certificate",
        "report",
        "application",
        "course",
        "internship",
        "system",
      ],
      default: "system",
    },


    // =========================================
    // TITLE
    // =========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },


    // =========================================
    // MESSAGE
    // =========================================

    message: {
      type: String,
      required: true,
      trim: true,
    },


    // =========================================
    // OPTIONAL RELATED RECORD
    // =========================================

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },


    referenceModel: {
      type: String,
      enum: [
        "Payment",
        "Enrollment",
        "GeneratedOfferLetter",
        "GeneratedCertificate",
        "GeneratedReport",
        "Application",
        "Course",
        "Internship",
        null,
      ],
      default: null,
    },


    // =========================================
    // FRONTEND TARGET
    // =========================================

    link: {
      type: String,
      default: "",
      trim: true,
    },


    // =========================================
    // READ STATUS
    // =========================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },


    readAt: {
      type: Date,
      default: null,
    },


    // =========================================
    // SOFT DELETE
    // =========================================

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
  "Notification",
  notificationSchema
);