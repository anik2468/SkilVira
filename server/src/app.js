import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

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
import liveClassRoutes from "./routes/liveClassRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import companySettingRoutes from "./routes/companySettingRoutes.js";
import platformSettingsRoutes from "./routes/platformSettingsRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";

import certificateRoutes from "./routes/certificateRoutes.js";
import certificateTemplateRoutes from "./routes/certificateTemplateRoutes.js";
import certificateGenerateRoutes from "./routes/certificateGenerateRoutes.js";
import generatedCertificateRoutes from "./routes/generatedCertificateRoutes.js";

import offerLetterTemplateRoutes from "./routes/offerLetterTemplateRoutes.js";
import generatedOfferLetterRoutes from "./routes/generatedOfferLetterRoutes.js";

import reportTemplateRoutes from "./routes/reportTemplateRoutes.js";
import generatedReportRoutes from "./routes/generatedReportRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";
import paymentSettingRoutes from "./routes/paymentSettingRoutes.js";

import studentDocumentRoutes from "./routes/studentDocumentRoutes.js";
import studentOfferLetterRoutes from "./routes/studentOfferLetterRoutes.js";
import studentStatusRoutes from "./routes/studentStatusRoutes.js";
import enrollmentCompletionRoutes from "./routes/enrollmentCompletionRoutes.js";
import controlEmployeeRoutes from "./routes/controlEmployeeRoutes.js";

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Authentication
app.use("/api/auth", authRoutes);

// Main platform
app.use("/api/internships", internshipRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/control", controlEmployeeRoutes);
app.use("/api/control", controlRoutes);
// Both aliases support older and newer frontend service calls.
app.use("/api/ambassador", ambassadorRoutes);
app.use("/api/ambassadors", ambassadorRoutes);

// Companies and college/university directory
app.use("/api/companies", companyRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/colleges", universityRoutes);

// Legacy and Control college API aliases
app.use("/api/control/colleges", universityRoutes);
app.use("/api/control/universities", universityRoutes);

// Courses and learning
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/live-classes", liveClassRoutes);
app.use("/api/enrollment-completion", enrollmentCompletionRoutes);

// Payments and uploads
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-settings", paymentSettingRoutes);
app.use("/api/upload", uploadRoutes);

// Referral and communities
app.use("/api/referral", referralRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/communities", communityRoutes);

// Company/platform settings
app.use("/api/company-settings", companySettingRoutes);
app.use("/api/platform-settings", platformSettingsRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Student documents
app.use("/api/student-documents", studentDocumentRoutes);
app.use("/api/student-offer-letters", studentOfferLetterRoutes);
app.use("/api/student-status", studentStatusRoutes);

// Certificates
app.use("/api/certificates", certificateRoutes);
app.use("/api/certificate-template", certificateTemplateRoutes);
app.use("/api/certificate-templates", certificateTemplateRoutes);

// Legacy certificate draft-generation endpoint
app.use("/api/certificate", certificateGenerateRoutes);

// IMPORTANT: Workflow APIs must use generatedCertificateRoutes,
// not the legacy certificateGenerateRoutes.
app.use("/api/generated-certificates", generatedCertificateRoutes);

// Offer letters
app.use("/api/offer-letter-templates", offerLetterTemplateRoutes);
app.use("/api/generated-offer-letter", generatedOfferLetterRoutes);

// Reports
app.use("/api/report-templates", reportTemplateRoutes);
app.use("/api/generated-report", generatedReportRoutes);

// Health check
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SkilVira API is running.",
    version: "1.0.0",
  });
});

// Unknown API route
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API Route Not Found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err.status || err.statusCode) || 500;

  return res.status(status).json({
    success: false,
    message:
      status >= 500
        ? "Internal Server Error"
        : err.message || "Request failed",
  });
});

export default app;