import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";

import LessonProgress from "../models/LessonProgress.js";

import Lesson from "../models/Lesson.js";

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
// ENROLL STUDENT IN A FREE COURSE
// =====================================================

export const enrollInFreeCourse = async (req, res) => {
  let payment = null;

  try {
    const studentId = getUserId(req);
    const courseId = req.params.courseId;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to enroll.",
      });
    }

    if (String(req.user?.role || "").toLowerCase() !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only student accounts can enroll in courses.",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      status: "active",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unavailable.",
      });
    }

    if (Number(course.price) > 0) {
      return res.status(400).json({
        success: false,
        message: "This is a paid course. Complete its payment to enroll.",
      });
    }

    if (course.registrationDeadline) {
      const deadline = new Date(course.registrationDeadline);
      deadline.setUTCHours(23, 59, 59, 999);

      if (deadline.getTime() < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "Registration for this course has closed.",
        });
      }
    }

    const existing = await Enrollment.findOne({
      student: studentId,
      course: course._id,
      isDeleted: { $ne: true },
      status: { $in: ["Active", "Completed"] },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You are already enrolled in this course.",
        enrollment: existing,
      });
    }

    payment = await Payment.create({
      student: studentId,
      type: "course",
      course: course._id,
      originalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      status: "approved",
      paymentMethod: "other",
      paymentNote: "Free course enrollment",
    });

    let enrollment;
    try {
      enrollment = await Enrollment.create({
        student: studentId,
        course: course._id,
        payment: payment._id,
        startDate: course.startDate || null,
        status: "Active",
      });
    } catch (error) {
      await Payment.findByIdAndDelete(payment._id).catch(() => {});
      payment = null;
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in the free course.",
      enrollment,
    });
  } catch (error) {
    console.error("FREE COURSE ENROLLMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to enroll right now. Please try again.",
    });
  }
};

// =====================================================
// STUDENT MY COURSES
// =====================================================

export const getMyCourses = async (
  req,
  res
) => {
  try {
    const studentId =
      req.params.studentId ||
      getUserId(req);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID is required.",
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

export const completeLesson = async (
  req,
  res
) => {
  try {
    const {
      student: bodyStudent,
      course,
      lesson,
    } = req.body;

    const student =
      getUserId(req) ||
      bodyStudent;

    if (
      !student ||
      !course ||
      !lesson
    ) {
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
          completedAt:
            new Date(),
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

    const enrollment =
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
    // ONLY ACTIVE / COMPLETED ENROLLMENTS CAN PROGRESS
    // =================================================

    if (
      enrollment.status !== "Active" &&
      enrollment.status !== "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This enrollment is not active.",
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
    //
    // Certificate / Report generation starts
    // ONLY after 100% completion.
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

      progress:
        percentage,

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

export const getCourseProgress =
  async (
    req,
    res
  ) => {

    try {

      const {
        studentId,
        courseId,
      } = req.params;


      if (
        !studentId ||
        !courseId
      ) {

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

        progress:
          percentage,

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

export const completeEnrollment =
  async (
    req,
    res
  ) => {

    try {

      const enrollment =
        await Enrollment.findOne({
          _id:
            req.params.id,

          isDeleted:
            false,
        });


      if (!enrollment) {

        return res.status(404).json({
          success: false,
          message:
            "Enrollment not found.",
        });
      }


      // =================================================
      // ALREADY COMPLETED AND PROCESSED
      // =================================================

      if (
        enrollment.status ===
          "Completed" &&
        enrollment.completionTriggered
      ) {

        return res.status(200).json({
          success: true,
          message:
            "Enrollment is already completed and processed.",
          enrollment,
        });
      }


      // =================================================
      // MARK COMPLETED
      // =================================================

      enrollment.progress =
        100;

      enrollment.status =
        "Completed";

      enrollment.completionDate =
        enrollment.completionDate ||
        new Date();


      await enrollment.save();


      // =================================================
      // COMPLETION AUTOMATION
      // =================================================

      let result =
        null;


      if (
        !enrollment.completionTriggered
      ) {

        result =
          await triggerEnrollmentCompletion(
            enrollment._id
          );
      }


      return res.status(200).json({

        success: true,

        message:
          result?.completionTriggered
            ? "Enrollment completed and certificate/report processing started."
            : "Enrollment completed. Certificate/report generation is pending template availability or processing.",

        enrollment,

        result,
      });

    } catch (error) {

      console.error(
        "COMPLETE ENROLLMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// =====================================================
// GET SINGLE ENROLLMENT
// =====================================================

export const getEnrollmentById =
  async (
    req,
    res
  ) => {

    try {

      const enrollment =
        await Enrollment.findOne({
          _id:
            req.params.id,

          isDeleted:
            false,
        })
          .populate(
            "student",
            "name email"
          )
          .populate("course")
          .populate("internship")
          .populate("offerLetter")
          .populate("certificate")
          .populate("report");


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
        message:
          error.message,
      });
    }
  };