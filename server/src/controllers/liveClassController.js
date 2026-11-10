import mongoose from "mongoose";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

import LiveClass from "../models/LiveClass.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { createNotification } from "../services/notificationService.js";

const STAFF_ROLES = new Set([
  "employee",
  "control",
  "admin",
  "superadmin",
]);

const CONTROL_ROLES = new Set([
  "control",
  "admin",
  "superadmin",
]);

const userIdOf = (req) =>
  String(req.user?.id || req.user?._id || req.user?.userId || "");

const roleOf = (req) =>
  String(req.user?.role || req.user?.userRole || "").toLowerCase();

const validId = (id) =>
  mongoose.Types.ObjectId.isValid(String(id || ""));

const publicClass = (doc) => ({
  _id: String(doc._id),
  course: String(doc.course),
  title: doc.title,
  description: doc.description,
  scheduledAt: doc.scheduledAt,
  durationMinutes: doc.durationMinutes,
  status: doc.status,
  startedAt: doc.startedAt,
  endedAt: doc.endedAt,
});

const getContext = async (classId) => {
  if (!validId(classId)) {
    return { errorStatus: 400, error: "Invalid live class ID." };
  }

  const liveClass = await LiveClass.findOne({
    _id: classId,
    isDeleted: { $ne: true },
  });

  if (!liveClass) {
    return { errorStatus: 404, error: "Live class not found." };
  }

  const course = await Course.findOne({
    _id: liveClass.course,
    isDeleted: { $ne: true },
  });

  if (!course) {
    return { errorStatus: 404, error: "Course not found." };
  }

  return { liveClass, course };
};

const canManageCourse = (req, course, liveClass = null) => {
  const role = roleOf(req);
  if (!STAFF_ROLES.has(role)) return false;

  if (CONTROL_ROLES.has(role)) return true;

  const uid = userIdOf(req);
  return (
    String(course.createdBy || "") === uid ||
    String(liveClass?.createdBy || "") === uid
  );
};

const hasEnrollment = async (req, course) => {
  if (roleOf(req) !== "student" || !userIdOf(req)) return false;

  const enrollment = await Enrollment.findOne({
    student: userIdOf(req),
    course: course._id,
    status: { $in: ["Active", "Completed"] },
    isDeleted: { $ne: true },
  }).select("_id");

  return Boolean(enrollment);
};

const canAccessClass = async (req, course, liveClass) => {
  if (canManageCourse(req, course, liveClass)) return true;
  return hasEnrollment(req, course);
};

const requireLiveKitConfig = () =>
  Boolean(
    process.env.LIVEKIT_URL &&
    process.env.LIVEKIT_API_KEY &&
    process.env.LIVEKIT_API_SECRET
  );

const requireStaffContext = async (req, res, classId) => {
  const context = await getContext(classId);

  if (context.errorStatus) {
    res.status(context.errorStatus).json({
      success: false,
      message: context.error,
    });
    return null;
  }

  if (!canManageCourse(req, context.course, context.liveClass)) {
    res.status(403).json({
      success: false,
      message: "You are not allowed to manage this course's live classes.",
    });
    return null;
  }

  return context;
};

const requireClassAccess = async (req, res, classId) => {
  const context = await getContext(classId);

  if (context.errorStatus) {
    res.status(context.errorStatus).json({
      success: false,
      message: context.error,
    });
    return null;
  }

  if (!await canAccessClass(req, context.course, context.liveClass)) {
    res.status(403).json({
      success: false,
      message: "Enroll in this course to access its live classes.",
    });
    return null;
  }

  return context;
};

export const listCourseLiveClasses = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!validId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID.",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      isDeleted: { $ne: true },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (STAFF_ROLES.has(roleOf(req))) {
      if (!canManageCourse(req, course)) {
        return res.status(403).json({
          success: false,
          message: "You cannot manage live classes for this course.",
        });
      }
    } else if (!await hasEnrollment(req, course)) {
      return res.status(403).json({
        success: false,
        message: "Enroll in this course to access its live classes.",
      });
    }

    const classes = await LiveClass.find({
      course: course._id,
      isDeleted: { $ne: true },
    })
      .sort({ scheduledAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      classes: classes.map(publicClass),
    });
  } catch (error) {
    console.error("LIST LIVE CLASSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load live classes.",
    });
  }
};


const notifyEnrolledStudentsAboutLiveClass = async ({
  courseId,
  liveClass,
  courseTitle,
  isLive = false,
}) => {
  try {
    const students = await Enrollment.distinct("student", {
      course: courseId,
      status: { $in: ["Active", "Completed"] },
      isDeleted: { $ne: true },
    });

    const scheduledAt = new Date(liveClass.scheduledAt).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }
    );

    const results = await Promise.allSettled(
      students.map((recipient) =>
        createNotification({
          recipient,
          type: "course",
          title: isLive
            ? "Your Live Class Is Now Live"
            : "New Live Class Scheduled",
          message: isLive
            ? `${courseTitle}: "${liveClass.title}" is live now. Join your classroom.`
            : `${courseTitle}: "${liveClass.title}" is scheduled for ${scheduledAt}. Duration: ${liveClass.durationMinutes} minutes. You'll get another notification when it goes live.`,
          referenceId: liveClass._id,
          referenceModel: "LiveClass",
          link: isLive
            ? `/student/live-class/${liveClass._id}`
            : `/student/learn/${courseId}`,
        })
      )
    );

    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `LIVE CLASS NOTIFICATIONS: ${isLive ? "LIVE" : "SCHEDULED"}; recipients=${students.length}; failed=${failed}`
    );
  } catch (error) {
    // Notification failure should not undo a successfully scheduled or started class.
    console.error("LIVE CLASS NOTIFICATION ERROR:", error.message);
  }
};

export const createLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description = "", scheduledAt, durationMinutes = 60 } =
      req.body || {};

    if (!validId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID.",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      isDeleted: { $ne: true },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (!canManageCourse(req, course)) {
      return res.status(403).json({
        success: false,
        message: "You cannot schedule live classes for this course.",
      });
    }

    const start = new Date(scheduledAt);
    const duration = Number(durationMinutes);

    if (
      !String(title || "").trim() ||
      String(title).trim().length > 160 ||
      !scheduledAt ||
      Number.isNaN(start.getTime()) ||
      !Number.isInteger(duration) ||
      duration < 5 ||
      duration > 480
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a title, valid date/time, and duration between 5 and 480 minutes.",
      });
    }

    const liveClass = await LiveClass.create({
      course: course._id,
      title: String(title).trim(),
      description: String(description).trim().slice(0, 2000),
      scheduledAt: start,
      durationMinutes: duration,
      status: "scheduled",
      roomName: `sv-${String(course._id)}-${new mongoose.Types.ObjectId()}`,
      createdBy: userIdOf(req),
    });

    await notifyEnrolledStudentsAboutLiveClass({
      courseId: course._id,
      liveClass,
      courseTitle: course.title || course.name || "Your course",
      isLive: false,
    });

    return res.status(201).json({
      success: true,
      message: "Live class scheduled.",
      liveClass: publicClass(liveClass),
    });
  } catch (error) {
    console.error("CREATE LIVE CLASS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to schedule live class.",
    });
  }
};

export const startLiveClass = async (req, res) => {
  try {
    const context = await requireStaffContext(req, res, req.params.id);
    if (!context) return;

    if (context.liveClass.status === "ended") {
      return res.status(409).json({
        success: false,
        message: "This class has ended. Schedule a new class to teach again.",
      });
    }

    if (context.liveClass.status !== "live") {
      context.liveClass.status = "live";
      context.liveClass.startedAt = new Date();
      context.liveClass.endedAt = null;
      await context.liveClass.save();

      await notifyEnrolledStudentsAboutLiveClass({
        courseId: context.course._id,
        liveClass: context.liveClass,
        courseTitle:
          context.course.title || context.course.name || "Your course",
        isLive: true,
      });
    }

    return res.json({
      success: true,
      message: "Live class started. You can enter the classroom.",
      liveClass: publicClass(context.liveClass),
    });
  } catch (error) {
    console.error("START LIVE CLASS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to start live class.",
    });
  }
};

export const endLiveClass = async (req, res) => {
  try {
    const context = await requireStaffContext(req, res, req.params.id);
    if (!context) return;

    context.liveClass.status = "ended";
    const classEndedAt = new Date();
    context.liveClass.endedAt = classEndedAt;

    // Ending a room closes every active attendance session.
    for (const session of context.liveClass.attendance || []) {
      if (!session.leftAt) {
        session.leftAt = classEndedAt;
        session.durationSeconds = Math.max(
          0,
          Math.floor(
            (classEndedAt.getTime() - new Date(session.joinedAt).getTime()) / 1000
          )
        );
      }
    }

    if (context.liveClass.activeQuiz?.status === "active") {
      context.liveClass.activeQuiz.status = "closed";
      context.liveClass.activeQuiz.closedAt = new Date();
    }

    await context.liveClass.save();

    // Best effort: closing a class also disconnects participants in LiveKit.
    if (requireLiveKitConfig()) {
      try {
        const roomService = new RoomServiceClient(
          process.env.LIVEKIT_URL
            .replace(/^wss:/i, "https:")
            .replace(/^ws:/i, "http:"),
          process.env.LIVEKIT_API_KEY,
          process.env.LIVEKIT_API_SECRET
        );
        await roomService.deleteRoom(context.liveClass.roomName);
      } catch (roomError) {
        console.warn("LIVEKIT ROOM CLOSE WARNING:", roomError.message);
      }
    }

    return res.json({
      success: true,
      message: "Live class ended.",
      liveClass: publicClass(context.liveClass),
    });
  } catch (error) {
    console.error("END LIVE CLASS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to end live class.",
    });
  }
};

export const recordLiveClassJoin = async (req, res) => {
  try {
    const context = await requireClassAccess(req, res, req.params.id);
    if (!context) return;

    if (roleOf(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can record class attendance.",
      });
    }

    const { liveClass } = context;
    if (liveClass.status !== "live") {
      return res.status(409).json({
        success: false,
        message: "Attendance can only be recorded for a live class.",
      });
    }

    const studentId = userIdOf(req);
    const activeSession = (liveClass.attendance || []).find(
      (session) =>
        String(session.student) === studentId && !session.leftAt
    );

    if (activeSession) {
      return res.json({
        success: true,
        message: "Attendance session already active.",
      });
    }

    liveClass.attendance.push({
      student: studentId,
      joinedAt: new Date(),
      leftAt: null,
      durationSeconds: 0,
    });
    await liveClass.save();

    return res.status(201).json({
      success: true,
      message: "Class attendance recorded.",
    });
  } catch (error) {
    console.error("LIVE CLASS ATTENDANCE JOIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to record class attendance.",
    });
  }
};

export const recordLiveClassLeave = async (req, res) => {
  try {
    const context = await requireClassAccess(req, res, req.params.id);
    if (!context) return;

    if (roleOf(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can record class attendance.",
      });
    }

    const { liveClass } = context;
    const studentId = userIdOf(req);
    const activeSession = [...(liveClass.attendance || [])]
      .reverse()
      .find(
        (session) =>
          String(session.student) === studentId && !session.leftAt
      );

    if (!activeSession) {
      return res.json({
        success: true,
        message: "No active attendance session.",
      });
    }

    const leftAt = new Date();
    activeSession.leftAt = leftAt;
    activeSession.durationSeconds = Math.max(
      0,
      Math.floor(
        (leftAt.getTime() - new Date(activeSession.joinedAt).getTime()) / 1000
      )
    );
    await liveClass.save();

    return res.json({
      success: true,
      message: "Class attendance updated.",
    });
  } catch (error) {
    console.error("LIVE CLASS ATTENDANCE LEAVE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update class attendance.",
    });
  }
};

export const getLiveClassToken = async (req, res) => {
  try {
    const context = await requireClassAccess(req, res, req.params.id);
    if (!context) return;

    const { liveClass, course } = context;

    if (liveClass.status !== "live") {
      return res.status(409).json({
        success: false,
        message: "This class is not live yet or has already ended.",
      });
    }

    if (!requireLiveKitConfig()) {
      return res.status(503).json({
        success: false,
        message: "Live classroom is not configured on the server.",
      });
    }

    const role = roleOf(req);
    const isInstructor = canManageCourse(req, course, liveClass);
    const uid = userIdOf(req);

    const accessToken = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: uid,
        name: String(req.user?.name || "SkilVira participant").slice(0, 100),
        ttl: "2h",
        metadata: JSON.stringify({
          role,
          instructor: isInstructor,
          courseId: String(course._id),
        }),
      }
    );

    accessToken.addGrant({
      roomJoin: true,
      room: liveClass.roomName,
      canPublish: isInstructor,
      canSubscribe: true,
      canPublishData: true,
    });

    return res.json({
      success: true,
      token: await accessToken.toJwt(),
      serverUrl: process.env.LIVEKIT_URL,
      isInstructor,
      liveClass: publicClass(liveClass),
    });
  } catch (error) {
    console.error("LIVE CLASS TOKEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to join live class.",
    });
  }
};

export const getLiveQuiz = async (req, res) => {
  try {
    const context = await requireClassAccess(req, res, req.params.id);
    if (!context) return;

    const { liveClass } = context;
    const isInstructor = canManageCourse(
      req,
      context.course,
      liveClass
    );

    if (liveClass.status !== "live") {
      return res.status(409).json({
        success: false,
        message: "Live quiz is available only during a live class.",
      });
    }

    const quiz = liveClass.activeQuiz;
    if (!quiz) {
      return res.json({ success: true, quiz: null });
    }

    const answers = quiz.answers || [];
    const userAnswer = answers.find(
      (answer) => String(answer.student) === userIdOf(req)
    );

    const includeResults = isInstructor || quiz.status === "closed";

    return res.json({
      success: true,
      quiz: {
        _id: String(quiz._id),
        question: quiz.question,
        options: quiz.options,
        status: quiz.status,
        createdAt: quiz.createdAt,
        hasAnswered: Boolean(userAnswer),
        userAnswerIndex: userAnswer?.optionIndex ?? null,
        userAnswerCorrect:
          quiz.status === "closed" ? userAnswer?.isCorrect ?? null : null,
        ...(includeResults
          ? {
              correctOptionIndex: quiz.correctOptionIndex,
              counts: quiz.options.map((_, index) =>
                answers.filter((answer) => answer.optionIndex === index).length
              ),
              totalResponses: answers.length,
            }
          : {}),
      },
    });
  } catch (error) {
    console.error("GET LIVE QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load live quiz.",
    });
  }
};

export const createLiveQuiz = async (req, res) => {
  try {
    const context = await requireStaffContext(req, res, req.params.id);
    if (!context) return;

    const { liveClass } = context;
    if (liveClass.status !== "live") {
      return res.status(409).json({
        success: false,
        message: "Start the live class before launching a quiz.",
      });
    }

    const { question, options, correctOptionIndex } = req.body || {};
    const normalizedOptions = Array.isArray(options)
      ? options.map((option) => String(option || "").trim())
      : [];
    const correct = Number(correctOptionIndex);

    if (
      !String(question || "").trim() ||
      String(question).trim().length > 1000 ||
      normalizedOptions.length < 2 ||
      normalizedOptions.length > 6 ||
      normalizedOptions.some((option) => !option || option.length > 300) ||
      !Number.isInteger(correct) ||
      correct < 0 ||
      correct >= normalizedOptions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a question, 2–6 options, and a valid correct answer.",
      });
    }

    liveClass.activeQuiz = {
      question: String(question).trim(),
      options: normalizedOptions,
      correctOptionIndex: correct,
      status: "active",
      answers: [],
      createdAt: new Date(),
      closedAt: null,
    };

    await liveClass.save();

    return res.status(201).json({
      success: true,
      message: "Live quiz launched.",
    });
  } catch (error) {
    console.error("CREATE LIVE QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to launch live quiz.",
    });
  }
};

export const submitLiveQuizAnswer = async (req, res) => {
  try {
    const context = await requireClassAccess(req, res, req.params.id);
    if (!context) return;

    const { liveClass } = context;

    if (roleOf(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only enrolled students can answer the live quiz.",
      });
    }

    if (liveClass.status !== "live" || !liveClass.activeQuiz) {
      return res.status(409).json({
        success: false,
        message: "There is no live quiz to answer.",
      });
    }

    const quiz = liveClass.activeQuiz;
    if (quiz.status !== "active") {
      return res.status(409).json({
        success: false,
        message: "This live quiz has closed.",
      });
    }

    const optionIndex = Number(req.body?.optionIndex);
    if (
      !Number.isInteger(optionIndex) ||
      optionIndex < 0 ||
      optionIndex >= quiz.options.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid option.",
      });
    }

    const uid = userIdOf(req);
    if ((quiz.answers || []).some(
      (answer) => String(answer.student) === uid
    )) {
      return res.status(409).json({
        success: false,
        message: "Your answer has already been submitted.",
      });
    }

    quiz.answers.push({
      student: uid,
      optionIndex,
      isCorrect: optionIndex === quiz.correctOptionIndex,
      answeredAt: new Date(),
    });

    await liveClass.save();

    return res.json({
      success: true,
      message: "Answer submitted.",
    });
  } catch (error) {
    console.error("SUBMIT LIVE QUIZ ANSWER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit live quiz answer.",
    });
  }
};

export const closeLiveQuiz = async (req, res) => {
  try {
    const context = await requireStaffContext(req, res, req.params.id);
    if (!context) return;

    if (!context.liveClass.activeQuiz) {
      return res.status(404).json({
        success: false,
        message: "No live quiz exists.",
      });
    }

    context.liveClass.activeQuiz.status = "closed";
    context.liveClass.activeQuiz.closedAt = new Date();
    await context.liveClass.save();

    return res.json({
      success: true,
      message: "Live quiz closed. Results are now visible.",
    });
  } catch (error) {
    console.error("CLOSE LIVE QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to close live quiz.",
    });
  }
};
