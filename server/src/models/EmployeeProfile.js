import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
    },

    designation: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    officeEmail: {
      type: String,
      default: "",
    },

    joiningDate: {
      type: Date,
    },

    qualification: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    profileImage: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    profileCompleted: {
      type: Number,
      default: 0,
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

employeeProfileSchema.index(
  { employeeId: 1 },
  {
    name: "employeeId_unique_string",
    unique: true,
    partialFilterExpression: {
      employeeId: { $type: "string", $gt: "" }
    }
  }
);

export default mongoose.model(
  "EmployeeProfile",
  employeeProfileSchema
);