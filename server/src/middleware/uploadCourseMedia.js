import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];

export const thumbnailUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, callback) => {
    if (!imageTypes.includes(file.mimetype)) {
      const error = new Error("Unsupported thumbnail file type.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const videoDir = path.resolve(process.cwd(), "uploads", "courses", "videos");
fs.mkdirSync(videoDir, { recursive: true });

export const videoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, videoDir),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`);
    },
  }),
  fileFilter: (_req, file, callback) => {
    if (!videoTypes.includes(file.mimetype)) {
      const error = new Error("Unsupported video file type.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
  limits: { fileSize: 500 * 1024 * 1024 },
});
