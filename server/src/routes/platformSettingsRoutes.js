import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import auth from "../middleware/auth.js";
import PlatformSetting from "../models/PlatformSetting.js";

const router = express.Router();
const allowedRoles = ["control"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Upload a JPG, PNG, or WEBP image.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

router.get("/", async (_req, res) => {
  try {
    const saved = await PlatformSetting.findOne()
      .select("platformName platformLogoUrl")
      .lean();

    res.json({
      success: true,
      settings: {
        platformName: saved?.platformName || "SkilVira",
        platformLogoUrl: saved?.platformLogoUrl || "",
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to load website branding.",
    });
  }
});

router.post("/logo", auth, (req, res, next) => {
  const role = String(req.user?.role || req.user?.userRole || "")
    .toLowerCase();

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to change website branding.",
    });
  }

  next();
}, (req, res, next) => {
  upload.single("logo")(req, res, (error) => {
    if (error) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message || "Logo upload failed.",
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a logo image.",
      });
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Logo storage is not configured yet. Configure Cloudinary on the backend.",
      });
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const base64Image =
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "skilvira/branding",
      public_id: "platform-logo",
      overwrite: true,
      resource_type: "image",
    });

    let settings = await PlatformSetting.findOne();
    if (!settings) settings = new PlatformSetting();

    settings.platformLogoUrl = result.secure_url;
    settings.updatedBy = req.user?.id || req.user?._id || null;
    await settings.save();

    return res.json({
      success: true,
      message: "Website logo updated.",
      logoUrl: result.secure_url,
      settings: {
        platformName: settings.platformName || "SkilVira",
        platformLogoUrl: settings.platformLogoUrl,
      },
    });
  } catch (error) {
    console.error("PLATFORM LOGO UPLOAD ERROR:", error.message);
    return res.status(502).json({
      success: false,
      message: "Logo upload failed. Check Cloudinary configuration and try again.",
    });
  }
});

export default router;
