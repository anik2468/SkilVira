import express from "express";
import multer from "multer";
import { uploadImageBuffer, uploadPdfBuffer } from "../utils/cloudinaryUpload.js";

import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import uploadCertificate from "../middleware/uploadCertificate.js";
import uploadProfile from "../middleware/uploadProfile.js";
import uploadResume from "../middleware/uploadResume.js";
import {
  thumbnailUpload,
  videoUpload,
} from "../middleware/uploadCourseMedia.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || req.user?.userRole || "").toLowerCase();

const requireCourseStaff = (req, res, next) => {
  if (["employee", "control", "admin"].includes(getRole(req))) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only authorized course staff can upload course media.",
  });
};

const requireControl = (req, res, next) => {
  if (getRole(req) === "control") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only Super Admin can upload certificate templates.",
  });
};

// Generic image upload
router.post(
  "/",
  auth,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    return res.status(201).json({
      success: true,
      url: `/uploads/${req.file.filename}`,
    });
  }
);

// Profile photo upload used by recruiter and other profile pages.
// The frontend sends multipart field name "image".
router.post(
  "/avatar",
  auth,
  uploadProfile.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
    }

    const url = `/uploads/profile/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      url,
      path: url,
      data: { url, path: url },
    });
  }
);

// Resume PDF upload
router.post(
  "/resume",
  auth,
  uploadResume.single("resume"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required.",
      });
    }

    const url = `/uploads/resume/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      url,
      path: url,
      data: { url, path: url },
    });
  }
);

// Certificate template upload
router.post(
  "/certificate",
  auth,
  requireControl,
  uploadCertificate.single("certificate"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate file is required.",
      });
    }

    const url = `/uploads/certificate/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      url,
      path: url,
    });
  }
);


// Course thumbnail upload (employee/control only)
router.post(
  "/course-thumbnail",
  auth,
  requireCourseStaff,
  thumbnailUpload.single("thumbnail"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a thumbnail image.",
      });
    }

    try {
      const uploaded = await uploadImageBuffer(req.file, {
        folder: "skilvira/course-thumbnails",
      });
      return res.status(201).json({
        success: true,
        url: uploaded.secure_url,
        path: uploaded.secure_url,
      });
    } catch (error) {
      return res.status(error.status || 502).json({
        success: false,
        message: error.status === 503
          ? error.message
          : "Unable to store the thumbnail. Please try again.",
      });
    }
  }
);

// Course video upload (employee/control only)
router.post(
  "/course-video",
  auth,
  requireCourseStaff,
  videoUpload.single("video"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a video file.",
      });
    }

    return res.status(201).json({
      success: true,
      url: `/uploads/courses/videos/${req.file.filename}`,
    });
  }
);


// Course notes PDF upload; employee/control only.
const courseNotesPdfUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf" || !/\.pdf$/i.test(file.originalname || "")) {
      const error = new Error("Please upload a PDF document.");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/course-notes",
  auth,
  requireCourseStaff,
  courseNotesPdfUpload.single("pdf"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a PDF." });
    }
    try {
      const uploaded = await uploadPdfBuffer(req.file);
      return res.status(201).json({
        success: true,
        url: uploaded.secure_url,
        path: uploaded.secure_url,
      });
    } catch (error) {
      console.error("COURSE NOTES PDF UPLOAD ERROR:", error);
      return res.status(error.status || 502).json({
        success: false,
        message: error.message || "Unable to upload notes PDF.",
      });
    }
  }
);

export default router;