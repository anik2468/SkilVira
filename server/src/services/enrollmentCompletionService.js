import fs from "fs";
import path from "path";

import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import GeneratedCertificate from "../models/GeneratedCertificate.js";

import ReportTemplate from "../models/ReportTemplate.js";
import GeneratedReport from "../models/GeneratedReport.js";

import {
  createNotification,
} from "./notificationService.js";

import {
  generateCertificate,
} from "./certificateGenerator.js";

import {
  generateReport,
} from "./reportGenerator.js";


// =====================================================
// ID HELPER
// =====================================================

const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};


// =====================================================
// DATE HELPER
// =====================================================

const today = () => {
  return new Date()
    .toISOString()
    .split("T")[0];
};


// =====================================================
// TEMPLATE FILE PATH HELPER
// =====================================================

const resolveTemplatePath = (
  templateFile
) => {
  if (!templateFile) {
    return "";
  }

  const value = String(
    templateFile
  ).trim();

  if (!value) {
    return "";
  }

  // Remote URL is returned as-is.
  // Local generators normally use local upload paths.
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Normalize /uploads/... to <server-root>/uploads/...
  return path.resolve(
    process.cwd(),
    value.replace(/^\/+/, "")
  );
};


// =====================================================
// GET PROGRAM INFORMATION
// =====================================================

const getProgramInfo = (
  enrollment
) => {
  const course =
    enrollment.course &&
    typeof enrollment.course ===
      "object"
      ? enrollment.course
      : null;

  const internship =
    enrollment.internship &&
    typeof enrollment.internship ===
      "object"
      ? enrollment.internship
      : null;

  return {
    name:
      course?.title ||
      internship?.title ||
      "Program",

    duration:
      internship?.duration ||
      course?.duration ||
      "",

    company:
      internship?.company ||
      "",

    location:
      internship?.location ||
      "",

    workMode:
      internship?.workMode ||
      "",
  };
};


// =====================================================
// FIND CERTIFICATE TEMPLATE
// =====================================================

const findCertificateTemplate = async (
  enrollment
) => {

  // ---------------------------------------------------
  // Course-specific certificate
  // ---------------------------------------------------

  if (enrollment.course) {
    const courseTemplate =
      await CertificateTemplate.findOne({
        courseId:
          enrollment.course._id ||
          enrollment.course,

        category:
          "certificate",

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (courseTemplate) {
      return courseTemplate;
    }
  }


  // ---------------------------------------------------
  // Internship certificate
  //
  // Current CertificateTemplate schema does not contain
  // internshipId, so use the active internship
  // certificate template.
  // ---------------------------------------------------

  if (enrollment.internship) {
    const internshipTemplate =
      await CertificateTemplate.findOne({
        type:
          "internship",

        category:
          "certificate",

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (internshipTemplate) {
      return internshipTemplate;
    }
  }


  // ---------------------------------------------------
  // Generic course certificate
  // ---------------------------------------------------

  if (enrollment.course) {
    const genericTemplate =
      await CertificateTemplate.findOne({
        type:
          "course",

        category:
          "certificate",

        courseId:
          null,

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (genericTemplate) {
      return genericTemplate;
    }
  }


  return null;
};


// =====================================================
// FIND REPORT TEMPLATE
// =====================================================

const findReportTemplate = async (
  enrollment
) => {

  // ---------------------------------------------------
  // Internship-specific report
  // ---------------------------------------------------

  if (enrollment.internship) {
    const internshipTemplate =
      await ReportTemplate.findOne({
        internshipId:
          enrollment.internship._id ||
          enrollment.internship,

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (internshipTemplate) {
      return internshipTemplate;
    }
  }


  // ---------------------------------------------------
  // Course-specific report
  // ---------------------------------------------------

  if (enrollment.course) {
    const courseTemplate =
      await ReportTemplate.findOne({
        courseId:
          enrollment.course._id ||
          enrollment.course,

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (courseTemplate) {
      return courseTemplate;
    }
  }


  // ---------------------------------------------------
  // Generic internship report
  // ---------------------------------------------------

  if (enrollment.internship) {
    const genericInternship =
      await ReportTemplate.findOne({
        type:
          "internship",

        internshipId:
          null,

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (genericInternship) {
      return genericInternship;
    }
  }


  // ---------------------------------------------------
  // Generic course report
  // ---------------------------------------------------

  if (enrollment.course) {
    const genericCourse =
      await ReportTemplate.findOne({
        type:
          "course",

        courseId:
          null,

        isActive:
          true,
      }).sort({
        createdAt: -1,
      });

    if (genericCourse) {
      return genericCourse;
    }
  }


  return null;
};


// =====================================================
// FIND EXISTING CERTIFICATE
// =====================================================

const findExistingCertificate =
  async (
    enrollment
  ) => {

    const query = {
      student:
        enrollment.student._id ||
        enrollment.student,
    };


    if (enrollment.course) {
      query.course =
        enrollment.course._id ||
        enrollment.course;
    } else {
      query.course = null;
    }


    if (enrollment.internship) {
      query.internship =
        enrollment.internship._id ||
        enrollment.internship;
    } else {
      query.internship = null;
    }


    return GeneratedCertificate.findOne(
      query
    ).sort({
      createdAt: -1,
    });
  };


// =====================================================
// FIND EXISTING REPORT
// =====================================================

const findExistingReport =
  async (
    enrollment
  ) => {

    const query = {
      student:
        enrollment.student._id ||
        enrollment.student,
    };


    if (enrollment.course) {
      query.course =
        enrollment.course._id ||
        enrollment.course;
    } else {
      query.course = null;
    }


    if (enrollment.internship) {
      query.internship =
        enrollment.internship._id ||
        enrollment.internship;
    } else {
      query.internship = null;
    }


    return GeneratedReport.findOne(
      query
    ).sort({
      createdAt: -1,
    });
  };


// =====================================================
// CREATE GENERATED CERTIFICATE
// Creates DRAFT certificate + QR
// Status remains pending for employee verification
// =====================================================

const createGeneratedCertificate =
  async (
    enrollment,
    student
  ) => {

    // -------------------------------------------------
    // Existing certificate check
    // -------------------------------------------------

    const existing =
      await findExistingCertificate(
        enrollment
      );

    if (existing) {
      return {
        document:
          existing,

        created:
          false,

        templateMissing:
          false,

        generationError:
          false,
      };
    }


    // -------------------------------------------------
    // Find active template
    // -------------------------------------------------

    const template =
      await findCertificateTemplate(
        enrollment
      );

    if (!template) {
      return {
        document:
          null,

        created:
          false,

        templateMissing:
          true,

        generationError:
          false,
      };
    }


    // -------------------------------------------------
    // Validate template file
    // -------------------------------------------------

    const templatePath =
      resolveTemplatePath(
        template.templateFile
      );

    if (!templatePath) {
      throw new Error(
        "Certificate template file is missing."
      );
    }

    if (
      !templatePath.startsWith(
        "http://"
      ) &&
      !templatePath.startsWith(
        "https://"
      ) &&
      !fs.existsSync(templatePath)
    ) {
      throw new Error(
        "Certificate template file could not be found on server."
      );
    }


    // -------------------------------------------------
    // Program information
    // -------------------------------------------------

    const program =
      getProgramInfo(
        enrollment
      );


    // -------------------------------------------------
    // Temporary credential ID
    // Final generator value is saved back to DB.
    // -------------------------------------------------

    const certificateId =
      generateId(
        "CERT"
      );


    // -------------------------------------------------
    // Generate DRAFT certificate PDF + QR
    //
    // QR position and size come from the selected
    // certificate template.
    // -------------------------------------------------

    const generated =
      await generateCertificate({
        templatePath,

        positions:
          template.positions ||
          {},

        studentName:
          student?.name ||
          "",

        courseName:
          program.name,

        credentialId:
          certificateId,

        issueDate:
          today(),
      });


    if (
      !generated?.certificateFile
    ) {
      throw new Error(
        "Certificate draft file could not be generated."
      );
    }


    const finalCredentialId =
      generated.credentialId ||
      certificateId;


    // -------------------------------------------------
    // Save generated certificate
    // -------------------------------------------------

    const certificate =
      await GeneratedCertificate.create({

        student:
          student._id ||
          student,

        course:
          enrollment.course?._id ||
          enrollment.course ||
          null,

        internship:
          enrollment.internship?._id ||
          enrollment.internship ||
          null,

        template:
          template._id,

        certificateId:
          finalCredentialId,

        certificateFile:
          generated.certificateFile,

        qrCode:
          generated.qrCode ||
          "",

        data: {

          studentName:
            student?.name ||
            "",

          courseName:
            program.name,

          marks:
            "",

          grade:
            "",

          duration:
            program.duration,

          attendance:
            "",

          performance:
            "",

          feedback:
            "",

          issueDate:
            today(),

          certificateId:
            finalCredentialId,
        },

        status:
          "pending",

        emailSent:
          false,
      });


    return {
      document:
        certificate,

      created:
        true,

      templateMissing:
        false,

      generationError:
        false,
    };
  };


// =====================================================
// CREATE GENERATED REPORT
// Creates DRAFT report document
// Status remains pending for employee verification
//
// NOTE:
// Report does NOT create public verification QR.
// Only certificate has public QR verification.
// =====================================================

const createGeneratedReport =
  async (
    enrollment,
    student
  ) => {

    // -------------------------------------------------
    // Existing report check
    // -------------------------------------------------

    const existing =
      await findExistingReport(
        enrollment
      );

    if (existing) {
      return {
        document:
          existing,

        created:
          false,

        templateMissing:
          false,

        generationError:
          false,
      };
    }


    // -------------------------------------------------
    // Find active report template
    // -------------------------------------------------

    const template =
      await findReportTemplate(
        enrollment
      );

    if (!template) {
      return {
        document:
          null,

        created:
          false,

        templateMissing:
          true,

        generationError:
          false,
      };
    }


    // -------------------------------------------------
    // Validate template file
    // -------------------------------------------------

    const templatePath =
      resolveTemplatePath(
        template.templateFile
      );

    if (!templatePath) {
      throw new Error(
        "Report template file is missing."
      );
    }

    if (
      !templatePath.startsWith(
        "http://"
      ) &&
      !templatePath.startsWith(
        "https://"
      ) &&
      !fs.existsSync(templatePath)
    ) {
      throw new Error(
        "Report template file could not be found on server."
      );
    }


    // -------------------------------------------------
    // Program information
    // -------------------------------------------------

    const program =
      getProgramInfo(
        enrollment
      );


    const reportId =
      generateId(
        "RPT"
      );


    // -------------------------------------------------
    // Generate DRAFT report
    // -------------------------------------------------

    const generated =
      await generateReport({
        templatePath,

        fields:
          template.fields ||
          {},

        positions:
          template.positions ||
          {},

        studentName:
          student?.name ||
          "",

        courseName:
          program.name,

        marks:
          "",

        grade:
          "",

        attendance:
          "",

        duration:
          program.duration,

        performance:
          "",

        feedback:
          "",

        issueDate:
          today(),

        reportId,

        instructorName:
          "",
      });


    if (
      !generated?.reportFile
    ) {
      throw new Error(
        "Report draft file could not be generated."
      );
    }


    const finalReportId =
      generated.reportId ||
      reportId;


    // -------------------------------------------------
    // Save generated report
    // -------------------------------------------------

    const report =
      await GeneratedReport.create({

        student:
          student._id ||
          student,

        course:
          enrollment.course?._id ||
          enrollment.course ||
          null,

        internship:
          enrollment.internship?._id ||
          enrollment.internship ||
          null,

        template:
          template._id,

        reportFile:
          generated.reportFile,

        data: {

          studentName:
            student?.name ||
            "",

          courseName:
            program.name,

          marks:
            "",

          grade:
            "",

          attendance:
            "",

          duration:
            program.duration,

          performance:
            "",

          feedback:
            "",

          issueDate:
            today(),

          reportId:
            finalReportId,

          instructorName:
            "",
        },

        status:
          "pending",

        emailSent:
          false,
      });


    return {
      document:
        report,

      created:
        true,

      templateMissing:
        false,

      generationError:
        false,
    };
  };


// =====================================================
// STAFF NOTIFICATION
// =====================================================

const notifyStaff =
  async ({
    type,
    referenceId,
    referenceModel,
    title,
    message,
    link,
  }) => {

    const staff =
      await User.find({
        role: {
          $in: [
            "employee",
            "control",
          ],
        },

        isDeleted: {
          $ne: true,
        },

      }).select(
        "_id"
      );


    for (
      const employee of staff
    ) {

      try {

        await createNotification({

          recipient:
            employee._id,

          type,

          title,

          message,

          referenceId,

          referenceModel,

          link:
            link ||
            "",
        });

      } catch (error) {

        console.error(
          "STAFF NOTIFICATION ERROR:",
          error
        );
      }
    }
  };


// =====================================================
// MAIN COMPLETION TRIGGER
// =====================================================

export const triggerEnrollmentCompletion =
  async (
    enrollmentId
  ) => {

    // -------------------------------------------------
    // Load enrollment
    // -------------------------------------------------

    const enrollment =
      await Enrollment.findOne({

        _id:
          enrollmentId,

        isDeleted:
          false,

      })

        .populate(
          "student",
          "name email"
        )

        .populate(
          "course",
          "title duration"
        )

        .populate(
          "internship",
          "title company duration location workMode"
        );


    if (!enrollment) {
      throw new Error(
        "Enrollment not found."
      );
    }


    // -------------------------------------------------
    // Cancelled enrollment
    // -------------------------------------------------

    if (
      enrollment.status ===
      "Cancelled"
    ) {
      throw new Error(
        "Cancelled enrollment cannot be completed."
      );
    }


    // -------------------------------------------------
    // Mark completed
    // -------------------------------------------------

    enrollment.progress =
      100;

    enrollment.status =
      "Completed";

    enrollment.completionDate =
      enrollment.completionDate ||
      new Date();


    // -------------------------------------------------
    // Duplicate protection
    //
    // Already fully processed means don't create
    // duplicate certificate/report.
    // -------------------------------------------------

    if (
      enrollment.completionTriggered
    ) {

      await enrollment.save();

      return {

        success:
          true,

        alreadyTriggered:
          true,

        enrollmentId:
          enrollment._id,

        certificateId:
          enrollment.certificate ||
          null,

        reportId:
          enrollment.report ||
          null,
      };
    }


    // -------------------------------------------------
    // Student
    // -------------------------------------------------

    const student =
      enrollment.student;


    if (!student) {
      throw new Error(
        "Student information not found."
      );
    }


    // =================================================
    // CERTIFICATE
    // =================================================

    let certificateResult =
      null;


    try {

      certificateResult =
        await createGeneratedCertificate(
          enrollment,
          student
        );

    } catch (error) {

      console.error(
        "CERTIFICATE CREATION ERROR:",
        error
      );

      certificateResult = {

        document:
          null,

        created:
          false,

        templateMissing:
          false,

        generationError:
          true,

        error:
          error.message,
      };
    }


    // -------------------------------------------------
    // Save certificate reference
    // -------------------------------------------------

    if (
      certificateResult?.document
    ) {

      enrollment.certificate =
        certificateResult
          .document
          ._id;

      enrollment.certificateGenerated =
        true;


      // ------------------------------------------------
      // Notify employee/control
      // ------------------------------------------------

      if (
        certificateResult.created
      ) {

        const program =
          getProgramInfo(
            enrollment
          );


        try {

          await notifyStaff({

            type:
              "certificate",

            referenceId:
              certificateResult
                .document
                ._id,

            referenceModel:
              "GeneratedCertificate",

            title:
              "Certificate Verification Required",

            message:
              `${student.name || "Student"} has completed ${program.name}. The certificate draft is ready for employee verification.`,

            link:
              "/employee/certificates/verification",
          });

        } catch (notificationError) {

          console.error(
            "CERTIFICATE NOTIFICATION ERROR:",
            notificationError
          );
        }
      }
    }


    // =================================================
    // REPORT
    // =================================================

    let reportResult =
      null;


    try {

      reportResult =
        await createGeneratedReport(
          enrollment,
          student
        );

    } catch (error) {

      console.error(
        "REPORT CREATION ERROR:",
        error
      );

      reportResult = {

        document:
          null,

        created:
          false,

        templateMissing:
          false,

        generationError:
          true,

        error:
          error.message,
      };
    }


    // -------------------------------------------------
    // Save report reference
    // -------------------------------------------------

    if (
      reportResult?.document
    ) {

      enrollment.report =
        reportResult
          .document
          ._id;

      enrollment.reportGenerated =
        true;


      // ------------------------------------------------
      // Notify employee/control
      // ------------------------------------------------

      if (
        reportResult.created
      ) {

        const program =
          getProgramInfo(
            enrollment
          );


        try {

          await notifyStaff({

            type:
              "report",

            referenceId:
              reportResult
                .document
                ._id,

            referenceModel:
              "GeneratedReport",

            title:
              "Report Verification Required",

            message:
              `${student.name || "Student"} has completed ${program.name}. The performance report is ready for employee verification.`,

            link:
              "/employee/reports/verification",
          });

        } catch (notificationError) {

          console.error(
            "REPORT NOTIFICATION ERROR:",
            notificationError
          );
        }
      }
    }


    // =================================================
    // FINAL COMPLETION MARKER
    //
    // IMPORTANT:
    // Do NOT lock the enrollment as triggered when
    // template generation failed or a template is missing.
    //
    // This allows retry after employee uploads/activates
    // the missing template.
    // =================================================

    const certificateReady =
      Boolean(
        certificateResult?.document
      );

    const reportReady =
      Boolean(
        reportResult?.document
      );


    enrollment.completionTriggered =
      certificateReady &&
      reportReady;


    await enrollment.save();


    // =================================================
    // RESULT
    // =================================================

    return {

      success:
        true,

      alreadyTriggered:
        false,

      enrollmentId:
        enrollment._id,

      studentId:
        student._id,

      certificateId:
        certificateResult
          ?.document?._id ||
        null,

      reportId:
        reportResult
          ?.document?._id ||
        null,

      certificateCreated:
        certificateResult
          ?.created ||
        false,

      reportCreated:
        reportResult
          ?.created ||
        false,

      certificateTemplateMissing:
        certificateResult
          ?.templateMissing ||
        false,

      reportTemplateMissing:
        reportResult
          ?.templateMissing ||
        false,

      certificateGenerationError:
        certificateResult
          ?.generationError ||
        false,

      reportGenerationError:
        reportResult
          ?.generationError ||
        false,

      completionTriggered:
        enrollment.completionTriggered,
    };
  };


// =====================================================
// MANUAL COMPLETION
// Useful for employee/control
// =====================================================

export const markEnrollmentCompleted =
  async (
    req,
    res
  ) => {

    try {

      const enrollment =
        await Enrollment.findOne({

          _id:
            req.params.id,

          isDeleted:
            false,
        });


      if (!enrollment) {

        return res
          .status(404)
          .json({

            success:
              false,

            message:
              "Enrollment not found.",
          });
      }


      const result =
        await triggerEnrollmentCompletion(
          enrollment._id
        );


      const hasBothDocuments =
        Boolean(
          result?.certificateId
        ) &&
        Boolean(
          result?.reportId
        );


      return res
        .status(200)
        .json({

          success:
            true,

          message:
            hasBothDocuments
              ? "Enrollment completed successfully. Certificate and report are now in the verification queue."
              : "Enrollment completed, but one or more document templates are missing or could not be generated. The completion process can be retried.",

          result,
        });

    } catch (error) {

      console.error(
        "MARK ENROLLMENT COMPLETED ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error.message ||
            "Failed to complete enrollment.",
        });
    }
  };