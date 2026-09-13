import express from "express";

import {

  createInternship,

  createSkilViraInternship,

  getInternships,

  getInternshipById,

  getRecruiterInternships,

  getPendingInternships,

  latestInternships,

  featuredInternships,

  updateInternship,

  deleteInternship,

  approveInternship,

  rejectInternship,

  featureInternship,

} from "../controllers/internshipController.js";



const router = express.Router();




// ======================================
// Public Routes
// ======================================


// All Approved Internships
router.get(
  "/",
  getInternships
);



// Latest Internships
router.get(
  "/latest",
  latestInternships
);



// Featured Internships
router.get(
  "/featured",
  featuredInternships
);



// Internship Details
router.get(
  "/:id",
  getInternshipById
);






// ======================================
// Recruiter Routes
// ======================================


// Recruiter Internships
router.get(
  "/recruiter/:recruiterId",
  getRecruiterInternships
);



// Create Recruiter Internship
router.post(
  "/",
  createInternship
);



// Update Internship
router.put(
  "/:id",
  updateInternship
);



// Delete Internship
router.delete(
  "/:id",
  deleteInternship
);







// ======================================
// Employee / SkilVira Routes
// ======================================


// Create SkilVira Internship
router.post(
  "/skilvira/create",
  createSkilViraInternship
);



// Pending Internships
router.get(
  "/pending/all",
  getPendingInternships
);



// Approve Internship
router.put(
  "/approve/:id",
  approveInternship
);



// Reject Internship
router.put(
  "/reject/:id",
  rejectInternship
);



// Feature Internship
router.put(
  "/feature/:id",
  featureInternship
);




export default router;