import GeneratedCertificate from "../models/GeneratedCertificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

import {
  generateCertificate,
} from "../services/certificateGenerator.js";

import path from "path";


// =====================================================
// HELPERS
// =====================================================

const buildTemplatePath = (templateFile) => {
  if (!templateFile) return "";

  const value = String(templateFile).trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return path.resolve(
      process.cwd(),
      value.replace(/^\/+/, "")
    );
  }

  return path.resolve(
    process.cwd(),
    value
  );
};


// =====================================================
// GENERATE STUDENT CERTIFICATE
//
// IMPORTANT:
// This endpoint now creates a DRAFT certificate only.
// It does NOT mark certificate as verified/approved.
//
// Flow:
// Student completion
//       ↓
// Draft certificate + QR
//       ↓
// Employee verification
//       ↓
// Approve / Revision / Reject
//       ↓
// Approved certificate becomes publicly verifiable
// =====================================================

export const generateStudentCertificate = async (
  req,
  res
) => {
  try {
    const {
      studentId,
      courseId,
      internshipId = null,
      templateId = null,
      data = {},
    } = req.body;


    // =================================================
    // VALIDATION
    // =================================================

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }


    if (!courseId && !internshipId) {
      return res.status(400).json({
        success: false,
        message:
          "Course ID or Internship ID is required.",
      });
    }


    // =================================================
    // STUDENT
    // =================================================

    const student = await User.findById(
      studentId
    ).select(
      "name email avatar"
    );


    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }


    // =================================================
    // COURSE
    // =================================================

    let course = null;

    if (courseId) {
      course = await Course.findById(
        courseId
      ).select(
        "title category duration modules"
      );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      }
    }


    // =================================================
    // INTERNSHIP
    // =================================================

    let internship = null;

    if (internshipId) {
      const Internship =
        (
          await import(
            "../models/Internship.js"
          )
        ).default;

      internship =
        await Internship.findById(
          internshipId
        ).select(
          "title company duration location workMode"
        );

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: "Internship not found.",
        });
      }
    }


    // =================================================
    // TEMPLATE
    // =================================================

    let template = null;

    if (templateId) {
      template =
        await CertificateTemplate.findById(
          templateId
        );
    } else {
      template =
        await CertificateTemplate.findOne({
          isActive: true,
          $or: [
            {
              category: "certificate",
            },
            {
              category: {
                $exists: false,
              },
            },
            {
              category: null,
            },
          ],
        }).sort({
          createdAt: -1,
        });
    }


    if (!template) {
      return res.status(404).json({
        success: false,
        message:
          "Certificate template not found.",
      });
    }


    // =================================================
    // TEMPLATE VALIDATION
    // =================================================

    if (!template.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Certificate template is inactive.",
      });
    }


    if (
      template.category &&
      template.category !== "certificate"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected template is not a certificate template.",
      });
    }


    if (!template.templateFile) {
      return res.status(400).json({
        success: false,
        message:
          "Certificate template file is missing.",
      });
    }


    // =================================================
    // DUPLICATE DRAFT PROTECTION
    // =================================================

    const existingDraft =
      await GeneratedCertificate.findOne({
        student: studentId,

        course:
          courseId || null,

        internship:
          internshipId || null,

        status: {
          $in: [
            "pending",
            "revision",
          ],
        },
      });


    if (existingDraft) {
      const populated =
        await GeneratedCertificate.findById(
          existingDraft._id
        )
          .populate(
            "student",
            "name email avatar"
          )
          .populate(
            "course",
            "title category duration"
          )
          .populate(
            "internship",
            "title company duration location workMode"
          )
          .populate(
            "template",
            "name type category fields positions templateFile"
          );


      return res.status(200).json({
        success: true,
        message:
          "A certificate draft already exists and is waiting for employee review.",
        certificate: populated,
      });
    }


    // =================================================
    // CERTIFICATE ID
    // =================================================

    const certificateId =
      data.certificateId ||
      `SKIL-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`;


    // =================================================
    // ISSUE DATE
    // =================================================

    const issueDate =
      data.issueDate ||
      new Date().toLocaleDateString(
        "en-IN"
      );


    // =================================================
    // CERTIFICATE DATA
    // =================================================

    const certificateData = {
      ...data,

      studentName:
        data.studentName ||
        student.name ||
        "Student",

      courseName:
        data.courseName ||
        course?.title ||
        internship?.title ||
        "SkilVira Program",

      marks:
        data.marks ?? "",

      grade:
        data.grade || "",

      duration:
        data.duration ||
        course?.duration ||
        internship?.duration ||
        "",

      attendance:
        data.attendance ?? "",

      performance:
        data.performance || "",

      feedback:
        data.feedback || "",

      issueDate,

      certificateId,
    };


    // =================================================
    // CREATE DRAFT DATABASE RECORD
    // =================================================

    const certificate =
      await GeneratedCertificate.create({
        student: studentId,

        course:
          courseId || null,

        internship:
          internshipId || null,

        template:
          template._id,

        data: certificateData,

        certificateId,

        status: "pending",

        emailSent: false,

        emailSentAt: null,

        verifiedBy: null,

        verifiedAt: null,

        employeeRemark: "",
      });


    // =================================================
    // GENERATE DRAFT CERTIFICATE + QR
    // =================================================

    try {
      const generated =
        await generateCertificate({
          templatePath:
            buildTemplatePath(
              template.templateFile
            ),

          fields:
            template.fields || {},

          positions:
            template.positions || {},

          studentName:
            certificateData.studentName,

          courseName:
            certificateData.courseName,

          marks:
            certificateData.marks,

          grade:
            certificateData.grade,

          duration:
            certificateData.duration,

          attendance:
            certificateData.attendance,

          performance:
            certificateData.performance,

          feedback:
            certificateData.feedback,

          credentialId:
            certificateId,

          issueDate,
        });


      certificate.certificateFile =
        generated.certificateFile;


      certificate.qrCode =
        generated.qrCode || "";


      certificate.certificateId =
        generated.credentialId ||
        certificateId;


      certificate.data = {
        ...certificateData,

        certificateId:
          generated.credentialId ||
          certificateId,
      };


      await certificate.save();


    } catch (generationError) {
      console.error(
        "LEGACY CERTIFICATE DRAFT GENERATION ERROR:",
        generationError
      );


      // Remove unusable DB record
      await GeneratedCertificate.findByIdAndDelete(
        certificate._id
      );


      return res.status(500).json({
        success: false,

        message:
          "Certificate draft generation failed.",

        error:
          generationError.message,
      });
    }


    // =================================================
    // POPULATE RESPONSE
    // =================================================

    const populated =
      await GeneratedCertificate.findById(
        certificate._id
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type category fields positions templateFile"
        );


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Certificate draft generated successfully and sent for employee review.",

      certificate: populated,
    });


  } catch (error) {
    console.error(
      "GENERATE STUDENT CERTIFICATE ERROR:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to generate certificate draft.",
    });
  }
};