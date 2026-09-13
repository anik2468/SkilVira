import express from "express";

import {
  getEmployeeProfile,
  saveEmployeeProfile,
  employeeDashboard,
  getEmployees,

  // Recruiter Approval
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,

  // Ambassador Approval
  getPendingAmbassadors,
  approveAmbassador,
  rejectAmbassador,

  // Internship Approval
  getPendingInternships,
  approveInternship,
  rejectInternship,

  // User Management
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,

} from "../controllers/employeeController.js";


const router = express.Router();



// ======================================
// Employee Dashboard
// ======================================

router.get(
  "/dashboard/:userId",
  employeeDashboard
);




// ======================================
// User Management
// ======================================

router.get(
  "/users",
  getAllUsers
);


router.put(
  "/users/block/:id",
  blockUser
);


router.put(
  "/users/unblock/:id",
  unblockUser
);


router.delete(
  "/users/delete/:id",
  deleteUser
);




// ======================================
// Recruiter Approval
// ======================================

router.get(
  "/recruiters/pending",
  getPendingRecruiters
);


router.put(
  "/recruiters/approve/:id",
  approveRecruiter
);


router.put(
  "/recruiters/reject/:id",
  rejectRecruiter
);




// ======================================
// Ambassador Approval
// ======================================

router.get(
  "/ambassadors/pending",
  getPendingAmbassadors
);


router.put(
  "/ambassadors/approve/:id",
  approveAmbassador
);


router.put(
  "/ambassadors/reject/:id",
  rejectAmbassador
);




// ======================================
// Internship Approval
// ======================================

router.get(
  "/internships/pending",
  getPendingInternships
);


router.put(
  "/internships/approve/:id",
  approveInternship
);


router.put(
  "/internships/reject/:id",
  rejectInternship
);




// ======================================
// All Employees
// ======================================

router.get(
  "/",
  getEmployees
);




// ======================================
// Employee Profile
// ======================================

router
  .route("/:userId")
  .get(getEmployeeProfile)
  .put(saveEmployeeProfile);



export default router;