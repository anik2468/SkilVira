import express from "express";

import {
  getRecruiterProfile,
  saveRecruiterProfile,
  recruiterDashboard,
} from "../controllers/recruiterController.js";

const router = express.Router();

// ======================================
// Dashboard
// ======================================
router.get(
  "/dashboard/:userId",
  recruiterDashboard
);

// ======================================
// Recruiter Profile
// ======================================
router
  .route("/:userId")
  .get(getRecruiterProfile)
  .put(saveRecruiterProfile);

// ======================================
// Delete Recruiter Profile (Future)
// ======================================
router.delete("/:userId", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Delete API coming soon.",
  });
});

export default router;