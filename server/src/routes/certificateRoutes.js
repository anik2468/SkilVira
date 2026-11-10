import express from "express";
import auth from "../middleware/auth.js";

import {
  addCertificate,
  getStudentCertificates,
  getCertificates,
  verifyCertificate,
  rejectCertificate,
  deleteCertificate,
  verifyCertificateById,
} from "../controllers/certificateController.js";

const router = express.Router();

const allowRoles = (...roles) => (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (!roles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action.",
    });
  }

  next();
};

const STAFF_ROLES = ["employee", "admin", "control"];

// Public QR verification must remain before router-wide authentication.
router.get("/verify/:credentialId", verifyCertificateById);

// Every other certificate endpoint requires a valid login.
router.use(auth);

router.post(
  "/",
  allowRoles("student", ...STAFF_ROLES),
  addCertificate
);

router.get(
  "/student/:studentId",
  allowRoles("student", ...STAFF_ROLES),
  (req, res, next) => {
    const role = String(req.user?.role || "").toLowerCase();
    if (
      role === "student" &&
      String(req.params.studentId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own certificates.",
      });
    }
    next();
  },
  getStudentCertificates
);

router.get(
  "/",
  allowRoles(...STAFF_ROLES),
  getCertificates
);

router.put(
  "/verify/id/:id",
  allowRoles(...STAFF_ROLES),
  verifyCertificate
);

router.put(
  "/reject/:id",
  allowRoles(...STAFF_ROLES),
  rejectCertificate
);

// Permanent certificate deletion is restricted to Super Admin.
router.delete(
  "/:id",
  allowRoles("control"),
  deleteCertificate
);

export default router;
