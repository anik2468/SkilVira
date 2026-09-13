import express from "express";

import {
  createCommunity,
  getCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
} from "../controllers/communityController.js";

const router =
  express.Router();

router.get(
  "/",
  getCommunities
);

router.post(
  "/",
  createCommunity
);

router.get(
  "/:id",
  getCommunity
);

router.put(
  "/:id",
  updateCommunity
);

router.delete(
  "/:id",
  deleteCommunity
);

export default router;