import express from "express";
import auth from "../middleware/auth.js";

import {
  listCourseLiveClasses,
  createLiveClass,
  startLiveClass,
  endLiveClass,
  getLiveClassToken,
  getLiveQuiz,
  createLiveQuiz,
  submitLiveQuizAnswer,
  closeLiveQuiz,
} from "../controllers/liveClassController.js";

const router = express.Router();

router.get("/course/:courseId", auth, listCourseLiveClasses);
router.post("/course/:courseId", auth, createLiveClass);

router.post("/:id/start", auth, startLiveClass);
router.post("/:id/end", auth, endLiveClass);
router.post("/:id/token", auth, getLiveClassToken);

router.get("/:id/quiz", auth, getLiveQuiz);
router.post("/:id/quiz", auth, createLiveQuiz);
router.post("/:id/quiz/answer", auth, submitLiveQuizAnswer);
router.post("/:id/quiz/close", auth, closeLiveQuiz);

export default router;
