import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

// =====================================================
// EXISTING ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import ambassadorRoutes from "./routes/ambassadorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import controlRoutes from "./routes/controlRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import companySettingRoutes from "./routes/companySettingRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

// =====================================================
// CERTIFICATE SYSTEM
// =====================================================

import certificateRoutes from "./routes/certificateRoutes.js";
import certificateTemplateRoutes from "./routes/certificateTemplateRoutes.js";
import certificateGenerateRoutes from "./routes/certificateGenerateRoutes.js";

// =====================================================
// OFFER LETTER SYSTEM
// =====================================================

import offerLetterTemplateRoutes from "./routes/offerLetterTemplateRoutes.js";
import generatedOfferLetterRoutes from "./routes/generatedOfferLetterRoutes.js";

// =====================================================
// REPORT SYSTEM
// =====================================================

import reportTemplateRoutes from "./routes/reportTemplateRoutes.js";
import generatedReportRoutes from "./routes/generatedReportRoutes.js";

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

import notificationRoutes from "./routes/notificationRoutes.js";

// =====================================================
// PAYMENT SETTINGS
// =====================================================

import paymentSettingRoutes from "./routes/paymentSettingRoutes.js";

// =====================================================
// STUDENT DOCUMENT SYSTEM
// =====================================================

import studentDocumentRoutes from "./routes/studentDocumentRoutes.js";

// =====================================================
// STUDENT OFFER LETTER SYSTEM
// =====================================================

import studentOfferLetterRoutes from "./routes/studentOfferLetterRoutes.js";

// =====================================================
// STUDENT STATUS / TRACKING SYSTEM
// =====================================================

import studentStatusRoutes from "./routes/studentStatusRoutes.js";

// =====================================================
// ENROLLMENT COMPLETION SYSTEM
// =====================================================

import enrollmentCompletionRoutes from "./routes/enrollmentCompletionRoutes.js";

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// =====================================================
// AUTH
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// INTERNSHIPS
// =====================================================

app.use(
  "/api/internships",
  internshipRoutes
);

// =====================================================
// DASHBOARD
// =====================================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// =====================================================
// STUDENT
// =====================================================

app.use(
  "/api/student",
  studentRoutes
);

app.use(
  "/api/student-profile",
  studentProfileRoutes
);

// =====================================================
// STUDENT DOCUMENTS
// =====================================================

app.use(
  "/api/student-documents",
  studentDocumentRoutes
);

// =====================================================
// STUDENT OFFER LETTERS
// =====================================================

app.use(
  "/api/student-offer-letters",
  studentOfferLetterRoutes
);

// =====================================================
// STUDENT STATUS / TRACKING
// =====================================================

app.use(
  "/api/student-status",
  studentStatusRoutes
);

// =====================================================
// APPLICATIONS
// =====================================================

app.use(
  "/api/applications",
  applicationRoutes
);

// =====================================================
// RECRUITER
// =====================================================

app.use(
  "/api/recruiter",
  recruiterRoutes
);

// =====================================================
// EMPLOYEE
// =====================================================

app.use(
  "/api/employee",
  employeeRoutes
);

// =====================================================
// AMBASSADOR
// =====================================================

app.use(
  "/api/ambassador",
  ambassadorRoutes
);

// =====================================================
// USERS
// =====================================================

app.use(
  "/api/users",
  userRoutes
);

// =====================================================
// CONTROL / ADMIN
// =====================================================

app.use(
  "/api/control",
  controlRoutes
);

// =====================================================
// COURSES
// =====================================================

app.use(
  "/api/courses",
  courseRoutes
);

// =====================================================
// PAYMENTS
// =====================================================

app.use(
  "/api/payments",
  paymentRoutes
);

// =====================================================
// UPLOAD
// =====================================================

app.use(
  "/api/upload",
  uploadRoutes
);

// =====================================================
// ENROLLMENT
// =====================================================

app.use(
  "/api/enrollment",
  enrollmentRoutes
);

// =====================================================
// ENROLLMENT COMPLETION
// =====================================================

app.use(
  "/api/enrollment-completion",
  enrollmentCompletionRoutes
);

// =====================================================
// LESSONS
// =====================================================

app.use(
  "/api/lessons",
  lessonRoutes
);

// =====================================================
// REFERRAL SYSTEM
// =====================================================

// Preferred plural route
app.use(
  "/api/referrals",
  referralRoutes
);

// Backward compatibility
app.use(
  "/api/referral",
  referralRoutes
);

// =====================================================
// COMMUNITY SYSTEM
// =====================================================

app.use(
  "/api/communities",
  communityRoutes
);

// =====================================================
// COMPANY SETTINGS
// =====================================================

app.use(
  "/api/company-settings",
  companySettingRoutes
);

// =====================================================
// PAYMENT SETTINGS
// Employee manages QR / UPI / Bank Details
// =====================================================

app.use(
  "/api/payment-settings",
  paymentSettingRoutes
);

// =====================================================
// NOTIFICATIONS
// =====================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// CERTIFICATE SYSTEM
// =====================================================

// Existing certificate routes
app.use(
  "/api/certificates",
  certificateRoutes
);

// Existing singular template path
app.use(
  "/api/certificate-template",
  certificateTemplateRoutes
);

// Frontend-friendly plural template path
app.use(
  "/api/certificate-templates",
  certificateTemplateRoutes
);

// Generated certificate
app.use(
  "/api/certificate",
  certificateGenerateRoutes
);

// Compatibility alias
app.use(
  "/api/generated-certificates",
  certificateGenerateRoutes
);

// =====================================================
// OFFER LETTER TEMPLATE SYSTEM
// =====================================================

app.use(
  "/api/offer-letter-templates",
  offerLetterTemplateRoutes
);

// =====================================================
// GENERATED OFFER LETTER SYSTEM
// =====================================================

app.use(
  "/api/generated-offer-letter",
  generatedOfferLetterRoutes
);

// =====================================================
// REPORT TEMPLATE SYSTEM
// =====================================================

app.use(
  "/api/report-templates",
  reportTemplateRoutes
);

// =====================================================
// GENERATED REPORT SYSTEM
// =====================================================

app.use(
  "/api/generated-report",
  generatedReportRoutes
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "🚀 SkilVira API is running...",
      version: "1.0.0",
    });
  }
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API Route Not Found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      err
    );

    res
      .status(
        err.status || 500
      )
      .json({
        success: false,
        message:
          err.message ||
          "Internal Server Error",
      });
  }
);

export default app;