import auth from "../middleware/auth.js";
import express from "express";

import {
  getCompanySetting,
  updateCompanySetting,
  uploadCompanyAssets,
  removeCompanyGalleryImage,
  removeCompanyBrochure
} from "../controllers/companySettingController.js";


import companyAssetsUpload from "../middleware/companyAssetsUpload.js";


const router = express.Router();

const requireSettingsEditor = (req, res, next) => {
  const role = String(req.user?.role || req.user?.userRole || "")
    .toLowerCase();

  if (!["employee", "control", "admin", "superadmin", "super_admin"].includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Employee or Control/Admin access is required."
    });
  }

  return next();
};




// Get Settings

router.get(
  "/",
  getCompanySetting
);




// Update Settings

router.put("/", auth, requireSettingsEditor, updateCompanySetting);




// Upload Assets

router.post(
  "/upload",
  auth,
  requireSettingsEditor,
  companyAssetsUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
    { name: "brochure", maxCount: 1 },
    { name: "gallery", maxCount: 12 }
  ]),
  uploadCompanyAssets
);

router.delete("/gallery/:index", auth, requireSettingsEditor, removeCompanyGalleryImage);
router.delete("/brochure", auth, requireSettingsEditor, removeCompanyBrochure);


export default router;