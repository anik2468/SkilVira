import express from "express";
import auth from "../middleware/auth.js";

import {
  getEmployees,
  createEmployee,
  updateEmployeeStatus,
  removeEmployee,
  getEmployeeActivity,
} from "../controllers/controlEmployeeController.js";

const router = express.Router();

const requireControlAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase();

  if (!["control", "admin", "superadmin"].includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Control-panel administrator access required.",
    });
  }

  next();
};

// All endpoints require login and control/admin privileges.
router.use(auth, requireControlAdmin);

// Employee directory and employee creation
router.get("/employees", getEmployees);
router.post("/employees", createEmployee);

// Employee access management
router.patch("/employees/:id/status", updateEmployeeStatus);
router.delete("/employees/:id", removeEmployee);

// Employee audit/activity history
router.get("/employee-activity", getEmployeeActivity);

export default router;