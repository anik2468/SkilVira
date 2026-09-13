import express from "express";

import auth from "../middleware/auth.js";

import {
  markEnrollmentCompleted,
} from "../services/enrollmentCompletionService.js";

const router = express.Router();


// =====================================================
// COMPLETE ENROLLMENT
// =====================================================

router.put(
  "/:id/complete",
  auth,
  markEnrollmentCompleted
);


export default router;