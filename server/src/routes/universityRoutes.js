import express from "express";
import auth from "../middleware/auth.js";

import {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  verifyUniversity,
  blockUniversity,
  unblockUniversity,
} from "../controllers/universityController.js";

const router = express.Router();

const requireStaff = (req, res, next) => {
  const role = String(
    req.user?.role || req.user?.userRole || ""
  ).toLowerCase();

  if (["employee", "control"].includes(role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Employee or control access is required.",
  });
};

router.use(auth, requireStaff);

router.get("/", getUniversities);

router.post("/", createUniversity);

router.get("/:id", getUniversityById);

router.put("/:id", updateUniversity);

router.delete("/:id", deleteUniversity);

router.put("/verify/:id", verifyUniversity);

router.put("/block/:id", blockUniversity);

router.put("/unblock/:id", unblockUniversity);

export default router;