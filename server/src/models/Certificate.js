import mongoose from "mongoose";
import Referral from "./Referral.js";
import User from "./User.js";

const certificateSchema =
  new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      issuer: {
        type: String,
        required: true,
      },

      issueDate: {
        type: Date,
        required: true,
      },

      expiryDate: {
        type: Date,
      },

      credentialId: {
        type: String,
        default: "",
      },

      credentialUrl: {
        type: String,
        default: "",
      },

      certificateFile: {
        type: String,
        default: "",
      },

      skills: [
        {
          type: String,
        },
      ],

      verified: {
        type: Boolean,
        default: false,
      },

      rejected: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// =========================================
// REFERRAL CERTIFICATE TRACKING
// =========================================

certificateSchema.post(
  "save",
  async function (certificate) {
    try {
      const student =
        await User.findById(
          certificate.student
        ).select(
          "referredBy"
        );

      if (!student?.referredBy) {
        return;
      }

      const referral =
        await Referral.findOne({
          ambassador:
            student.referredBy,

          student:
            certificate.student,

          registered: true,

          isDeleted: false,
        }).sort({
          createdAt: -1,
        });

      if (!referral) {
        return;
      }

      referral.certificateIssued =
        true;

      referral.certificateIssuedAt =
        referral.certificateIssuedAt ||
        new Date();

      referral.certificate =
        certificate._id;

      await referral.save();
    } catch (error) {
      console.error(
        "REFERRAL CERTIFICATE TRACKING ERROR:",
        error
      );
    }
  }
);

export default mongoose.model(
  "Certificate",
  certificateSchema
);