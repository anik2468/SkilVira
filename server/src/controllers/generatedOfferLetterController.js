import GeneratedOfferLetter from "../models/GeneratedOfferLetter.js";
import OfferLetterTemplate from "../models/OfferLetterTemplate.js";

import {
  generateOfferLetter,
} from "../services/offerLetterGenerator.js";

import {
  sendOfferLetterEmail,
} from "../services/emailService.js";

import path from "path";


// =====================================================
// CREATE GENERATED OFFER LETTER
// Usually called automatically after payment approval
// =====================================================

export const createGeneratedOfferLetter = async (req, res) => {
  try {

    const {
      student,
      course,
      internship,
      template,
      data = {},
    } = req.body;


    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student is required.",
      });
    }


    if (!template) {
      return res.status(400).json({
        success: false,
        message: "Offer letter template is required.",
      });
    }


    const templateData =
      await OfferLetterTemplate.findById(template);


    if (!templateData) {
      return res.status(404).json({
        success: false,
        message: "Offer letter template not found.",
      });
    }


    if (!templateData.isActive) {
      return res.status(400).json({
        success: false,
        message: "Offer letter template is inactive.",
      });
    }


    const offerId =
      data.offerId ||
      `OFF-${Date.now()}`;


    // Prevent duplicate offer letter
    const existing =
      await GeneratedOfferLetter.findOne({
        student,
        course: course || null,
        internship: internship || null,
      });


    if (existing) {
      return res.status(200).json({
        success: true,
        message:
          "Offer letter already exists for this enrollment.",
        offerLetter: existing,
      });
    }


    const offerLetter =
      await GeneratedOfferLetter.create({

        student,

        course:
          course || null,

        internship:
          internship || null,

        template,

        data: {

          studentName:
            data.studentName || "",

          role:
            data.role || "",

          companyName:
            data.companyName || "",

          duration:
            data.duration || "",

          joiningDate:
            data.joiningDate ||
            new Date().toISOString().split("T")[0],

          endDate:
            data.endDate || "",

          stipend:
            data.stipend || "",

          location:
            data.location || "",

          workMode:
            data.workMode || "",

          offerId,

          issueDate:
            data.issueDate ||
            new Date().toISOString().split("T")[0],

          reportingManager:
            data.reportingManager || "",

        },

        status: "pending",

      });


    const populatedOffer =
      await GeneratedOfferLetter.findById(
        offerLetter._id
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type fields positions templateFile"
        );


    return res.status(201).json({

      success: true,

      message:
        "Offer letter generated and sent for employee review.",

      offerLetter:
        populatedOffer,

    });

  } catch (error) {

    console.error(
      "CREATE GENERATED OFFER LETTER ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to create offer letter.",

      error:
        error.message,

    });

  }
};



// =====================================================
// EMPLOYEE REVIEW QUEUE
// =====================================================

export const getPendingOfferLetters = async (
  req,
  res
) => {

  try {

    const offerLetters =
      await GeneratedOfferLetter.find({

        status: {
          $in: [
            "pending",
            "revision",
          ],
        },

      })
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type fields positions templateFile"
        )
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      success: true,

      count:
        offerLetters.length,

      offerLetters,

    });

  } catch (error) {

    console.error(
      "GET PENDING OFFER LETTERS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch pending offer letters.",

      error:
        error.message,

    });

  }

};



// =====================================================
// GET SINGLE OFFER LETTER
// =====================================================

export const getGeneratedOfferLetterById = async (
  req,
  res
) => {

  try {

    const offerLetter =
      await GeneratedOfferLetter.findById(
        req.params.id
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type fields positions templateFile"
        );


    if (!offerLetter) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter not found.",

      });

    }


    return res.status(200).json({

      success: true,

      offerLetter,

    });

  } catch (error) {

    console.error(
      "GET OFFER LETTER ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offer letter.",

      error:
        error.message,

    });

  }

};



// =====================================================
// EMPLOYEE EDIT OFFER LETTER
// =====================================================

export const updateGeneratedOfferLetter = async (
  req,
  res
) => {

  try {

    const offerLetter =
      await GeneratedOfferLetter.findById(
        req.params.id
      );


    if (!offerLetter) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter not found.",

      });

    }


    const incomingData =
      req.body.data || {};


    const existingData =
      offerLetter.data
        ? offerLetter.data.toObject?.() ||
          offerLetter.data
        : {};


    offerLetter.data = {

      ...existingData,

      ...incomingData,

    };


    offerLetter.status =
      "revision";


    offerLetter.verifiedBy =
      null;


    offerLetter.verifiedAt =
      null;


    offerLetter.employeeRemark =
      "";


    await offerLetter.save();


    const updatedOfferLetter =
      await GeneratedOfferLetter.findById(
        offerLetter._id
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "course",
          "title category"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type fields positions templateFile"
        );


    return res.status(200).json({

      success: true,

      message:
        "Offer letter details updated successfully.",

      offerLetter:
        updatedOfferLetter,

    });

  } catch (error) {

    console.error(
      "UPDATE OFFER LETTER ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update offer letter.",

      error:
        error.message,

    });

  }

};



// =====================================================
// REQUEST REVISION
// =====================================================

export const requestOfferLetterRevision = async (
  req,
  res
) => {

  try {

    const offerLetter =
      await GeneratedOfferLetter.findById(
        req.params.id
      );


    if (!offerLetter) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter not found.",

      });

    }


    offerLetter.status =
      "revision";


    offerLetter.employeeRemark =
      req.body.remark ||
      "Please review and correct the offer letter details.";


    offerLetter.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    offerLetter.verifiedAt =
      new Date();


    await offerLetter.save();


    return res.status(200).json({

      success: true,

      message:
        "Offer letter revision requested successfully.",

      offerLetter,

    });

  } catch (error) {

    console.error(
      "REQUEST OFFER LETTER REVISION ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to request offer letter revision.",

      error:
        error.message,

    });

  }

};



// =====================================================
// APPROVE OFFER LETTER
// GENERATE PDF + EMAIL
// =====================================================

export const approveGeneratedOfferLetter = async (
  req,
  res
) => {

  try {

    const offerLetter =
      await GeneratedOfferLetter.findById(
        req.params.id
      )
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template"
        );


    if (!offerLetter) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter not found.",

      });

    }


    if (
      offerLetter.status === "approved"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Offer letter is already approved.",

      });

    }


    if (
      !offerLetter.template ||
      !offerLetter.template.templateFile
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Offer letter template file is missing.",

      });

    }


    const studentName =
      offerLetter.data?.studentName ||
      offerLetter.student?.name ||
      "Student";


    const role =
      offerLetter.data?.role ||
      "";


    const companyName =
      offerLetter.data?.companyName ||
      offerLetter.internship?.company ||
      "SkilVira";


    const duration =
      offerLetter.data?.duration ||
      offerLetter.internship?.duration ||
      offerLetter.course?.duration ||
      "";


    const joiningDate =
      offerLetter.data?.joiningDate ||
      new Date().toISOString().split("T")[0];


    const offerId =
      offerLetter.data?.offerId ||
      `OFF-${Date.now()}`;


    const issueDate =
      offerLetter.data?.issueDate ||
      new Date().toLocaleDateString("en-IN");


    let templatePath =
      offerLetter.template.templateFile;


    if (
      templatePath.startsWith("/")
    ) {

      templatePath =
        path.join(
          process.cwd(),
          templatePath
        );

    }


    // =========================================
    // GENERATE FINAL PDF
    // =========================================

    const generated =
      await generateOfferLetter({

        templatePath,

        positions:
          offerLetter.template.positions ||
          {},

        studentName,

        role,

        companyName,

        duration,

        joiningDate,

        endDate:
          offerLetter.data?.endDate ||
          "",

        stipend:
          offerLetter.data?.stipend ||
          "",

        location:
          offerLetter.data?.location ||
          offerLetter.internship?.location ||
          "",

        workMode:
          offerLetter.data?.workMode ||
          offerLetter.internship?.workMode ||
          "",

        offerId,

        issueDate,

        reportingManager:
          offerLetter.data?.reportingManager ||
          "",

      });


    // =========================================
    // SAVE FILE
    // =========================================

    offerLetter.offerLetterFile =
      generated.offerLetterFile;


    offerLetter.data = {

      ...(offerLetter.data?.toObject?.() ||
        offerLetter.data ||
        {}),

      studentName,

      companyName,

      duration,

      joiningDate,

      offerId:
        generated.offerId,

      issueDate,

    };


    offerLetter.status =
      "approved";


    offerLetter.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    offerLetter.verifiedAt =
      new Date();


    offerLetter.employeeRemark =
      req.body.remark ||
      "Offer letter approved.";


    await offerLetter.save();


    // =========================================
    // EMAIL
    // =========================================

    let emailSent = false;

    let emailError = null;


    const studentEmail =
      offerLetter.student?.email;


    if (studentEmail) {

      try {

        await sendOfferLetterEmail({

          to:
            studentEmail,

          studentName,

          role,

          companyName,

          offerId:
            generated.offerId,

          offerLetterFile:
            generated.offerLetterFile,

        });


        offerLetter.emailSent =
          true;


        offerLetter.emailSentAt =
          new Date();


        emailSent =
          true;


        await offerLetter.save();

      } catch (mailError) {

        console.error(
          "OFFER LETTER EMAIL ERROR:",
          mailError
        );


        emailError =
          mailError.message;

      }

    } else {

      emailError =
        "Student email not found.";

    }


    return res.status(200).json({

      success: true,

      message:
        emailSent

          ? "Offer letter approved, generated and emailed to student."

          : "Offer letter approved and generated, but email could not be sent.",

      emailSent,

      emailError,

      offerLetter,

    });

  } catch (error) {

    console.error(
      "APPROVE OFFER LETTER ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to approve offer letter.",

      error:
        error.message,

    });

  }

};



// =====================================================
// REJECT OFFER LETTER
// =====================================================

export const rejectGeneratedOfferLetter = async (
  req,
  res
) => {

  try {

    const offerLetter =
      await GeneratedOfferLetter.findById(
        req.params.id
      );


    if (!offerLetter) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter not found.",

      });

    }


    offerLetter.status =
      "rejected";


    offerLetter.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    offerLetter.verifiedAt =
      new Date();


    offerLetter.employeeRemark =
      req.body.reason ||
      req.body.remark ||
      "Offer letter rejected by employee.";


    await offerLetter.save();


    return res.status(200).json({

      success: true,

      message:
        "Offer letter rejected successfully.",

      offerLetter,

    });

  } catch (error) {

    console.error(
      "REJECT OFFER LETTER ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to reject offer letter.",

      error:
        error.message,

    });

  }

};



// =====================================================
// GET APPROVED OFFER LETTERS
// =====================================================

export const getApprovedOfferLetters = async (
  req,
  res
) => {

  try {

    const offerLetters =
      await GeneratedOfferLetter.find({

        status: "approved",

      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title"
        )
        .populate(
          "internship",
          "title company"
        )
        .populate(
          "template",
          "name type"
        )
        .sort({
          verifiedAt: -1,
        });


    return res.status(200).json({

      success: true,

      count:
        offerLetters.length,

      offerLetters,

    });

  } catch (error) {

    console.error(
      "GET APPROVED OFFER LETTERS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch approved offer letters.",

      error:
        error.message,

    });

  }

};