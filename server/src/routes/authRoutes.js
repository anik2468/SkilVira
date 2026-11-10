import express from "express";

import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  loginLimiter,
  registrationLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middleware/authRateLimiters.js";

const router = express.Router();

router.post("/register", registrationLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

export default router;
