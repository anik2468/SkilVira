import GeneratedReport from "../models/GeneratedReport.js";
import ReportTemplate from "../models/ReportTemplate.js";

import {
  generateReport,
} from "../services/reportGenerator.js";

import {
  sendCertificateEmail,
} from "../services/emailService.js";

import path from "path";



// =====================================================
// CREATE / GENERATE REPORT
// =====================================================

export const createGeneratedReport = async (req, res) => {
  try {
    const {
      student,
      course,
      internship,
      template,
      data = {},
    } = req.body;

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student is required.",
      });
    }

    if (!template) {
      return res.status(400).json({
        success: false,
        message: "Report template is required.",
      });
    }

    const reportTemplate =
      await ReportTemplate.findById(template);

    if (!reportTemplate) {
      return res.status(404).json({
        success: false,
        message: "Report template not found.",
      });
    }

    if (!reportTemplate.isActive) {
      return res.status(400).json({
        success: false,
        message: "This report template is inactive.",
      });
    }

    const reportId =
      data.reportId ||
      `RPT-${Date.now()}`;

    const report =
      await GeneratedReport.create({
        student,
        course: course || null,
        internship: internship || null,
        template,

        data: {
          studentName:
            data.studentName || "",

          courseName:
            data.courseName || "",

          marks:
            data.marks || "",

          grade:
            data.grade || "",

          attendance:
            data.attendance || "",

          duration:
            data.duration || "",

          performance:
            data.performance || "",

          feedback:
            data.feedback || "",

          issueDate:
            data.issueDate ||
            new Date().toISOString().split("T")[0],

          reportId,

          instructorName:
            data.instructorName || "",
        },

        status: "pending",
      });

    const populatedReport =
      await GeneratedReport.findById(report._id)
        .populate("student", "name email avatar")
        .populate("course", "title category")
        .populate("internship", "title company")
        .populate(
          "template",
          "name type fields templateFile positions"
        );

    return res.status(201).json({
      success: true,
      message:
        "Report generated successfully and sent for employee verification.",
      report: populatedReport,
    });

  } catch (error) {

    console.error(
      "CREATE GENERATED REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate report.",
      error: error.message,
    });
  }
};



// =====================================================
// EMPLOYEE REVIEW QUEUE
// =====================================================

export const getPendingReports = async (req, res) => {
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
        .populate("student", "name email avatar")
        .populate("course", "title category")
        .populate("internship", "title company")
        .populate(
          "template",
          "name type fields templateFile positions"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    console.error(
      "GET PENDING REPORTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending reports.",
      error: error.message,
    });
  }
};



// =====================================================
// GET SINGLE REPORT
// =====================================================

export const getGeneratedReportById = async (
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
          "name email avatar"
        )
        .populate(
          "course",
          "title category duration"
        )
        .populate(
          "internship",
          "title company duration"
        )
        .populate(
          "template",
          "name type fields templateFile positions"
        );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    console.error(
      "GET REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
      error: error.message,
    });
  }
};



// =====================================================
// EMPLOYEE EDIT REPORT
// =====================================================

export const updateGeneratedReport = async (
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
        success: false,
        message: "Report not found.",
      });
    }

    const incomingData =
      req.body.data || {};

    const existingData =
      report.data
        ? report.data.toObject?.() ||
          report.data
        : {};

    report.data = {
      ...existingData,
      ...incomingData,
    };

    report.status = "revision";

    report.verifiedBy = null;
    report.verifiedAt = null;

    report.employeeRemark = "";

    await report.save();

    const updatedReport =
      await GeneratedReport.findById(
        report._id
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category"
        )
        .populate(
          "internship",
          "title company"
        )
        .populate(
          "template",
          "name type fields templateFile positions"
        );

    return res.status(200).json({
      success: true,
      message:
        "Report details updated successfully.",
      report: updatedReport,
    });

  } catch (error) {

    console.error(
      "UPDATE REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update report.",
      error: error.message,
    });
  }
};



// =====================================================
// REQUEST REVISION
// =====================================================

export const requestReportRevision = async (
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
        success: false,
        message: "Report not found.",
      });
    }

    report.status = "revision";

    report.employeeRemark =
      req.body.remark ||
      "Please review and correct the report details.";

    report.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;

    report.verifiedAt =
      new Date();

    await report.save();

    return res.status(200).json({
      success: true,
      message:
        "Report revision requested successfully.",
      report,
    });

  } catch (error) {

    console.error(
      "REQUEST REPORT REVISION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to request report revision.",
      error: error.message,
    });
  }
};



// =====================================================
// EMPLOYEE APPROVE REPORT
// GENERATE FINAL PDF + EMAIL
// =====================================================

export const approveGeneratedReport = async (
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
          "title"
        )
        .populate(
          "internship",
          "title company"
        )
        .populate(
          "template"
        );


    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }


    if (report.status === "approved") {
      return res.status(400).json({
        success: false,
        message:
          "Report is already approved.",
      });
    }


    if (
      !report.template ||
      !report.template.templateFile
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Report template file is missing.",
      });
    }


    const studentName =
      report.data?.studentName ||
      report.student?.name ||
      "Student";


    const courseName =
      report.data?.courseName ||
      report.course?.title ||
      report.internship?.title ||
      "SkilVira Program";


    const reportId =
      report.data?.reportId ||
      `RPT-${Date.now()}`;


    const issueDate =
      report.data?.issueDate ||
      new Date().toLocaleDateString(
        "en-IN"
      );


    let templatePath =
      report.template.templateFile;


    if (templatePath.startsWith("/")) {

      templatePath =
        path.join(
          process.cwd(),
          templatePath
        );

    }


    // ==========================================
    // GENERATE FINAL REPORT PDF
    // ==========================================

    const generated =
      await generateReport({

        templatePath,

        positions:
          report.template.positions ||
          {},

        studentName,

        courseName,

        marks:
          report.data?.marks || "",

        grade:
          report.data?.grade || "",

        attendance:
          report.data?.attendance || "",

        duration:
          report.data?.duration || "",

        performance:
          report.data?.performance || "",

        feedback:
          report.data?.feedback || "",

        issueDate,

        reportId,

        instructorName:
          report.data?.instructorName ||
          "",

      });


    // ==========================================
    // SAVE FINAL FILE
    // ==========================================

    report.reportFile =
      generated.reportFile;


    report.data = {

      ...(report.data?.toObject?.() ||
        report.data ||
        {}),

      studentName,

      courseName,

      issueDate,

      reportId:
        generated.reportId,

    };


    report.status =
      "approved";


    report.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    report.verifiedAt =
      new Date();


    report.employeeRemark =
      req.body.remark ||
      "Report approved.";


    await report.save();


    // ==========================================
    // SEND REPORT EMAIL
    // ==========================================

    let emailSent = false;
    let emailError = null;


    const studentEmail =
      report.student?.email;


    if (studentEmail) {

      try {

        await sendCertificateEmail({

          to: studentEmail,

          studentName,

          courseName,

          certificateId:
            generated.reportId,

          certificateFile:
            generated.reportFile,

        });


        report.emailSent =
          true;


        report.emailSentAt =
          new Date();


        emailSent = true;


        await report.save();

      } catch (mailError) {

        console.error(
          "REPORT EMAIL ERROR:",
          mailError
        );

        emailError =
          mailError.message;
      }

    } else {

      emailError =
        "Student email not found.";

    }


    return res.status(200).json({

      success: true,

      message:
        emailSent
          ? "Report approved, generated and emailed to student."
          : "Report approved and generated, but email could not be sent.",

      emailSent,

      emailError,

      report,

    });


  } catch (error) {

    console.error(
      "APPROVE REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve report.",
      error: error.message,
    });
  }
};



// =====================================================
// EMPLOYEE REJECT REPORT
// =====================================================

export const rejectGeneratedReport = async (
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
        success: false,
        message: "Report not found.",
      });
    }


    report.status =
      "rejected";


    report.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    report.verifiedAt =
      new Date();


    report.employeeRemark =
      req.body.reason ||
      req.body.remark ||
      "Report rejected by employee.";


    await report.save();


    return res.status(200).json({

      success: true,

      message:
        "Report rejected successfully.",

      report,

    });

  } catch (error) {

    console.error(
      "REJECT REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject report.",
      error: error.message,
    });
  }
};



// =====================================================
// GET APPROVED REPORTS
// =====================================================

export const getApprovedReports = async (
  req,
  res
) => {
  try {

    const reports =
      await GeneratedReport.find({
        status: "approved",
      })
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category"
        )
        .populate(
          "internship",
          "title company"
        )
        .populate(
          "template",
          "name type fields templateFile"
        )
        .sort({
          verifiedAt: -1,
        });


    return res.status(200).json({

      success: true,

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

      success: false,

      message:
        "Failed to fetch approved reports.",

      error: error.message,

    });

  }
};