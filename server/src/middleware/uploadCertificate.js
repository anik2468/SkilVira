import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDirectory = path.resolve(process.cwd(), "uploads", "certificate");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = {
  ".pdf": ["application/pdf"],
  ".jpg": ["image/jpeg", "image/jpg"],
  ".jpeg": ["image/jpeg", "image/jpg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    callback(
      null,
      `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`
    );
  },
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const allowed = allowedMimeTypes[extension] || [];

  if (!allowed.includes(String(file.mimetype || "").toLowerCase())) {
    const error = new Error("Upload a valid PDF, JPG, PNG, or WEBP file.");
    error.status = 400;
    return callback(error);
  }

  return callback(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
