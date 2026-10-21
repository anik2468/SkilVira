import express from "express";
import auth from "../middleware/auth.js";

import {
  recruiterDashboard,
} from "../controllers/recruiterController.js";

import {
  getRecruiterAccountProfile,
  saveRecruiterAccountProfile,
} from "../controllers/recruiterAccountController.js";

import {
  getRecruiterCompany,
  saveRecruiterCompany,
} from "../controllers/recruiterCompanyController.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || "").toLowerCase();

const getUserId = (req) =>
  String(req.user?.id || req.user?._id || "");

const isStaff = (req) =>
  ["employee", "control"].includes(getRole(req));

const setCurrentUser = (req, res, next) => {
  if (!req.params.userId) {
    req.params.userId = getUserId(req);
  }

  if (!req.params.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  return next();
};

const authorizeTarget = (req, res, next) => {
  const role = getRole(req);
  const requestedId = String(req.params.userId || "");
  const currentId = getUserId(req);

  if (
    isStaff(req) ||
    (role === "recruiter" &&
      currentId &&
      currentId === requestedId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only manage your own recruiter account.",
  });
};

router.use(auth);

// Dashboard
router.get(
  "/dashboard",
  setCurrentUser,
  authorizeTarget,
  recruiterDashboard
);

router.get(
  "/dashboard/:userId",
  authorizeTarget,
  recruiterDashboard
);

// Personal recruiter profile
router.get(
  "/profile",
  setCurrentUser,
  authorizeTarget,
  getRecruiterAccountProfile
);

router.put(
  "/profile",
  setCurrentUser,
  authorizeTarget,
  saveRecruiterAccountProfile
);

router.get(
  "/profile/:userId",
  authorizeTarget,
  getRecruiterAccountProfile
);

router.put(
  "/profile/:userId",
  authorizeTarget,
  saveRecruiterAccountProfile
);

// Company profile
router.get(
  "/company",
  setCurrentUser,
  authorizeTarget,
  getRecruiterCompany
);

router.get(
  "/company/:userId",
  authorizeTarget,
  getRecruiterCompany
);

router.post(
  "/company",
  setCurrentUser,
  authorizeTarget,
  saveRecruiterCompany
);

router.put(
  "/company",
  setCurrentUser,
  authorizeTarget,
  saveRecruiterCompany
);

router.put(
  "/company/:userId",
  authorizeTarget,
  saveRecruiterCompany
);

// Backward-compatible URLs used by recruiterService.js
router.get(
  "/:userId",
  authorizeTarget,
  getRecruiterAccountProfile
);

router.put(
  "/:userId",
  authorizeTarget,
  saveRecruiterAccountProfile
);

router.post(
  "/:userId",
  authorizeTarget,
  saveRecruiterAccountProfile
);

export default router;