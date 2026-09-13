import GeneratedCertificate from "../models/GeneratedCertificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import User from "../models/User.js";

import {
  generateCertificate,
} from "../services/certificateGenerator.js";

import {
  sendCertificateEmail,
} from "../services/emailService.js";

import path from "path";



// =====================================================
// CREATE GENERATED CERTIFICATE
// =====================================================

export const createGeneratedCertificate = async (
  req,
  res
) => {

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

        message:
          "Student is required.",

      });

    }


    if (!template) {

      return res.status(400).json({

        success: false,

        message:
          "Certificate template is required.",

      });

    }


    const templateData =
      await CertificateTemplate.findById(
        template
      );


    if (!templateData) {

      return res.status(404).json({

        success: false,

        message:
          "Certificate template not found.",

      });

    }


    const certificateId =
      "SKIL-" + Date.now();


    const certificate =
      await GeneratedCertificate.create({

        student,

        course:
          course || null,

        internship:
          internship || null,

        template,

        data: {

          ...data,

          certificateId,

        },

        certificateId,

        status: "pending",

      });


    return res.status(201).json({

      success: true,

      message:
        "Certificate generation request created.",

      certificate,

    });


  } catch (error) {

    console.error(
      "CREATE GENERATED CERTIFICATE ERROR:",
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
// EMPLOYEE VERIFICATION QUEUE
// =====================================================

export const getPendingCertificates = async (
  req,
  res
) => {

  try {

    const certificates =
      await GeneratedCertificate.find({

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
          "title"
        )

        .populate(
          "internship",
          "title company"
        )

        .populate(
          "template",
          "name type category fields positions templateFile"
        )

        .sort({

          createdAt: -1,

        });


    return res.status(200).json({

      success: true,

      certificates,

    });


  } catch (error) {

    console.error(
      "GET PENDING CERTIFICATES ERROR:",
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
// GET SINGLE CERTIFICATE
// =====================================================

export const getGeneratedCertificateById = async (
  req,
  res
) => {

  try {

    const certificate =
      await GeneratedCertificate.findById(
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
          "title company duration"
        )

        .populate(
          "template",
          "name type category fields positions templateFile"
        );


    if (!certificate) {

      return res.status(404).json({

        success: false,

        message:
          "Certificate not found.",

      });

    }


    return res.status(200).json({

      success: true,

      certificate,

    });


  } catch (error) {

    console.error(
      "GET CERTIFICATE ERROR:",
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
// EMPLOYEE EDIT CERTIFICATE
// =====================================================

export const updateCertificateDetails = async (
  req,
  res
) => {

  try {

    const certificate =
      await GeneratedCertificate.findById(
        req.params.id
      );


    if (!certificate) {

      return res.status(404).json({

        success: false,

        message:
          "Certificate not found.",

      });

    }


    const incomingData =
      req.body.data || {};


    const existingData =
      certificate.data
        ? certificate.data.toObject?.() ||
          certificate.data
        : {};


    certificate.data = {

      ...existingData,

      ...incomingData,

    };


    if (
      incomingData.certificateId
    ) {

      certificate.certificateId =
        incomingData.certificateId;

    }


    certificate.status =
      "revision";


    certificate.verifiedBy =
      null;


    certificate.verifiedAt =
      null;


    certificate.employeeRemark =
      "";


    await certificate.save();


    return res.status(200).json({

      success: true,

      message:
        "Certificate details updated successfully.",

      certificate,

    });


  } catch (error) {

    console.error(
      "UPDATE CERTIFICATE ERROR:",
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
// APPROVE CERTIFICATE
// GENERATE PDF + SEND EMAIL
// =====================================================

export const approveCertificate = async (
  req,
  res
) => {

  try {

    const certificate =
      await GeneratedCertificate.findById(
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
          "title company"
        )

        .populate(
          "template"
        );


    if (!certificate) {

      return res.status(404).json({

        success: false,

        message:
          "Certificate not found.",

      });

    }


    if (
      certificate.status === "approved"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Certificate is already approved.",

      });

    }


    const studentName =
      certificate.data?.studentName ||
      certificate.student?.name ||
      "Student";


    const courseName =
      certificate.data?.courseName ||
      certificate.course?.title ||
      certificate.internship?.title ||
      "SkilVira Program";


    const issueDate =
      certificate.data?.issueDate ||
      new Date().toLocaleDateString(
        "en-IN"
      );


    const certificateId =
      certificate.certificateId ||
      certificate.data?.certificateId ||
      `SKIL-${Date.now()}`;


    // -----------------------------------------
    // TEMPLATE PATH
    // -----------------------------------------

    if (
      !certificate.template?.templateFile
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Certificate template file is missing.",

      });

    }


    let templatePath =
      certificate.template.templateFile;


    if (
      templatePath.startsWith("/")
    ) {

      templatePath =
        path.join(
          process.cwd(),
          templatePath
        );

    }


    // -----------------------------------------
    // GENERATE FINAL CERTIFICATE
    // -----------------------------------------

    const generated =
      await generateCertificate({

        templatePath,

        positions:
          certificate.template.positions ||
          {},

        studentName,

        courseName,

        credentialId:
          certificateId,

        issueDate,

      });


    // -----------------------------------------
    // SAVE FILE
    // -----------------------------------------

    certificate.certificateFile =
      generated.certificateFile;


    certificate.certificateId =
      generated.credentialId;


    certificate.data = {

      ...(certificate.data?.toObject?.() ||
        certificate.data ||
        {}),

      studentName,

      courseName,

      issueDate,

      certificateId:
        generated.credentialId,

    };


    certificate.status =
      "approved";


    certificate.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    certificate.verifiedAt =
      new Date();


    certificate.employeeRemark =
      req.body.remark ||
      "Certificate approved.";


    await certificate.save();


    // -----------------------------------------
    // SEND EMAIL
    // -----------------------------------------

    let emailSent = false;

    let emailError = null;


    const studentEmail =
      certificate.student?.email;


    if (studentEmail) {

      try {

        await sendCertificateEmail({

          to: studentEmail,

          studentName,

          courseName,

          certificateId:
            generated.credentialId,

          certificateFile:
            generated.certificateFile,

        });


        certificate.emailSent =
          true;


        certificate.emailSentAt =
          new Date();


        emailSent = true;


        await certificate.save();


      } catch (mailError) {

        console.error(
          "CERTIFICATE EMAIL ERROR:",
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
          ? "Certificate approved, generated and emailed to student."
          : "Certificate approved and generated, but email could not be sent.",

      emailSent,

      emailError,

      certificate,

    });


  } catch (error) {

    console.error(
      "APPROVE CERTIFICATE ERROR:",
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
// REJECT CERTIFICATE
// =====================================================

export const rejectCertificate = async (
  req,
  res
) => {

  try {

    const certificate =
      await GeneratedCertificate.findById(
        req.params.id
      );


    if (!certificate) {

      return res.status(404).json({

        success: false,

        message:
          "Certificate not found.",

      });

    }


    certificate.status =
      "rejected";


    certificate.employeeRemark =
      req.body.reason ||
      "Certificate rejected by employee.";


    certificate.verifiedBy =
      req.user?.id ||
      req.user?._id ||
      null;


    certificate.verifiedAt =
      new Date();


    await certificate.save();


    return res.status(200).json({

      success: true,

      message:
        "Certificate rejected successfully.",

      certificate,

    });


  } catch (error) {

    console.error(
      "REJECT CERTIFICATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};