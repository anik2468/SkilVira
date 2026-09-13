import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Certificate / Report
    category: {
      type: String,
      enum: ["certificate", "report"],
      default: "certificate",
    },

    // Course / Internship / Achievement
    type: {
      type: String,
      enum: ["course", "internship", "achievement"],
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

    // =====================================================
    // EMPLOYEE SELECTED DYNAMIC FIELDS
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
        default: false,
      },

      grade: {
        type: Boolean,
        default: false,
      },

      duration: {
        type: Boolean,
        default: false,
      },

      attendance: {
        type: Boolean,
        default: false,
      },

      performance: {
        type: Boolean,
        default: false,
      },

      feedback: {
        type: Boolean,
        default: false,
      },

      issueDate: {
        type: Boolean,
        default: true,
      },

      certificateId: {
        type: Boolean,
        default: true,
      },

      qrCode: {
        type: Boolean,
        default: true,
      },
    },

    // =====================================================
    // TEMPLATE FIELD POSITIONS
    // =====================================================

    positions: {
      studentName: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      courseName: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      marks: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      grade: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      duration: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      attendance: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      performance: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      feedback: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      issueDate: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      certificateId: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },

      // ===================================================
      // QR POSITION + SIZE
      // ===================================================

      qrCode: {
        x: {
          type: Number,
          default: 0,
        },

        y: {
          type: Number,
          default: 0,
        },

        width: {
          type: Number,
          default: 120,
        },

        height: {
          type: Number,
          default: 120,
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
  "CertificateTemplate",
  certificateTemplateSchema
);