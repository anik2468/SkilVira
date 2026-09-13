import mongoose from "mongoose";
import crypto from "crypto";

const createReferralCode = () => {
  const randomPart = crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `SKV${randomPart}`;
};

const ambassadorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // =========================================
    // COLLEGE / UNIVERSITY
    // =========================================

    college: {
      type: String,
      default: "",
      trim: true,
    },

    university: {
      type: String,
      default: "",
      trim: true,
    },

    collegeId: {
      type: String,
      default: "",
      trim: true,
    },

    universityId: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================================
    // AUTO REFERRAL CODE
    // =========================================

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    totalReferrals: {
      type: Number,
      default: 0,
      min: 0,
    },

    successfulReferrals: {
      type: Number,
      default: 0,
      min: 0,
    },

    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    rank: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================================
    // PROFILE
    // =========================================

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    profileCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// AUTO GENERATE REFERRAL CODE
// Mongoose 9 compatible middleware
// =========================================

ambassadorProfileSchema.pre(
  "save",
  async function () {
    if (!this.referralCode) {
      let referralCode = "";
      let isUnique = false;

      while (!isUnique) {
        referralCode = createReferralCode();

        const existing =
          await mongoose
            .model("AmbassadorProfile")
            .findOne({
              referralCode,
              _id: {
                $ne: this._id,
              },
            })
            .select("_id")
            .lean();

        if (!existing) {
          isUnique = true;
        }
      }

      this.referralCode =
        referralCode;
    }
  }
);

// =========================================
// SYNC CODE TO USER
// Employee is NOT involved.
// =========================================

ambassadorProfileSchema.post(
  "save",
  async function (doc) {
    try {
      const User =
        mongoose.model("User");

      await User.updateOne(
        {
          _id: doc.user,
        },
        {
          $set: {
            referralCode:
              doc.referralCode,
          },
        }
      );
    } catch (error) {
      console.error(
        "AMBASSADOR REFERRAL CODE SYNC ERROR:",
        error
      );
    }
  }
);

export default mongoose.model(
  "AmbassadorProfile",
  ambassadorProfileSchema
);