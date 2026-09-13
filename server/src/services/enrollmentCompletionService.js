import Enrollment from "../models/Enrollment.js";

import User from "../models/User.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import GeneratedCertificate from "../models/GeneratedCertificate.js";

import ReportTemplate from "../models/ReportTemplate.js";
import GeneratedReport from "../models/GeneratedReport.js";

import {
  createNotification,
} from "./notificationService.js";


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
// GET PROGRAM INFORMATION
// =====================================================

const getProgramInfo = (enrollment) => {
  const course =
    enrollment.course &&
    typeof enrollment.course === "object"
      ? enrollment.course
      : null;

  const internship =
    enrollment.internship &&
    typeof enrollment.internship === "object"
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
  // Internship-specific template
  // CertificateTemplate supports internship type,
  // but current schema does not depend on internshipId.
  // So use active internship certificate template.
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
  // Internship-specific
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
  // Course-specific
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
  async (enrollment) => {

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
  async (enrollment) => {

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
// CREATE CERTIFICATE
// =====================================================

const createGeneratedCertificate =
  async (
    enrollment,
    student
  ) => {

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
      };
    }


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
      };
    }


    const program =
      getProgramInfo(
        enrollment
      );


    const certificateId =
      generateId(
        "CERT"
      );


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

        certificateId,

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

          certificateId,

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
    };
  };


// =====================================================
// CREATE REPORT
// =====================================================

const createGeneratedReport =
  async (
    enrollment,
    student
  ) => {

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
      };
    }


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
      };
    }


    const program =
      getProgramInfo(
        enrollment
      );


    const reportId =
      generateId(
        "REPORT"
      );


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

          reportId,

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


    for (const employee of staff) {

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
            link || "",
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
      };
    }


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

    let certificateResult = null;

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

        error:
          error.message,
      };
    }


    if (
      certificateResult?.document
    ) {

      enrollment.certificate =
        certificateResult
          .document
          ._id;

      enrollment.certificateGenerated =
        true;


      if (
        certificateResult.created
      ) {

        const program =
          getProgramInfo(
            enrollment
          );


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
            `${student.name || "Student"} has completed ${program.name}. The certificate is ready for verification.`,

          link:
            `/employee/certificates/${certificateResult.document._id}`,
        });
      }
    }


    // =================================================
    // REPORT
    // =================================================

    let reportResult = null;

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

        error:
          error.message,
      };
    }


    if (
      reportResult?.document
    ) {

      enrollment.report =
        reportResult
          .document
          ._id;

      enrollment.reportGenerated =
        true;


      if (
        reportResult.created
      ) {

        const program =
          getProgramInfo(
            enrollment
          );


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
            `${student.name || "Student"} has completed ${program.name}. The performance report is ready for verification.`,

          link:
            `/employee/reports/${reportResult.document._id}`,
        });
      }
    }


    // =================================================
    // FINAL COMPLETION MARKER
    // =================================================

    enrollment.completionTriggered =
      true;


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
    };
  };


// =====================================================
// MANUAL COMPLETION
// =====================================================

export const markEnrollmentCompleted =
  async (req, res) => {

    try {

      const enrollment =
        await Enrollment.findOne({
          _id:
            req.params.id,

          isDeleted:
            false,
        });


      if (!enrollment) {

        return res.status(404).json({
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


      return res.status(200).json({

        success:
          true,

        message:
          "Enrollment completed successfully. Certificate and report are now in the verification queue.",

        result,

      });

    } catch (error) {

      console.error(
        "MARK ENROLLMENT COMPLETED ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message,

      });
    }
  };