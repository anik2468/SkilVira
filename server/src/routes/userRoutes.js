import express from "express";

import {
  getAllUsers,
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
  blockUser,
  unblockUser,
  deleteUser,
  updateAvatar,
} from "../controllers/userController.js";

const router = express.Router();

// ==============================
// Users
// ==============================

// Get All Users
router.get("/", getAllUsers);

// Pending Recruiters
router.get(
  "/recruiters/pending",
  getPendingRecruiters
);

// Approve Recruiter
router.put(
  "/recruiters/approve/:id",
  approveRecruiter
);

// Reject Recruiter
router.put(
  "/recruiters/reject/:id",
  rejectRecruiter
);

// Block User
router.put(
  "/block/:id",
  blockUser
);

// Unblock User
router.put(
  "/unblock/:id",
  unblockUser
);

// Delete User
router.delete(
  "/:id",
  deleteUser
);

// update Avatar
router.put(
  "/avatar/:id",
  updateAvatar
);

export default router;