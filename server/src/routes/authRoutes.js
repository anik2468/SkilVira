import express from "express";

import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";


const router = express.Router();


// Register
router.post(
  "/register",
  register
);


// Login
router.post(
  "/login",
  login
);


// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);


// Reset Password
router.post(
  "/reset-password/:token",
  resetPassword
);


export default router;