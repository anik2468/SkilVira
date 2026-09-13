import OfferLetterTemplate from "../models/OfferLetterTemplate.js";
import GeneratedOfferLetter from "../models/GeneratedOfferLetter.js";


// =====================================================
// FIND BEST OFFER LETTER TEMPLATE
// =====================================================

export const findOfferLetterTemplate = async ({
  courseId,
  internshipId,
}) => {

  // -----------------------------------------
  // Internship-specific template
  // -----------------------------------------

  if (internshipId) {

    const internshipTemplate =
      await OfferLetterTemplate.findOne({
        internshipId,
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    if (internshipTemplate) {
      return internshipTemplate;
    }
  }


  // -----------------------------------------
  // Course-specific template
  // -----------------------------------------

  if (courseId) {

    const courseTemplate =
      await OfferLetterTemplate.findOne({
        courseId,
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    if (courseTemplate) {
      return courseTemplate;
    }
  }


  // -----------------------------------------
  // Generic internship template
  // -----------------------------------------

  if (internshipId) {

    const genericInternshipTemplate =
      await OfferLetterTemplate.findOne({
        type: "internship",
        isActive: true,
        internshipId: null,
      }).sort({
        createdAt: -1,
      });

    if (genericInternshipTemplate) {
      return genericInternshipTemplate;
    }
  }


  // -----------------------------------------
  // Generic course template
  // -----------------------------------------

  if (courseId) {

    const genericCourseTemplate =
      await OfferLetterTemplate.findOne({
        type: "course",
        isActive: true,
        courseId: null,
      }).sort({
        createdAt: -1,
      });

    if (genericCourseTemplate) {
      return genericCourseTemplate;
    }
  }


  return null;
};



// =====================================================
// CREATE PENDING OFFER LETTER
// CALLED AFTER PAYMENT APPROVAL
// =====================================================

export const createPendingOfferLetter = async ({
  student,
  course = null,
  internship = null,
}) => {

  const courseId =
    course?._id || course || null;

  const internshipId =
    internship?._id || internship || null;


  const template =
    await findOfferLetterTemplate({
      courseId,
      internshipId,
    });


  if (!template) {

    throw new Error(
      "No active offer letter template is assigned to this course or internship."
    );

  }


  // -----------------------------------------
  // Avoid duplicate offer letter
  // -----------------------------------------

  const existing =
    await GeneratedOfferLetter.findOne({

      student,

      course: courseId,

      internship: internshipId,

    });


  if (existing) {
    return existing;
  }


  const offerId =
    `OFF-${Date.now()}`;


  const issueDate =
    new Date()
      .toISOString()
      .split("T")[0];


  // -----------------------------------------
  // Initial Data
  // -----------------------------------------

  const data = {

    studentName:
      "",

    role:
      "",

    companyName:
      "",

    duration:
      "",

    joiningDate:
      issueDate,

    endDate:
      "",

    stipend:
      "",

    location:
      "",

    workMode:
      "",

    offerId,

    issueDate,

    reportingManager:
      "",

  };


  const generatedOfferLetter =
    await GeneratedOfferLetter.create({

      student,

      course: courseId,

      internship: internshipId,

      template:
        template._id,

      data,

      status: "pending",

    });


  return generatedOfferLetter;
};