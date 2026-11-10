import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import { createNotification } from "../services/notificationService.js";

const STAFF_ROLES = ["employee", "control", "admin", "superadmin"];

const isStaff = (req) =>
  STAFF_ROLES.includes(String(req.user?.role || "").toLowerCase());

const cleanValue = (value) =>
  String(value ?? "").trim().toLowerCase();

const sameAnswers = (actual, expected) => {
  const a = actual.map(cleanValue).filter(Boolean).sort();
  const e = expected.map(cleanValue).filter(Boolean).sort();
  return a.length === e.length && a.every((value, i) => value === e[i]);
};


const notifyEnrolledStudentsAboutContent = async ({
  courseId,
  contentTitle,
  contentType,
}) => {
  try {
    const students = await Enrollment.distinct("student", {
      course: courseId,
      status: { $in: ["Active", "Completed"] },
      isDeleted: { $ne: true },
    });

    const results = await Promise.allSettled(
      students.map((recipient) =>
        createNotification({
          recipient,
          type: "course",
          title: "New course content available",
          message: `${contentType}: "${contentTitle}" is available in your enrolled course.`,
          referenceId: courseId,
          referenceModel: "Course",
          link: `/student/learn/${courseId}`,
        })
      )
    );

    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    if (failed) {
      console.error(
        `COURSE CONTENT NOTIFICATIONS: failed=${failed}, total=${students.length}`
      );
    }
  } catch (error) {
    // Notification errors must not undo successful content creation.
    console.error("COURSE CONTENT NOTIFICATION ERROR:", error.message);
  }
};

export const createLesson = async (req, res) => {
  try {
    const { title, course, notesUrl } = req.body || {};

    if (!String(title || "").trim() || !course) {
      return res.status(400).json({
        success: false,
        message: "Lesson title and course are required.",
      });
    }

    if (!String(notesUrl || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Notes are required. Please provide the notes link.",
      });
    }

    const lesson = await Lesson.create({
      ...req.body,
      title: String(title).trim(),
      notesUrl: String(notesUrl).trim(),
      videoUrl: String(req.body.videoUrl || "").trim(),
      course,
      createdBy: req.user?._id || req.user?.id || req.user?.userId || null,
    });

    if (lesson.isPublished !== false) {
      await notifyEnrolledStudentsAboutContent({
        courseId: lesson.course,
        contentTitle: lesson.title,
        contentType: "New lesson",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully.",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create lesson.",
    });
  }
};

export const getCourseLessons = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    const staff = isStaff(req);
    const courseId = req.params.courseId;
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!staff && role !== "student") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access course lessons.",
      });
    }

    if (role === "student") {
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Please log in to access course lessons.",
        });
      }

      const enrollment = await Enrollment.findOne({
        student: userId,
        course: courseId,
        status: { $in: ["Active", "Completed"] },
        isDeleted: { $ne: true },
      }).select("_id");

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: "An active course enrollment is required.",
        });
      }
    }

    const lessons = await Lesson.find({
      course: courseId,
      isPublished: true,
    }).sort({ order: 1 }).lean();

    const safeLessons = lessons.map((lesson) => {
      lesson.assessments = (lesson.assessments || [])
        .filter((assessment) => staff || assessment.isPublished)
        .map((assessment) => {
          if (!staff) {
            const ownAttempts = (assessment.attempts || [])
              .filter((attempt) => String(attempt.user) === String(userId))
              .sort((a, b) =>
                new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
              );

            assessment.studentAttemptCount = ownAttempts.length;
            assessment.studentAttempts = ownAttempts.map((attempt) => ({
              status: attempt.status,
              submittedAt: attempt.submittedAt,
              score: attempt.score,
              maxMarks: attempt.maxMarks,
              feedback: attempt.feedback,
            }));

            delete assessment.attempts;
            assessment.questions = (assessment.questions || []).map((question) => {
              delete question.correctAnswers;
              return question;
            });
          }
          return assessment;
        });
      return lesson;
    });

    return res.json({ success: true, lessons: safeLessons });
  } catch (error) {
    console.error("GET COURSE LESSONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load course lessons.",
    });
  }
};


export const createAssessment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const {
      title, type, description, durationMinutes,
      negativeMarking, maxAttempts, totalMarks, questions
    } = req.body || {};

    if (!title?.trim() || !["assignment", "quiz", "test", "dpp"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Assessment title and a valid type are required.",
      });
    }

    const questionList = Array.isArray(questions) ? questions : [];
    if (type !== "assignment" && questionList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz and test require at least one question.",
      });
    }

    const allowedTypes = ["mcq", "multiple_select", "fill_blank"];
    const cleanedQuestions = [];

    for (const q of questionList) {
      const prompt = String(q?.prompt || "").trim();
      const questionType = String(q?.type || "");
      const options = Array.isArray(q?.options)
        ? q.options.map((v) => String(v).trim()).filter(Boolean)
        : [];
      const correctAnswers = Array.isArray(q?.correctAnswers)
        ? q.correctAnswers.map((v) => String(v).trim()).filter(Boolean)
        : [];
      const marks = Number(q?.marks);

      if (!prompt || !allowedTypes.includes(questionType) ||
          !Number.isFinite(marks) || marks <= 0 || correctAnswers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Each question needs text, type, correct answer and positive marks.",
        });
      }

      if ((questionType === "mcq" && (options.length < 2 || correctAnswers.length !== 1)) ||
          (questionType === "multiple_select" && options.length < 2) ||
          (questionType !== "fill_blank" &&
            correctAnswers.some((answer) => !options.includes(answer)))) {
        return res.status(400).json({
          success: false,
          message: "Check question options and answer key.",
        });
      }

      cleanedQuestions.push({ prompt, type: questionType, options, correctAnswers, marks });
    }

    const calculatedMarks = cleanedQuestions.reduce((sum, q) => sum + q.marks, 0);
    const finalMarks = type === "assignment" ? Number(totalMarks) : calculatedMarks;

    if (!Number.isFinite(finalMarks) || finalMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total marks must be greater than zero.",
      });
    }

    if (type !== "assignment" && totalMarks != null &&
        Number(totalMarks) !== calculatedMarks) {
      return res.status(400).json({
        success: false,
        message: `Total marks must equal the sum of question marks (${calculatedMarks}).`,
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found." });
    }

    lesson.assessments.push({
      title: title.trim(),
      type,
      description: String(description || "").trim(),
      durationMinutes: Math.max(0, Number(durationMinutes) || 0),
      negativeMarking: Math.max(0, Number(negativeMarking) || 0),
      maxAttempts: Math.max(1, Number(maxAttempts) || 1),
      totalMarks: finalMarks,
      questions: cleanedQuestions,
      isPublished: true,
    });

    const assessment = lesson.assessments[lesson.assessments.length - 1];
    await lesson.save();

    if (assessment.isPublished !== false) {
      await notifyEnrolledStudentsAboutContent({
        courseId: lesson.course,
        contentTitle: assessment.title,
        contentType: assessment.type,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Assessment created successfully.",
      assessment,
    });
  } catch (error) {
    console.error("CREATE ASSESSMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create assessment.",
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    if (String(req.user?.role || "").toLowerCase() !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only student accounts can submit assessments.",
      });
    }

    const lesson = await Lesson.findById(req.params.lessonId);
    const assessment = lesson?.assessments?.id(req.params.assessmentId);

    if (!lesson || !assessment || !assessment.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Published assessment not found.",
      });
    }

    const userId = String(req.user.id || req.user._id);
    const previousAttempts = assessment.attempts.filter(
      (attempt) => String(attempt.user) === userId
    );

    if (previousAttempts.length >= assessment.maxAttempts) {
      return res.status(409).json({
        success: false,
        message: "You have reached the attempt limit for this assessment.",
      });
    }

    if (assessment.type === "assignment") {
      const submissionText = String(req.body?.submissionText || "").trim();
      if (!submissionText) {
        return res.status(400).json({
          success: false,
          message: "Please enter your assignment submission.",
        });
      }

      assessment.attempts.push({
        user: userId,
        submissionText,
        score: null,
        maxMarks: assessment.totalMarks,
        status: "pending_grade",
      });
      await lesson.save();

      const attempt = assessment.attempts[assessment.attempts.length - 1];
      return res.status(201).json({
        success: true,
        message: "Assignment submitted for grading.",
        attemptCount: previousAttempts.length + 1,
        attempt: {
          status: attempt.status,
          submittedAt: attempt.submittedAt,
          score: attempt.score,
          maxMarks: attempt.maxMarks,
          feedback: attempt.feedback,
        },
        result: {
          attemptId: attempt._id,
          status: attempt.status,
          submittedAt: attempt.submittedAt,
          maxMarks: attempt.maxMarks,
        },
      });
    }

    const input = req.body?.answers || {};
    const savedAnswers = [];
    let score = 0;

    for (const question of assessment.questions) {
      let values = input[String(question._id)] ?? [];
      if (!Array.isArray(values)) values = [values];
      values = values.map((value) => String(value).trim()).filter(Boolean);

      savedAnswers.push({ questionId: question._id, values });
      if (sameAnswers(values, question.correctAnswers)) {
        score += question.marks;
      } else {
        score -= assessment.negativeMarking;
      }
    }

    score = Math.max(0, Math.min(assessment.totalMarks, score));
    assessment.attempts.push({
      user: userId,
      answers: savedAnswers,
      score,
      maxMarks: assessment.totalMarks,
      status: "graded",
    });
    await lesson.save();
    const savedAttempt = assessment.attempts[assessment.attempts.length - 1];

    return res.status(201).json({
      success: true,
      message: "Assessment submitted.",
      attemptCount: previousAttempts.length + 1,
      attempt: {
        status: savedAttempt.status,
        submittedAt: savedAttempt.submittedAt,
        score: savedAttempt.score,
        maxMarks: savedAttempt.maxMarks,
      },
      result: {
        score,
        totalMarks: assessment.totalMarks,
        maxMarks: assessment.totalMarks,
        status: "graded",
        submittedAt: savedAttempt.submittedAt,
      },
    });
  } catch (error) {
    console.error("SUBMIT ASSESSMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit assessment.",
    });
  }
};

export const gradeAssignment = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    const assessment = lesson?.assessments?.id(req.params.assessmentId);
    const attempt = assessment?.attempts?.id(req.params.attemptId);

    if (!lesson || !assessment || !attempt || assessment.type !== "assignment") {
      return res.status(404).json({
        success: false,
        message: "Assignment submission not found.",
      });
    }

    const score = Number(req.body?.score);
    if (!Number.isFinite(score) || score < 0 || score > assessment.totalMarks) {
      return res.status(400).json({
        success: false,
        message: `Score must be between 0 and ${assessment.totalMarks}.`,
      });
    }

    attempt.score = score;
    attempt.feedback = String(req.body?.feedback || "").trim();
    attempt.status = "graded";
    await lesson.save();

    return res.json({
      success: true,
      message: "Assignment graded successfully.",
      result: {
        attemptId: attempt._id,
        score: attempt.score,
        totalMarks: assessment.totalMarks,
        feedback: attempt.feedback,
        status: attempt.status,
      },
    });
  } catch (error) {
    console.error("GRADE ASSIGNMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to grade assignment.",
    });
  }
};
