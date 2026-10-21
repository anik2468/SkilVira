import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const createUploader = (folder, types, maxSize) => {
  const dir = path.resolve(process.cwd(), "uploads", "courses", folder);
  fs.mkdirSync(dir, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, dir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!types.includes(file.mimetype)) {
        const error = new Error("Unsupported file type.");
        error.status = 400;
        return cb(error);
      }
      cb(null, true);
    },
    limits: { fileSize: maxSize },
  });
};

export const thumbnailUpload = createUploader(
  "thumbnails",
  ["image/jpeg", "image/png", "image/webp"],
  5 * 1024 * 1024
);

export const videoUpload = createUploader(
  "videos",
  ["video/mp4", "video/webm", "video/quicktime"],
  500 * 1024 * 1024
);
