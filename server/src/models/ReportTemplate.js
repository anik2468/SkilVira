import mongoose from "mongoose";


const reportTemplateSchema = new mongoose.Schema(

  {

    name: {
      type: String,
      required: true,
      trim: true,
    },


    // Course / Internship / Achievement report
    type: {
      type: String,
      enum: [
        "course",
        "internship",
        "achievement",
      ],
      default: "course",
    },


    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },


    templateFile: {
      type: String,
      required: true,
    },


    // Employee decides which fields
    // should appear in the report
    fields: {

      studentName: {
        type: Boolean,
        default: true,
      },

      courseName: {
        type: Boolean,
        default: true,
      },

      marks: {
        type: Boolean,
        default: true,
      },

      grade: {
        type: Boolean,
        default: true,
      },

      attendance: {
        type: Boolean,
        default: false,
      },

      duration: {
        type: Boolean,
        default: false,
      },

      performance: {
        type: Boolean,
        default: true,
      },

      feedback: {
        type: Boolean,
        default: true,
      },

      issueDate: {
        type: Boolean,
        default: true,
      },

      reportId: {
        type: Boolean,
        default: true,
      },

      instructorName: {
        type: Boolean,
        default: false,
      },

    },


    // Future drag & drop positioning
    positions: {

      studentName: {
        x: Number,
        y: Number,
      },

      courseName: {
        x: Number,
        y: Number,
      },

      marks: {
        x: Number,
        y: Number,
      },

      grade: {
        x: Number,
        y: Number,
      },

      attendance: {
        x: Number,
        y: Number,
      },

      duration: {
        x: Number,
        y: Number,
      },

      performance: {
        x: Number,
        y: Number,
      },

      feedback: {
        x: Number,
        y: Number,
      },

      issueDate: {
        x: Number,
        y: Number,
      },

      reportId: {
        x: Number,
        y: Number,
      },

      instructorName: {
        x: Number,
        y: Number,
      },

    },


    requiresApproval: {
      type: Boolean,
      default: true,
    },


    isActive: {
      type: Boolean,
      default: true,
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

  },

  {
    timestamps: true,
  }

);


export default mongoose.model(
  "ReportTemplate",
  reportTemplateSchema
);