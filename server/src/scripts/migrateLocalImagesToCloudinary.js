import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";

const required = ["MONGODB_URI", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error("Missing required environment variable names:", missing.join(", "));
  process.exitCode = 1;
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const resolveLocal = (value) => {
    const raw = String(value || "").trim();
    if (!raw || /^https?:\/\//i.test(raw)) return null;
    const relative = raw.replace(/^\/?uploads\//i, "").replace(/^\/+/, "");
    const filePath = path.resolve(process.cwd(), "uploads", relative);
    return fs.existsSync(filePath) ? filePath : null;
  };

  const migrate = async (Model, field, folder, description) => {
    let uploaded = 0;
    let skipped = 0;
    let missingFiles = 0;
    const docs = await Model.find({ [field]: { $exists: true, $nin: ["", null] } });
    for (const doc of docs) {
      const value = String(doc[field] || "");
      if (/^https?:\/\//i.test(value)) { skipped++; continue; }
      const localPath = resolveLocal(value);
      if (!localPath) { missingFiles++; continue; }
      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder,
          public_id: `${doc._id}-${path.parse(localPath).name}`,
          overwrite: true,
          resource_type: "image",
        });
        doc[field] = result.secure_url;
        await doc.save();
        uploaded++;
        console.log(`Migrated ${description} for record ${doc._id}`);
      } catch (error) {
        console.error(`Failed ${description} for record ${doc._id}:`, error.message);
      }
    }
    console.log(`${description}: uploaded=${uploaded}, alreadyRemote=${skipped}, localFileMissing=${missingFiles}`);
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await migrate(Course, "thumbnail", "skilvira/course-thumbnails", "course thumbnail");
    await migrate(Payment, "paymentScreenshot", "skilvira/payment-proofs", "payment proof");
  } catch (error) {
    console.error("Image migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}
