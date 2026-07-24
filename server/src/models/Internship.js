import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    internshipType: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    stipend: {
      type: String,
      required: true,
    },
    lastDate: {
      type: Date,
      required: true,
    },
    skills: [String],
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    perks: String,
    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Internship", internshipSchema);