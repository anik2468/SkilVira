import mongoose from "mongoose";

// ======================================
// USER SCHEMA
// ======================================

const userSchema = new mongoose.Schema(
  {
    // =====================
    // Basic
    // =====================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    // =====================
    // Role
    // =====================

    role: {
      type: String,
      enum: [
        "student",
        "recruiter",
        "ambassador",
        "employee",
        "control",
      ],
      default: "student",
    },

    // =====================
    // Referral System
    // =====================

    // Ambassador unique code
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // Student came through which ambassador
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // =====================
    // Verification
    // =====================

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // =====================
    // Approval System
    // =====================

    recruiterApproved: {
      type: Boolean,
      default: false,
    },

    ambassadorApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    companyVerified: {
      type: Boolean,
      default: false,
    },

    // =====================
    // OAuth
    // =====================

    googleId: {
      type: String,
      default: "",
    },

    linkedinId: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: [
        "local",
        "google",
        "linkedin",
      ],
      default: "local",
    },

    // =====================
    // Account
    // =====================

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "blocked",
        "deleted",
      ],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // =====================
    // Password Reset
    // =====================

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpire: {
      type: Date,
    },

    // =====================
    // Login
    // =====================

    lastLogin: Date,

    lastActive: Date,

    refreshToken: {
      type: String,
      default: "",
    },

    notificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// Hide Sensitive Data
// ======================================

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.refreshToken;

  return obj;
};

// ======================================
// AUTOMATIC REFERRAL REGISTRATION TRACKING
// ======================================
//
// When a student is created with
// referredBy = ambassador ID:
//
// 1. Referral record is created
// 2. registered = true
// 3. Ambassador totalReferrals increases
//
// Employee does NOT generate anything here.
// ======================================

userSchema.post(
  "save",
  async function (user) {
    try {
      // Only students with a referrer
      if (
        user.role !== "student" ||
        !user.referredBy
      ) {
        return;
      }

      // Avoid circular/static import problems
      const Referral =
        mongoose.model("Referral");

      const AmbassadorProfile =
        mongoose.model(
          "AmbassadorProfile"
        );

      // Find ambassador profile
      const profile =
        await AmbassadorProfile.findOne({
          user: user.referredBy,
        });

      if (!profile) {
        console.warn(
          "Referral tracking skipped: Ambassador profile not found."
        );

        return;
      }

      // Prevent duplicate registration records
      const existing =
        await Referral.findOne({
          ambassador:
            user.referredBy,

          student:
            user._id,

          registered: true,

          isDeleted: false,
        });

      if (existing) {
        return;
      }

      // Create referral registration record
      await Referral.create({
        ambassador:
          user.referredBy,

        student:
          user._id,

        code:
          profile.referralCode,

        registered: true,

        registeredAt:
          new Date(),

        status: "Active",
      });

      // Increase ambassador registration count
      await AmbassadorProfile.updateOne(
        {
          _id: profile._id,
        },
        {
          $inc: {
            totalReferrals: 1,
          },
        }
      );
    } catch (error) {
      console.error(
        "AUTOMATIC REFERRAL REGISTRATION ERROR:",
        error
      );

      // Referral tracking failure should NOT
      // break successful student registration.
    }
  }
);

// ======================================
// EXPORT
// ======================================

export default mongoose.model(
  "User",
  userSchema
);