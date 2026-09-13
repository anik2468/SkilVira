import express from "express";

import {

  applyInternship,

  getStudentApplications,

  getRecruiterApplications,

  getAllApplications,

  getApplicationById,

  recruiterApplicationStats,

  updateApplicationStatus,

  withdrawApplication,

} from "../controllers/applicationController.js";


const router = express.Router();



// ======================================
// Student Routes
// ======================================


// Apply Internship
router.post(
  "/apply",
  applyInternship
);



// Student Applications
router.get(
  "/student/:studentId",
  getStudentApplications
);



// Withdraw Application
router.delete(
  "/:id",
  withdrawApplication
);






// ======================================
// Recruiter Routes
// ======================================


// Recruiter Applications
router.get(
  "/recruiter/:recruiterId",
  getRecruiterApplications
);



// Recruiter Stats
router.get(
  "/recruiter/stats/:recruiterId",
  recruiterApplicationStats
);



// Update Application Status
router.put(
  "/status/:id",
  updateApplicationStatus
);






// ======================================
// Employee / Admin / Control
// ======================================


// All Applications
router.get(
  "/",
  getAllApplications
);



// Application Details
router.get(
  "/details/:id",
  getApplicationById
);



export default router;