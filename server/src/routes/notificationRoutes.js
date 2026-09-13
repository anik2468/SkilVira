import express from "express";

import auth from "../middleware/auth.js";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";


const router = express.Router();


// =========================================
// MY NOTIFICATIONS
// =========================================

router.get(
  "/",
  auth,
  getMyNotifications
);


// =========================================
// MARK ALL READ
// =========================================

router.put(
  "/read-all",
  auth,
  markAllNotificationsAsRead
);


// =========================================
// MARK ONE READ
// =========================================

router.put(
  "/:id/read",
  auth,
  markNotificationAsRead
);


// =========================================
// DELETE
// =========================================

router.delete(
  "/:id",
  auth,
  deleteNotification
);


export default router;