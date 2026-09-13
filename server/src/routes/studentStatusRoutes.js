import express from "express";
import auth from "../middleware/auth.js";

import {
  getMyStatus,
  getMyStatusById,
} from "../controllers/studentStatusController.js";

const router = express.Router();

router.get("/", auth, getMyStatus);

router.get("/:id", auth, getMyStatusById);

export default router;