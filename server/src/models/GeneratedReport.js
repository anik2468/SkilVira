import mongoose from "mongoose";


const generatedReportSchema = new mongoose.Schema(

  {

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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


    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportTemplate",
      required: true,
    },


    // Employee can modify these values
    data: {

      studentName: {
        type: String,
        default: "",
      },

      courseName: {
        type: String,
        default: "",
      },

      marks: {
        type: String,
        default: "",
      },

      grade: {
        type: String,
        default: "",
      },

      attendance: {
        type: String,
        default: "",
      },

      duration: {
        type: String,
        default: "",
      },

      performance: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      issueDate: {
        type: String,
        default: "",
      },

      reportId: {
        type: String,
        default: "",
      },

      instructorName: {
        type: String,
        default: "",
      },

    },


    reportFile: {
      type: String,
      default: "",
    },


    status: {
      type: String,
      enum: [
        "pending",
        "revision",
        "approved",
        "rejected",
      ],
      default: "pending",
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


    employeeRemark: {
      type: String,
      default: "",
    },


    emailSent: {
      type: Boolean,
      default: false,
    },


    emailSentAt: {
      type: Date,
      default: null,
    },

  },

  {
    timestamps: true,
  }

);


export default mongoose.model(
  "GeneratedReport",
  generatedReportSchema
);