import express from "express";

import {
  getCompany,
  saveCompany,
  deleteCompany,
  getCompanies,
} from "../controllers/companyController.js";

const router = express.Router();

// ======================================
// Public
// ======================================

// Get All Companies
router.get("/", getCompanies);

// ======================================
// Recruiter Company
// ======================================

// Get Company Profile
router.get("/:userId", getCompany);

// Create / Update Company
router.put("/:userId", saveCompany);

// Delete Company
router.delete("/:userId", deleteCompany);

export default router;