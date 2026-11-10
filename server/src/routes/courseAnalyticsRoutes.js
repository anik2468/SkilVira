import express from "express";
import auth from "../middleware/auth.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import LessonProgress from "../models/LessonProgress.js";
import LiveClass from "../models/LiveClass.js";

const router = express.Router();
const STAFF_ROLES = ["employee", "control", "admin", "superadmin"];
const idOf = (value) => {
  if (value == null) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
};
const labelOf = (value) => {
  if (!value || typeof value !== "object") return "Not assigned";
  const full = [value.firstName, value.lastName].filter(Boolean).join(" ");
  return value.name || value.fullName || full || value.email || "Not assigned";
};
const statusOf = (value) => String(value || "unknown").toLowerCase();

router.get("/", auth, async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    if (!STAFF_ROLES.includes(role)) {
      return res.status(403).json({ success: false, message: "Staff access only." });
    }

    const staffId = idOf(req.user?._id || req.user?.id || req.user?.userId);
    if (role === "employee" && !staffId) {
      return res.status(401).json({ success: false, message: "Unable to identify the employee account." });
    }

    let [courseDocs, lessonDocs, liveDocs] = await Promise.all([
      Course.find().select("title description category level duration thumbnail createdBy")
        .populate("createdBy", "name fullName firstName lastName email role").lean(),
      Lesson.find().select("course title order isPublished createdBy assessments")
        .populate("createdBy", "name fullName firstName lastName email role").lean(),
      LiveClass.find().select("course title description status scheduledAt startedAt endedAt duration createdBy attendance")
        .populate("createdBy", "name fullName firstName lastName email role")
        .populate("attendance.student", "name fullName firstName lastName email")
        .lean(),
    ]);

    // Employee reports are restricted to courses they created, lessons they authored,
    // or live classes they host. Control/admin roles can review every course.
    if (role === "employee") {
      const visibleCourseIds = new Set();
      courseDocs.forEach((course) => {
        if (idOf(course.createdBy) === staffId) visibleCourseIds.add(idOf(course._id));
      });
      lessonDocs.forEach((lesson) => {
        if (idOf(lesson.createdBy) === staffId && idOf(lesson.course)) visibleCourseIds.add(idOf(lesson.course));
      });
      liveDocs.forEach((liveClass) => {
        if (idOf(liveClass.createdBy) === staffId && idOf(liveClass.course)) visibleCourseIds.add(idOf(liveClass.course));
      });
      courseDocs = courseDocs.filter((course) => visibleCourseIds.has(idOf(course._id)));
    }

    const courseIds = courseDocs.map((course) => course._id);
    const allowedIds = new Set(courseIds.map(idOf));
    lessonDocs = lessonDocs.filter((lesson) => allowedIds.has(idOf(lesson.course)));
    liveDocs = liveDocs.filter((liveClass) => allowedIds.has(idOf(liveClass.course)));

    const [enrollments, progressDocs] = courseIds.length ? await Promise.all([
      Enrollment.find({ course: { $in: courseIds }, isDeleted: { $ne: true } })
        .select("student course status enrollmentDate progress payment")
        .populate("student", "name fullName firstName lastName email")
        .sort({ enrollmentDate: -1 }).lean(),
      LessonProgress.find({ course: { $in: courseIds } })
        .select("student course lesson completed completedAt")
        .populate("student", "name fullName firstName lastName email")
        .populate("lesson", "title order").lean(),
    ]) : [[], []];

    const lessonsByCourse = new Map();
    lessonDocs.forEach((lesson) => {
      const key = idOf(lesson.course);
      if (!lessonsByCourse.has(key)) lessonsByCourse.set(key, []);
      lessonsByCourse.get(key).push(lesson);
    });
    const liveByCourse = new Map();
    liveDocs.forEach((liveClass) => {
      const key = idOf(liveClass.course);
      if (!liveByCourse.has(key)) liveByCourse.set(key, []);
      liveByCourse.get(key).push(liveClass);
    });
    const enrollmentsByCourse = new Map();
    enrollments.forEach((enrollment) => {
      const key = idOf(enrollment.course);
      if (!enrollmentsByCourse.has(key)) enrollmentsByCourse.set(key, []);
      enrollmentsByCourse.get(key).push(enrollment);
    });
    const progressByStudentCourse = new Map();
    progressDocs.forEach((item) => {
      const key = `${idOf(item.course)}:${idOf(item.student)}`;
      if (!progressByStudentCourse.has(key)) progressByStudentCourse.set(key, []);
      progressByStudentCourse.get(key).push(item);
    });

    // Count assessment attempts without sending questions, expected answers, or answer text to the dashboard.
    const attemptsByStudentCourse = new Map();
    lessonsByCourse.forEach((courseLessons, courseId) => {
      courseLessons.forEach((lesson) => {
        (lesson.assessments || []).forEach((assessment) => {
          (assessment.attempts || []).forEach((attempt) => {
            const studentId = idOf(attempt.user);
            if (!studentId) return;
            const key = `${courseId}:${studentId}`;
            if (!attemptsByStudentCourse.has(key)) attemptsByStudentCourse.set(key, []);
            attemptsByStudentCourse.get(key).push({ score: attempt.score, maxMarks: attempt.maxMarks, status: attempt.status });
          });
        });
      });
    });

    const courses = courseDocs.map((course) => {
      const courseId = idOf(course._id);
      const courseLessons = lessonsByCourse.get(courseId) || [];
      const publishedLessons = courseLessons.filter((lesson) => lesson.isPublished !== false);
      const courseEnrollments = enrollmentsByCourse.get(courseId) || [];
      const courseLiveClasses = (liveByCourse.get(courseId) || []).slice().sort(
        (a, b) => new Date(b.scheduledAt || 0) - new Date(a.scheduledAt || 0)
      );
      const students = courseEnrollments.map((enrollment) => {
        const studentId = idOf(enrollment.student);
        const progress = progressByStudentCourse.get(`${courseId}:${studentId}`) || [];
        const completedIds = new Set(progress.filter((item) => item.completed).map((item) => idOf(item.lesson)));
        const completedLessons = completedIds.size;
        const totalLessons = publishedLessons.length;
        const attempts = attemptsByStudentCourse.get(`${courseId}:${studentId}`) || [];
        const scores = attempts.map((attempt) => Number(attempt.score)).filter((score) => Number.isFinite(score));
        return {
          id: idOf(enrollment._id),
          studentId,
          name: labelOf(enrollment.student),
          email: enrollment.student?.email || "",
          status: enrollment.status || "Unknown",
          enrollmentDate: enrollment.enrollmentDate || null,
          completedLessons,
          totalLessons,
          progressPercent: totalLessons ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0,
          assessmentAttempts: attempts.length,
          averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
        };
      });
      const statuses = courseLiveClasses.reduce((acc, item) => {
        const s = statusOf(item.status);
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      return {
        id: courseId,
        title: course.title || "Untitled course",
        description: course.description || "",
        category: course.category || "",
        level: course.level || "",
        duration: course.duration || "",
        thumbnail: course.thumbnail || "",
        ownerName: labelOf(course.createdBy),
        ownerEmail: course.createdBy?.email || "",
        enrolledCount: students.length,
        activeCount: students.filter((student) => statusOf(student.status) === "active").length,
        lessonCount: publishedLessons.length,
        students,
        lessons: courseLessons.map((lesson) => ({
          id: idOf(lesson._id),
          title: lesson.title || "Untitled lesson",
          order: lesson.order ?? null,
          published: lesson.isPublished !== false,
          createdBy: labelOf(lesson.createdBy),
          createdByEmail: lesson.createdBy?.email || "",
        })).sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999)),
        liveClasses: courseLiveClasses.map((liveClass) => {
          const attendanceByStudent = new Map();

          for (const session of liveClass.attendance || []) {
            const studentId = idOf(session.student);
            if (!studentId) continue;

            let attendee = attendanceByStudent.get(studentId);
            if (!attendee) {
              attendee = {
                id: studentId,
                name: labelOf(session.student),
                email: session.student?.email || "",
                sessions: 0,
                durationSeconds: 0,
                currentlyPresent: false,
              };
              attendanceByStudent.set(studentId, attendee);
            }

            attendee.sessions += 1;
            attendee.durationSeconds += Number(session.durationSeconds || 0);

            if (!session.leftAt && session.joinedAt) {
              attendee.currentlyPresent = true;
              attendee.durationSeconds += Math.max(
                0,
                Math.floor((Date.now() - new Date(session.joinedAt).getTime()) / 1000)
              );
            }
          }

          const attendance = Array.from(attendanceByStudent.values()).sort(
            (left, right) => left.name.localeCompare(right.name)
          );

          return {
            id: idOf(liveClass._id),
            title: liveClass.title || "Live class",
            status: liveClass.status || "unknown",
            scheduledAt: liveClass.scheduledAt || null,
            startedAt: liveClass.startedAt || null,
            endedAt: liveClass.endedAt || null,
            duration: liveClass.duration ?? null,
            host: labelOf(liveClass.createdBy),
            hostEmail: liveClass.createdBy?.email || "",
            attendanceCount: attendance.length,
            attendance,
          };
        }),
        liveClassStatusCounts: statuses,
      };
    });

    const flatStudents = courses.flatMap((course) => course.students);
    const summary = {
      courses: courses.length,
      enrollments: flatStudents.length,
      activeEnrollments: flatStudents.filter((student) => statusOf(student.status) === "active").length,
      uniqueStudents: new Set(flatStudents.map((student) => student.studentId).filter(Boolean)).size,
      publishedLessons: courses.reduce((sum, course) => sum + course.lessonCount, 0),
      liveClasses: courses.reduce((sum, course) => sum + course.liveClasses.length, 0),
      liveNow: courses.reduce((sum, course) => sum + course.liveClasses.filter((item) => statusOf(item.status) === "live").length, 0),
    };

    return res.json({ success: true, summary, courses });
  } catch (error) {
    console.error("COURSE ANALYTICS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load course analytics." });
  }
});

export default router;
