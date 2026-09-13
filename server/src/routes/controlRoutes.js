import express from "express";

import {
  getDashboard,
  getUsers,
  approveInternship,
  rejectInternship,
  deleteUser,
  createUser,
} from "../controllers/controlController.js";

const router = express.Router();

// ======================================
// Dashboard
// ======================================
router.get("/dashboard", getDashboard);

// ======================================
// Users
// ======================================
router.get("/users", getUsers);

router.delete("/users/:id", deleteUser);

// Create User
router.post(
  "/users/create",
  createUser
);

// ======================================
// Internship Approval
// ======================================
router.put(
  "/internships/:id/approve",
  approveInternship
);

router.put(
  "/internships/:id/reject",
  rejectInternship
);

export default router;