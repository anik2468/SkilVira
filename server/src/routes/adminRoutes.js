import express from "express";
import auth from "../middleware/auth.js";

import {
  getAdminInternships,
  createAdminInternship,
  updateAdminInternship,
  deleteAdminInternship,
} from "../controllers/internshipController.js";


import {
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
  getPendingAmbassadors,
  approveAmbassador,
  rejectAmbassador,
  getPendingInternships,
  approveInternship,
  rejectInternship,
} from "../controllers/employeeController.js";

import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import {
  getCertificates,
  verifyCertificate,
  rejectCertificate,
} from "../controllers/certificateController.js";


import {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
} from "../controllers/adminController.js";

const router = express.Router();

const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access is required.",
    });
  }

  return next();
};

router.use(auth, requireAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUserById);
router.patch("/users/:id", updateAdminUser);


// Recruiter review
router.get("/recruiters/pending", getPendingRecruiters);
router.put("/recruiters/:id/approve", approveRecruiter);
router.put("/recruiters/:id/reject", rejectRecruiter);

// Ambassador review
router.get("/ambassadors/pending", getPendingAmbassadors);
router.put("/ambassadors/:id/approve", approveAmbassador);
router.put("/ambassadors/:id/reject", rejectAmbassador);

// Internship management
router.get("/internships", getAdminInternships);
router.post("/internships", createAdminInternship);
router.put("/internships/:id", updateAdminInternship);
router.delete("/internships/:id", deleteAdminInternship);

// Internship review
router.get("/internships/pending", getPendingInternships);
router.put("/internships/:id/approve", approveInternship);
router.put("/internships/:id/reject", rejectInternship);

// Application review
router.get("/applications", getAllApplications);
router.get("/applications/:id", getApplicationById);
router.patch("/applications/:id/status", updateApplicationStatus);

// Certificate review (verification only; no delete permission)
router.get("/certificates", getCertificates);
router.put("/certificates/:id/verify", verifyCertificate);
router.put("/certificates/:id/reject", rejectCertificate);

export default router;
