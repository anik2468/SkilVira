import mongoose from "mongoose";

const reportTemplateSchema = new mongoose.Schema(
  {
    // =====================================================
    // TEMPLATE NAME
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // REPORT TYPE
    // =====================================================

    type: {
      type: String,
      enum: [
        "course",
        "internship",
        "achievement",
      ],
      default: "course",
    },

    // =====================================================
    // COURSE
    // =====================================================

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    // =====================================================
    // INTERNSHIP
    // =====================================================

    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      default: null,
    },

    // =====================================================
    // TEMPLATE FILE
    // =====================================================

    templateFile: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // DYNAMIC FIELDS
    // Employee decides which fields appear
    // =====================================================

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

    // =====================================================
    // FIELD POSITIONS
    // =====================================================

    positions: {
      studentName: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      courseName: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      marks: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      grade: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      attendance: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      duration: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      performance: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      feedback: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      issueDate: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      reportId: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },

      instructorName: {
        x: {
          type: Number,
          default: null,
        },
        y: {
          type: Number,
          default: null,
        },
      },
    },

    // =====================================================
    // APPROVAL
    // =====================================================

    requiresApproval: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // ACTIVE / INACTIVE
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // CREATED BY
    // =====================================================

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