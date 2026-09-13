import Enrollment from "../models/Enrollment.js";
import LessonProgress from "../models/LessonProgress.js";
import Lesson from "../models/Lesson.js";

import Certificate from "../models/Certificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";

import GeneratedCertificate from "../models/GeneratedCertificate.js";
import GeneratedReport from "../models/GeneratedReport.js";

import ReportTemplate from "../models/ReportTemplate.js";

import User from "../models/User.js";
import Course from "../models/Course.js";
import Internship from "../models/Internship.js";

import {
  generateCertificate,
} from "../services/certificateGenerator.js";

import {
  triggerEnrollmentCompletion,
} from "../services/enrollmentCompletionService.js";


// =====================================================
// HELPER
// =====================================================

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    null
  );
};


// =====================================================
// STUDENT MY COURSES
// =====================================================

export const getMyCourses = async (req, res) => {
  try {
    const studentId =
      req.params.studentId ||
      getUserId(req);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    const enrollments =
      await Enrollment.find({
        student: studentId,
        isDeleted: false,
      })
        .populate("course")
        .populate("internship")
        .populate("offerLetter")
        .populate("certificate")
        .populate("report")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      enrollments,
    });

  } catch (error) {

    console.error(
      "GET MY COURSES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// COMPLETE LESSON
// =====================================================

export const completeLesson = async (req, res) => {
  try {
    const {
      student,
      course,
      lesson,
    } = req.body;

    if (!student || !course || !lesson) {
      return res.status(400).json({
        success: false,
        message:
          "Student, course and lesson are required.",
      });
    }


    // =================================================
    // FIND / CREATE LESSON PROGRESS
    // =================================================

    let progress =
      await LessonProgress.findOne({
        student,
        course,
        lesson,
      });


    if (progress) {

      progress.completed = true;

      progress.completedAt =
        new Date();

      await progress.save();

    } else {

      progress =
        await LessonProgress.create({
          student,
          course,
          lesson,
          completed: true,
          completedAt: new Date(),
        });
    }


    // =================================================
    // COURSE LESSON COUNT
    // =================================================

    const totalLessons =
      await Lesson.countDocuments({
        course,
        isPublished: true,
      });


    const completedLessons =
      await LessonProgress.countDocuments({
        student,
        course,
        completed: true,
      });


    const percentage =
      totalLessons === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              (completedLessons /
                totalLessons) *
                100
            )
          );


    // =================================================
    // FIND ENROLLMENT
    // =================================================

    let enrollment =
      await Enrollment.findOne({
        student,
        course,
        isDeleted: false,
      });


    if (!enrollment) {

      return res.status(404).json({
        success: false,
        message:
          "Course enrollment not found.",
      });
    }


    // =================================================
    // UPDATE PROGRESS
    // =================================================

    enrollment.progress =
      percentage;


    if (percentage === 100) {

      enrollment.status =
        "Completed";

      enrollment.completionDate =
        enrollment.completionDate ||
        new Date();

    } else {

      enrollment.status =
        "Active";
    }


    await enrollment.save();


    // =================================================
    // COMPLETION AUTOMATION
    // =================================================

    let completionResult =
      null;


    if (
      percentage === 100 &&
      !enrollment.completionTriggered
    ) {

      try {

        completionResult =
          await triggerEnrollmentCompletion(
            enrollment._id
          );

      } catch (completionError) {

        console.error(
          "COMPLETION AUTOMATION ERROR:",
          completionError
        );

        // Main lesson completion should not
        // fail just because certificate/report
        // processing failed.
        completionResult = {
          success: false,
          error:
            completionError.message,
        };
      }
    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        percentage === 100
          ? "Course completed successfully."
          : "Lesson completed.",

      progress: percentage,

      enrollment,

      completion:
        completionResult,
    });

  } catch (error) {

    console.error(
      "COMPLETE LESSON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET COURSE PROGRESS
// =====================================================

export const getCourseProgress = async (
  req,
  res
) => {
  try {

    const {
      studentId,
      courseId,
    } = req.params;


    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID and course ID are required.",
      });
    }


    const completedProgress =
      await LessonProgress.find({
        student: studentId,
        course: courseId,
        completed: true,
      })
        .populate(
          "lesson",
          "title order"
        )
        .sort({
          completedAt: 1,
        });


    const totalLessons =
      await Lesson.countDocuments({
        course: courseId,
        isPublished: true,
      });


    const completedLessons =
      completedProgress.length;


    const percentage =
      totalLessons === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              (completedLessons /
                totalLessons) *
                100
            )
          );


    const enrollment =
      await Enrollment.findOne({
        student: studentId,
        course: courseId,
        isDeleted: false,
      })
        .populate("course")
        .populate("certificate")
        .populate("report")
        .populate("offerLetter");


    return res.status(200).json({
      success: true,

      totalLessons,

      completedLessons,

      progress: percentage,

      completedLessonList:
        completedProgress,

      enrollment,
    });

  } catch (error) {

    console.error(
      "GET COURSE PROGRESS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// MANUALLY MARK ENROLLMENT COMPLETED
// Useful for employee/control
// =====================================================

export const completeEnrollment = async (
  req,
  res
) => {
  try {

    const enrollment =
      await Enrollment.findOne({
        _id: req.params.id,
        isDeleted: false,
      });


    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message:
          "Enrollment not found.",
      });
    }


    enrollment.progress =
      100;

    enrollment.status =
      "Completed";

    enrollment.completionDate =
      enrollment.completionDate ||
      new Date();


    await enrollment.save();


    const result =
      await triggerEnrollmentCompletion(
        enrollment._id
      );


    return res.status(200).json({

      success: true,

      message:
        "Enrollment completed and certificate/report processing started.",

      result,

    });

  } catch (error) {

    console.error(
      "COMPLETE ENROLLMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET SINGLE ENROLLMENT
// =====================================================

export const getEnrollmentById = async (
  req,
  res
) => {
  try {

    const enrollment =
      await Enrollment.findOne({
        _id: req.params.id,
        isDeleted: false,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course"
        )
        .populate(
          "internship"
        )
        .populate(
          "offerLetter"
        )
        .populate(
          "certificate"
        )
        .populate(
          "report"
        );


    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message:
          "Enrollment not found.",
      });
    }


    return res.status(200).json({
      success: true,
      enrollment,
    });

  } catch (error) {

    console.error(
      "GET ENROLLMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};