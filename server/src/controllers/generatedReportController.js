import GeneratedReport from "../models/GeneratedReport.js";

import ReportTemplate from "../models/ReportTemplate.js";

import {
  generateReport,
} from "../services/reportGenerator.js";

import fs from "fs";
import path from "path";


// =====================================================
// HELPERS
// =====================================================

// -----------------------------------------------------
// USER ID
// -----------------------------------------------------

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    null
  );
};


// -----------------------------------------------------
// TO OBJECT
// -----------------------------------------------------

const toObject = (value) => {
  if (!value) {
    return {};
  }

  if (
    typeof value.toObject ===
    "function"
  ) {
    return value.toObject();
  }

  return value;
};


// -----------------------------------------------------
// RESOLVE STORED FILE PATH
// -----------------------------------------------------

const resolveStoredFilePath = (
  storedPath
) => {
  if (!storedPath) {
    return null;
  }

  const value =
    String(
      storedPath
    ).trim();

  if (!value) {
    return null;
  }

  // Absolute filesystem path
  if (
    path.isAbsolute(
      value
    )
  ) {
    return value;
  }

  // Convert /uploads/... to
  // <server-root>/uploads/...
  const normalized =
    value.replace(
      /^[/\\]+/,
      ""
    );

  return path.join(
    process.cwd(),
    normalized
  );
};


// -----------------------------------------------------
// REPORT TEMPLATE FILE
// -----------------------------------------------------

const getReportTemplateFile = (
  template
) => {
  if (
    !template?.templateFile
  ) {
    return null;
  }

  return resolveStoredFilePath(
    template.templateFile
  );
};


// -----------------------------------------------------
// REPORT DATA
// -----------------------------------------------------

const getReportData = (
  report
) => {

  const data =
    report?.data?.toObject?.() ||
    report?.data ||
    {};


  return {

    studentName:
      data.studentName ||
      report?.student?.name ||
      "",

    courseName:
      data.courseName ||
      report?.course?.title ||
      report?.internship?.title ||
      "SkilVira Program",

    marks:
      data.marks ??
      "",

    grade:
      data.grade ||
      "",

    attendance:
      data.attendance ??
      "",

    duration:
      data.duration ||
      "",

    performance:
      data.performance ||
      "",

    feedback:
      data.feedback ||
      "",

    issueDate:
      data.issueDate ||
      new Date()
        .toISOString()
        .split("T")[0],

    reportId:
      data.reportId ||
      "",

    instructorName:
      data.instructorName ||
      "",
  };
};


// -----------------------------------------------------
// POPULATE REPORT
// -----------------------------------------------------

const populateReport = async (
  id
) => {

  return GeneratedReport
    .findById(id)

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
      "name type fields templateFile positions requiresApproval"
    );
};


// =====================================================
// CREATE / GENERATE REPORT
// DRAFT REPORT ONLY
// =====================================================

export const createGeneratedReport =
  async (
    req,
    res
  ) => {

    let createdReportId =
      null;


    try {

      const {
        student,
        course,
        internship,
        template,
        data = {},
      } = req.body;


      // =================================================
      // VALIDATION
      // =================================================

      if (!student) {

        return res.status(400).json({
          success: false,
          message:
            "Student is required.",
        });
      }


      if (!template) {

        return res.status(400).json({
          success: false,
          message:
            "Report template is required.",
        });
      }


      if (
        !course &&
        !internship
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Course or internship is required.",
        });
      }


      // =================================================
      // GET TEMPLATE
      // =================================================

      const reportTemplate =
        await ReportTemplate.findById(
          template
        );


      if (!reportTemplate) {

        return res.status(404).json({
          success: false,
          message:
            "Report template not found.",
        });
      }


      if (
        !reportTemplate.isActive
      ) {

        return res.status(400).json({
          success: false,
          message:
            "This report template is inactive.",
        });
      }


      // =================================================
      // TEMPLATE TYPE VALIDATION
      // =================================================

      if (
        reportTemplate.type ===
          "course" &&
        !course
      ) {

        return res.status(400).json({
          success: false,
          message:
            "This template requires a course.",
        });
      }


      if (
        reportTemplate.type ===
          "internship" &&
        !internship
      ) {

        return res.status(400).json({
          success: false,
          message:
            "This template requires an internship.",
        });
      }


      // =================================================
      // TEMPLATE FILE
      // =================================================

      const templatePath =
        getReportTemplateFile(
          reportTemplate
        );


      if (
        !templatePath ||
        !fs.existsSync(
          templatePath
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Report template file is missing or invalid.",
        });
      }


      // =================================================
      // REPORT ID
      // =================================================

      const reportId =
        data.reportId ||
        `RPT-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`;


      // =================================================
      // ISSUE DATE
      // =================================================

      const issueDate =
        data.issueDate ||
        new Date()
          .toISOString()
          .split("T")[0];


      // =================================================
      // CREATE DATABASE RECORD
      // =================================================

      const report =
        await GeneratedReport.create({

          student,

          course:
            course ||
            null,

          internship:
            internship ||
            null,

          template,

          data: {

            studentName:
              data.studentName ||
              "",

            courseName:
              data.courseName ||
              "",

            marks:
              data.marks ??
              "",

            grade:
              data.grade ||
              "",

            attendance:
              data.attendance ??
              "",

            duration:
              data.duration ||
              "",

            performance:
              data.performance ||
              "",

            feedback:
              data.feedback ||
              "",

            issueDate,

            reportId,

            instructorName:
              data.instructorName ||
              "",
          },

          status:
            "pending",

          emailSent:
            false,

          emailSentAt:
            null,
        });


      createdReportId =
        report._id;


      // =================================================
      // GENERATE DRAFT REPORT
      //
      // IMPORTANT:
      // No QR.
      // No public verification URL.
      // =================================================

      const generated =
        await generateReport({

          templatePath,

          fields:
            reportTemplate.fields ||
            {},

          positions:
            reportTemplate.positions ||
            {},

          studentName:
            data.studentName ||
            "",

          courseName:
            data.courseName ||
            "",

          marks:
            data.marks ??
            "",

          grade:
            data.grade ||
            "",

          attendance:
            data.attendance ??
            "",

          duration:
            data.duration ||
            "",

          performance:
            data.performance ||
            "",

          feedback:
            data.feedback ||
            "",

          issueDate,

          reportId,

          instructorName:
            data.instructorName ||
            "",
        });


      // =================================================
      // SAVE DRAFT FILE
      // =================================================

      report.reportFile =
        generated.reportFile;


      report.data = {

        ...toObject(
          report.data
        ),

        studentName:
          data.studentName ||
          "",

        courseName:
          data.courseName ||
          "",

        issueDate,

        reportId:
          generated.reportId ||
          reportId,

        instructorName:
          data.instructorName ||
          "",
      };


      report.status =
        "pending";


      await report.save();


      // =================================================
      // POPULATED RESPONSE
      // =================================================

      const populatedReport =
        await populateReport(
          report._id
        );


      return res.status(201).json({

        success:
          true,

        message:
          "Report generated successfully and sent for employee verification.",

        report:
          populatedReport,
      });


    } catch (error) {

      console.error(
        "CREATE GENERATED REPORT ERROR:",
        error
      );


      // Cleanup partially created DB record
      if (
        createdReportId
      ) {

        try {

          await GeneratedReport.findByIdAndDelete(
            createdReportId
          );

        } catch (
          cleanupError
        ) {

          console.error(
            "REPORT CLEANUP ERROR:",
            cleanupError
          );
        }
      }


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to generate report.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// EMPLOYEE REVIEW QUEUE
//
// pending + revision
// =====================================================

export const getPendingReports =
  async (
    req,
    res
  ) => {

    try {

      const reports =
        await GeneratedReport.find({

          status: {
            $in: [
              "pending",
              "revision",
            ],
          },

        })

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
            "name type fields templateFile positions requiresApproval"
          )

          .sort({
            createdAt:
              -1,
          });


      return res.status(200).json({

        success:
          true,

        count:
          reports.length,

        reports,
      });


    } catch (error) {

      console.error(
        "GET PENDING REPORTS ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch pending reports.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// GET SINGLE REPORT
// =====================================================

export const getGeneratedReportById =
  async (
    req,
    res
  ) => {

    try {

      const report =
        await populateReport(
          req.params.id
        );


      if (!report) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report not found.",
        });
      }


      return res.status(200).json({

        success:
          true,

        report,
      });


    } catch (error) {

      console.error(
        "GET REPORT ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch report.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// EMPLOYEE EDIT REPORT
// REGENERATE DRAFT
// =====================================================

export const updateGeneratedReport =
  async (
    req,
    res
  ) => {

    try {

      const report =
        await GeneratedReport.findById(
          req.params.id
        );


      if (!report) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report not found.",
        });
      }


      // =================================================
      // INCOMING DATA
      // =================================================

      const incomingData =
        req.body.data ||
        {};


      const existingData =
        report.data
          ? report.data.toObject?.() ||
            report.data
          : {};


      const mergedData = {

        ...existingData,

        ...incomingData,
      };


      // =================================================
      // GET TEMPLATE
      // =================================================

      const template =
        await ReportTemplate.findById(
          report.template
        );


      if (!template) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report template not found.",
        });
      }


      if (
        !template.isActive
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Report template is inactive.",
        });
      }


      // =================================================
      // TEMPLATE FILE
      // =================================================

      const templatePath =
        getReportTemplateFile(
          template
        );


      if (
        !templatePath ||
        !fs.existsSync(
          templatePath
        )
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Report template file is missing or invalid.",
        });
      }


      // =================================================
      // NORMALIZE DATA
      // =================================================

      const finalReportId =
        mergedData.reportId ||
        `RPT-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`;


      const finalIssueDate =
        mergedData.issueDate ||
        new Date()
          .toISOString()
          .split("T")[0];


      // =================================================
      // GENERATE UPDATED DRAFT
      //
      // No QR / no public verification.
      // =================================================

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
            mergedData.studentName ||
            "",

          courseName:
            mergedData.courseName ||
            "",

          marks:
            mergedData.marks ??
            "",

          grade:
            mergedData.grade ||
            "",

          attendance:
            mergedData.attendance ??
            "",

          duration:
            mergedData.duration ||
            "",

          performance:
            mergedData.performance ||
            "",

          feedback:
            mergedData.feedback ||
            "",

          issueDate:
            finalIssueDate,

          reportId:
            finalReportId,

          instructorName:
            mergedData.instructorName ||
            "",
        });


      // =================================================
      // SAVE UPDATED REPORT
      // =================================================

      report.data = {

        ...mergedData,

        studentName:
          mergedData.studentName ||
          "",

        courseName:
          mergedData.courseName ||
          "",

        issueDate:
          finalIssueDate,

        reportId:
          generated.reportId ||
          finalReportId,

        instructorName:
          mergedData.instructorName ||
          "",
      };


      report.reportFile =
        generated.reportFile;


      // Edited report must be verified again.
      report.status =
        "revision";


      report.verifiedBy =
        null;


      report.verifiedAt =
        null;


      report.employeeRemark =
        "";


      report.emailSent =
        false;


      report.emailSentAt =
        null;


      await report.save();


      // =================================================
      // POPULATE RESPONSE
      // =================================================

      const updatedReport =
        await populateReport(
          report._id
        );


      return res.status(200).json({

        success:
          true,

        message:
          "Report details and draft document updated successfully.",

        report:
          updatedReport,
      });


    } catch (error) {

      console.error(
        "UPDATE REPORT ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to update report.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// REQUEST REVISION
// =====================================================

export const requestReportRevision =
  async (
    req,
    res
  ) => {

    try {

      const report =
        await GeneratedReport.findById(
          req.params.id
        );


      if (!report) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report not found.",
        });
      }


      const remark =
        String(
          req.body.remark ||
          ""
        ).trim();


      if (!remark) {

        return res.status(400).json({

          success:
            false,

          message:
            "Revision instructions are required.",
        });
      }


      report.status =
        "revision";


      report.employeeRemark =
        remark;


      report.verifiedBy =
        getUserId(req);


      report.verifiedAt =
        new Date();


      await report.save();


      const updatedReport =
        await populateReport(
          report._id
        );


      return res.status(200).json({

        success:
          true,

        message:
          "Report revision requested successfully.",

        report:
          updatedReport,
      });


    } catch (error) {

      console.error(
        "REQUEST REPORT REVISION ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to request report revision.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// APPROVE REPORT
//
// FINAL PDF ONLY
//
// IMPORTANT:
// - No public QR
// - No report verification URL
// - No automatic email
// =====================================================

export const approveGeneratedReport =
  async (
    req,
    res
  ) => {

    try {

      const report =
        await GeneratedReport.findById(
          req.params.id
        )

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
          )

          .populate(
            "template"
          );


      if (!report) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report not found.",
        });
      }


      if (
        report.status ===
        "approved"
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Report is already approved.",
        });
      }


      // =================================================
      // TEMPLATE
      // =================================================

      if (
        !report.template ||
        !report.template.templateFile
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Report template file is missing.",
        });
      }


      const templatePath =
        getReportTemplateFile(
          report.template
        );


      if (
        !templatePath ||
        !fs.existsSync(
          templatePath
        )
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Report template file could not be found on server.",
        });
      }


      // =================================================
      // DATA
      // =================================================

      const data =
        toObject(
          report.data
        );


      const studentName =
        data.studentName ||
        report.student?.name ||
        "Student";


      const courseName =
        data.courseName ||
        report.course?.title ||
        report.internship?.title ||
        "SkilVira Program";


      const reportId =
        data.reportId ||
        `RPT-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`;


      const issueDate =
        data.issueDate ||
        new Date()
          .toISOString()
          .split("T")[0];


      // =================================================
      // FINAL REPORT GENERATION
      //
      // Still no QR.
      // =================================================

      const generated =
        await generateReport({

          templatePath,

          fields:
            report.template.fields ||
            {},

          positions:
            report.template.positions ||
            {},

          studentName,

          courseName,

          marks:
            data.marks ??
            "",

          grade:
            data.grade ||
            "",

          attendance:
            data.attendance ??
            "",

          duration:
            data.duration ||
            "",

          performance:
            data.performance ||
            "",

          feedback:
            data.feedback ||
            "",

          issueDate,

          reportId,

          instructorName:
            data.instructorName ||
            "",
        });


      // =================================================
      // SAVE FINAL REPORT
      // =================================================

      report.reportFile =
        generated.reportFile;


      report.data = {

        ...data,

        studentName,

        courseName,

        issueDate,

        reportId:
          generated.reportId ||
          reportId,

        instructorName:
          data.instructorName ||
          "",
      };


      report.status =
        "approved";


      report.verifiedBy =
        getUserId(req);


      report.verifiedAt =
        new Date();


      report.employeeRemark =
        req.body.remark ||
        "Report approved.";


      report.emailSent =
        false;


      report.emailSentAt =
        null;


      await report.save();


      // =================================================
      // POPULATED RESPONSE
      // =================================================

      const approvedReport =
        await populateReport(
          report._id
        );


      return res.status(200).json({

        success:
          true,

        message:
          "Report approved and final document generated successfully.",

        report:
          approvedReport,
      });


    } catch (error) {

      console.error(
        "APPROVE REPORT ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to approve report.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// REJECT REPORT
// =====================================================

export const rejectGeneratedReport =
  async (
    req,
    res
  ) => {

    try {

      const report =
        await GeneratedReport.findById(
          req.params.id
        );


      if (!report) {

        return res.status(404).json({

          success:
            false,

          message:
            "Report not found.",
        });
      }


      const reason =
        String(
          req.body.reason ||
          req.body.remark ||
          ""
        ).trim();


      if (!reason) {

        return res.status(400).json({

          success:
            false,

          message:
            "Rejection reason is required.",
        });
      }


      report.status =
        "rejected";


      report.verifiedBy =
        getUserId(req);


      report.verifiedAt =
        new Date();


      report.employeeRemark =
        reason;


      await report.save();


      const rejectedReport =
        await populateReport(
          report._id
        );


      return res.status(200).json({

        success:
          true,

        message:
          "Report rejected successfully.",

        report:
          rejectedReport,
      });


    } catch (error) {

      console.error(
        "REJECT REPORT ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to reject report.",

        error:
          error.message,
      });
    }
  };


// =====================================================
// GET APPROVED REPORTS
// =====================================================

export const getApprovedReports =
  async (
    req,
    res
  ) => {

    try {

      const reports =
        await GeneratedReport.find({

          status:
            "approved",

        })

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
            "name type fields templateFile positions requiresApproval"
          )

          .sort({
            verifiedAt:
              -1,
          });


      return res.status(200).json({

        success:
          true,

        count:
          reports.length,

        reports,
      });


    } catch (error) {

      console.error(
        "GET APPROVED REPORTS ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch approved reports.",

        error:
          error.message,
      });
    }
  };