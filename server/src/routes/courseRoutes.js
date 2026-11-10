import express from "express";
import auth from "../middleware/auth.js";

import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

const REFERRAL_SETTING_FIELDS = [
  "studentReferralDiscountEnabled",
  "studentReferralDiscountType",
  "studentReferralDiscountValue",
  "ambassadorCommissionEnabled",
  "ambassadorCommissionType",
  "ambassadorCommissionValue",
];

const requireControlForReferralSettings = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  const attemptsProtectedChange = REFERRAL_SETTING_FIELDS.some(
    (field) => Object.prototype.hasOwnProperty.call(req.body || {}, field)
  );

  if (attemptsProtectedChange && role !== "control") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admin can change referral discount or commission settings.",
    });
  }

  return next();
};


const requireCourseStaff = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (["employee", "control", "admin", "superadmin"].includes(role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only authorized staff can manage courses.",
  });
};

// Public course browsing
router.get("/", getCourses);
router.get("/:id", getCourse);

// Staff-only changes
router.post("/", auth, requireCourseStaff, requireControlForReferralSettings, createCourse);
router.put("/:id", auth, requireCourseStaff, requireControlForReferralSettings, updateCourse);
router.delete("/:id", auth, requireCourseStaff, deleteCourse);

export default router;
