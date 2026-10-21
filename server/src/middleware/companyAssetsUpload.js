import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`);
  },
});

const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
]);

const brochureTypes = new Set([...imageTypes, "application/pdf"]);

const fileFilter = (_req, file, cb) => {
  const validImageField = ["logo", "qrCode", "gallery"].includes(file.fieldname);
  const valid =
    (validImageField && imageTypes.has(file.mimetype)) ||
    (file.fieldname === "brochure" && brochureTypes.has(file.mimetype));

  if (valid) return cb(null, true);
  return cb(new Error("Use JPG, PNG or WEBP images; brochure also accepts PDF."), false);
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 15,
  },
});
