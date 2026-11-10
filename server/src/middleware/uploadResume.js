import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDirectory = path.resolve(process.cwd(), "uploads", "resume");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    callback(
      null,
      `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.pdf`
    );
  },
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase();

  if (file.mimetype !== "application/pdf" || extension !== ".pdf") {
    const error = new Error("Please upload a PDF resume.");
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
