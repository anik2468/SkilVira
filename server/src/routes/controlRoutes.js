import express from "express";
import auth from "../middleware/auth.js";

import {
  getDashboard,
  getUsers,
  approveInternship,
  rejectInternship,
  deleteUser,
  createUser,
} from "../controllers/controlController.js";

import {
  getControlUserById,
  blockControlUser,
  unblockControlUser,
  getControlInternships,
  deleteControlInternship,
  getControlRecruiters,
  approveControlRecruiter,
  rejectControlRecruiter,
  getControlStudents,
  deleteControlStudent,
  getControlApplications,
  updateControlApplicationStatus,
  getControlCertificates,
  verifyControlCertificate,
  getControlSettings,
  updateControlSettings,
} from "../controllers/controlManagementController.js";

const router = express.Router();

const requireControl = (req, res, next) => {
  const role = String(
    req.user?.role || req.user?.userRole || ""
  ).toLowerCase();

  if (role !== "control") {
    return res.status(403).json({
      success: false,
      message: "Control administrator access is required.",
    });
  }

  return next();
};

router.use(auth, requireControl);

// Dashboard
router.get("/dashboard", getDashboard);

// Users
router.get("/users", getUsers);
router.get("/users/:id", getControlUserById);
router.post("/users/create", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/block", blockControlUser);
router.put("/users/:id/unblock", unblockControlUser);

// Internships
router.get("/internships", getControlInternships);
router.put("/internships/:id/approve", approveInternship);
router.put("/internships/:id/reject", rejectInternship);
router.delete("/internships/:id", deleteControlInternship);

// Recruiters
router.get("/recruiters", getControlRecruiters);
router.put("/recruiters/:id/approve", approveControlRecruiter);
router.put("/recruiters/:id/reject", rejectControlRecruiter);

// Students
router.get("/students", getControlStudents);
router.delete("/students/:id", deleteControlStudent);

// Applications
router.get("/applications", getControlApplications);
router.put("/applications/:id", updateControlApplicationStatus);

// Certificates
router.get("/certificates", getControlCertificates);
router.put("/certificates/:id/verify", verifyControlCertificate);

// Persisted platform settings
router.get("/settings", getControlSettings);
router.put("/settings", updateControlSettings);

export default router;