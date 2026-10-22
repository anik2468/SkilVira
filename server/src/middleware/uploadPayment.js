import multer from "multer";

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const uploadPayment = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Only JPG, JPEG, PNG and WEBP payment screenshots are allowed.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadPayment;
