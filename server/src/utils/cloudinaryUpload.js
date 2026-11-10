import { v2 as cloudinary } from "cloudinary";

export const isCloudinaryConfigured = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    const error = new Error("Cloud image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend.");
    error.status = 503;
    throw error;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadImageBuffer = async (file, options = {}) => {
  if (!file?.buffer || !file?.mimetype) {
    const error = new Error("An image file is required.");
    error.status = 400;
    throw error;
  }

  configureCloudinary();
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: options.folder || "skilvira/uploads",
    ...(options.publicId ? { public_id: options.publicId, overwrite: true } : {}),
    resource_type: "image",
  });
};


// Persistent PDF storage for course notes.
export const uploadPdfBuffer = async (file, options = {}) => {
  if (!file?.buffer) {
    const error = new Error("Please select a PDF file.");
    error.status = 400;
    throw error;
  }

  const signature = file.buffer.subarray(0, 5).toString("ascii");
  if (!/\.pdf$/i.test(String(file.originalname || "")) || signature !== "%PDF-") {
    const error = new Error("Only valid PDF documents are allowed.");
    error.status = 400;
    throw error;
  }

  configureCloudinary();
  const dataUri = `data:application/pdf;base64,${file.buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: options.folder || "skilvira/course-notes",
    public_id: `notes-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.pdf`,
    resource_type: "raw",
    overwrite: false,
  });
};
