import GeneratedCertificate from "../models/GeneratedCertificate.js";

import CertificateTemplate from "../models/CertificateTemplate.js";

import User from "../models/User.js";

import Course from "../models/Course.js";

import Internship from "../models/Internship.js";


import {
  generateCertificate,
} from "../services/certificateGenerator.js";


import {
  sendCertificateEmail,
} from "../services/emailService.js";


import path from "path";


// =====================================================
// HELPERS
// =====================================================

// -----------------------------------------------------
// Convert mongoose object to plain object
// -----------------------------------------------------

const toObject = (
  value
) => {

  if (!value) {
    return {};
  }


  if (
    typeof value.toObject ===
    "function"
  ) {
    return value.toObject();
  }


  return value;
};


// -----------------------------------------------------
// Build local template path
// -----------------------------------------------------

const buildTemplatePath = (
  templateFile
) => {

  if (!templateFile) {
    return "";
  }


  const value =
    String(
      templateFile
    ).trim();


  if (!value) {
    return "";
  }


  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {
    return value;
  }


  if (
    value.startsWith("/")
  ) {
    return path.resolve(
      process.cwd(),
      value.replace(
        /^\/+/,
        ""
      )
    );
  }


  return path.resolve(
    process.cwd(),
    value
  );
};


// -----------------------------------------------------
// Student name
// -----------------------------------------------------

const getStudentName = (
  certificate,
  studentData
) => {

  return (
    certificate.data
      ?.studentName ||

    studentData?.name ||

    "Student"
  );
};


// -----------------------------------------------------
// Program name
// -----------------------------------------------------

const getProgramName = (
  certificate,
  courseData,
  internshipData
) => {

  return (
    certificate.data
      ?.courseName ||

    courseData?.title ||

    internshipData?.title ||

    "SkilVira Program"
  );
};


// -----------------------------------------------------
// User ID
// -----------------------------------------------------

const getUserId = (
  req
) => {

  return (
    req.user?.id ||

    req.user?._id ||

    req.user?.userId ||

    null
  );
};


// -----------------------------------------------------
// Build certificate data for generator
// -----------------------------------------------------

const buildCertificateGeneratorData = ({
  certificate,
  student,
  course,
  internship,
  template,
}) => {

  const data =
    toObject(
      certificate.data
    );


  return {

    templatePath:
      buildTemplatePath(
        template?.templateFile
      ),

    fields:
      template?.fields ||
      {},

    positions:
      template?.positions ||
      {},

    studentName:
      data.studentName ||
      student?.name ||
      "Student",

    courseName:
      data.courseName ||
      course?.title ||
      internship?.title ||
      "SkilVira Program",

    marks:
      data.marks ??
      "",

    grade:
      data.grade ||
      "",

    duration:
      data.duration ||
      course?.duration ||
      internship?.duration ||
      "",

    attendance:
      data.attendance ??
      "",

    performance:
      data.performance ||
      "",

    feedback:
      data.feedback ||
      "",

    credentialId:
      certificate.certificateId ||
      data.certificateId ||
      `SKIL-${Date.now()}`,

    issueDate:
      data.issueDate ||
      new Date().toLocaleDateString(
        "en-IN"
      ),
  };
};


// =====================================================
// CREATE GENERATED CERTIFICATE
// CREATE DRAFT + QR
// =====================================================

export const createGeneratedCertificate =
  async (
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


      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

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


      // -------------------------------------------------
      // TEMPLATE
      // -------------------------------------------------

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


      if (
        !templateData.isActive
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Certificate template is inactive.",
        });
      }


      if (
        templateData.category &&
        templateData.category !==
          "certificate"
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Selected template is not a certificate template.",
        });
      }


      if (
        !templateData.templateFile
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Certificate template file is missing.",
        });
      }


      // -------------------------------------------------
      // STUDENT
      // -------------------------------------------------

      const studentData =
        await User.findById(
          student
        ).select(
          "name email avatar"
        );


      if (!studentData) {

        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }


      // -------------------------------------------------
      // COURSE
      // -------------------------------------------------

      const courseData =
        course
          ? await Course.findById(
              course
            ).select(
              "title duration"
            )
          : null;


      // -------------------------------------------------
      // INTERNSHIP
      // -------------------------------------------------

      const internshipData =
        internship
          ? await Internship.findById(
              internship
            ).select(
              "title company duration location workMode"
            )
          : null;


      // -------------------------------------------------
      // CERTIFICATE ID
      // -------------------------------------------------

      const certificateId =
        data.certificateId ||
        `SKIL-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`;


      // -------------------------------------------------
      // ISSUE DATE
      // -------------------------------------------------

      const issueDate =
        data.issueDate ||
        new Date().toLocaleDateString(
          "en-IN"
        );


      // -------------------------------------------------
      // CREATE DATABASE RECORD
      // -------------------------------------------------

      const certificate =
        await GeneratedCertificate.create({

          student,

          course:
            course ||
            null,

          internship:
            internship ||
            null,

          template:
            template,

          data: {

            ...data,

            studentName:
              data.studentName ||
              studentData.name ||
              "",

            courseName:
              data.courseName ||
              courseData?.title ||
              internshipData?.title ||
              "",

            marks:
              data.marks ??
              "",

            grade:
              data.grade ||
              "",

            duration:
              data.duration ||
              courseData?.duration ||
              internshipData?.duration ||
              "",

            attendance:
              data.attendance ??
              "",

            performance:
              data.performance ||
              "",

            feedback:
              data.feedback ||
              "",

            issueDate,

            certificateId,
          },

          certificateId,

          status:
            "pending",

          emailSent:
            false,
        });


      // =================================================
      // CREATE DRAFT CERTIFICATE + QR
      // =================================================

      try {

        const generated =
          await generateCertificate({

            templatePath:
              buildTemplatePath(
                templateData.templateFile
              ),

            fields:
              templateData.fields ||
              {},

            positions:
              templateData.positions ||
              {},

            studentName:
              data.studentName ||
              studentData.name ||
              "Student",

            courseName:
              data.courseName ||
              courseData?.title ||
              internshipData?.title ||
              "SkilVira Program",

            marks:
              data.marks ??
              "",

            grade:
              data.grade ||
              "",

            duration:
              data.duration ||
              courseData?.duration ||
              internshipData?.duration ||
              "",

            attendance:
              data.attendance ??
              "",

            performance:
              data.performance ||
              "",

            feedback:
              data.feedback ||
              "",

            credentialId:
              certificateId,

            issueDate,
          });


        certificate.certificateFile =
          generated.certificateFile;


        certificate.qrCode =
          generated.qrCode ||
          "";


        certificate.certificateId =
          generated.credentialId ||
          certificateId;


        certificate.data = {

          ...toObject(
            certificate.data
          ),

          certificateId:
            generated.credentialId ||
            certificateId,
        };


        await certificate.save();


      } catch (generationError) {

        console.error(
          "DRAFT CERTIFICATE GENERATION ERROR:",
          generationError
        );


        // Do not leave an unusable certificate
        // record in the verification queue.

        await GeneratedCertificate.findByIdAndDelete(
          certificate._id
        );


        return res.status(500).json({

          success:
            false,

          message:
            "Certificate draft generation failed.",

          error:
            generationError.message,
        });
      }


      // =================================================
      // POPULATED RESPONSE
      // =================================================

      const populated =
        await GeneratedCertificate.findById(
          certificate._id
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
            "name type category fields positions templateFile"
          );


      return res.status(201).json({

        success:
          true,

        message:
          "Certificate draft generated and sent for employee review.",

        certificate:
          populated,
      });


    } catch (error) {

      console.error(
        "CREATE GENERATED CERTIFICATE ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to create certificate.",
      });
    }
  };


// =====================================================
// EMPLOYEE VERIFICATION QUEUE
// =====================================================

export const getPendingCertificates =
  async (
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
            "title category duration"
          )

          .populate(
            "internship",
            "title company duration location workMode"
          )

          .populate(
            "template",
            "name type category fields positions templateFile"
          )

          .sort({
            createdAt:
              -1,
          });


      return res.status(200).json({

        success:
          true,

        certificates,
      });


    } catch (error) {

      console.error(
        "GET PENDING CERTIFICATES ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// GET SINGLE
// =====================================================

export const getGeneratedCertificateById =
  async (
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
            "title company duration location workMode"
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


      const role = String(req.user?.role || "").toLowerCase();
      const staffRoles = ["employee", "admin", "control"];
      const studentId = String(
        certificate.student?._id || certificate.student || ""
      );

      if (
        !staffRoles.includes(role) &&
        !(role === "student" && studentId === String(getUserId(req)))
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this certificate.",
        });
      }

      return res.status(200).json({

        success:
          true,

        certificate,
      });


    } catch (error) {

      console.error(
        "GET CERTIFICATE ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// UPDATE CERTIFICATE DETAILS
// REGENERATE DRAFT
// =====================================================

export const updateCertificateDetails =
  async (
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


      // -------------------------------------------------
      // APPROVED CERTIFICATE SHOULD NOT BE EDITED
      // -------------------------------------------------

      if (
        certificate.status ===
        "approved"
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Approved certificate cannot be edited.",
        });
      }


      // -------------------------------------------------
      // LOAD TEMPLATE
      // -------------------------------------------------

      const template =
        await CertificateTemplate.findById(
          certificate.template
        );


      if (!template) {

        return res.status(404).json({

          success:
            false,

          message:
            "Certificate template not found.",
        });
      }


      if (
        !template.isActive
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Certificate template is inactive.",
        });
      }


      if (
        !template.templateFile
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Certificate template file is missing.",
        });
      }


      // -------------------------------------------------
      // INCOMING DATA
      // -------------------------------------------------

      const incomingData =
        req.body.data || {};


      const existingData =
        toObject(
          certificate.data
        );


      const mergedData = {

        ...existingData,

        ...incomingData,
      };


      // -------------------------------------------------
      // FETCH RELATED DATA
      // -------------------------------------------------

      const studentData =
        await User.findById(
          certificate.student
        ).select(
          "name email avatar"
        );


      const courseData =
        certificate.course
          ? await Course.findById(
              certificate.course
            ).select(
              "title duration"
            )
          : null;


      const internshipData =
        certificate.internship
          ? await Internship.findById(
              certificate.internship
            ).select(
              "title company duration location workMode"
            )
          : null;


      // -------------------------------------------------
      // NORMALIZED VALUES
      // -------------------------------------------------

      const studentName =
        mergedData.studentName ||
        studentData?.name ||
        "Student";


      const courseName =
        mergedData.courseName ||
        courseData?.title ||
        internshipData?.title ||
        "SkilVira Program";


      const issueDate =
        mergedData.issueDate ||
        new Date().toLocaleDateString(
          "en-IN"
        );


      const certificateId =
        mergedData.certificateId ||
        certificate.certificateId ||
        `SKIL-${Date.now()}`;


      // -------------------------------------------------
      // SAVE DATA FIRST
      // -------------------------------------------------

      certificate.data = {

        ...mergedData,

        studentName,

        courseName,

        marks:
          mergedData.marks ??
          "",

        grade:
          mergedData.grade ||
          "",

        duration:
          mergedData.duration ||
          courseData?.duration ||
          internshipData?.duration ||
          "",

        attendance:
          mergedData.attendance ??
          "",

        performance:
          mergedData.performance ||
          "",

        feedback:
          mergedData.feedback ||
          "",

        issueDate,

        certificateId,
      };


      certificate.certificateId =
        certificateId;


      // -------------------------------------------------
      // REGENERATE DRAFT
      // -------------------------------------------------

      const generated =
        await generateCertificate({

          templatePath:
            buildTemplatePath(
              template.templateFile
            ),

          fields:
            template.fields ||
            {},

          positions:
            template.positions ||
            {},

          studentName,

          courseName,

          marks:
            certificate.data.marks,

          grade:
            certificate.data.grade,

          duration:
            certificate.data.duration,

          attendance:
            certificate.data.attendance,

          performance:
            certificate.data.performance,

          feedback:
            certificate.data.feedback,

          credentialId:
            certificateId,

          issueDate,
        });


      certificate.certificateFile =
        generated.certificateFile;


      certificate.qrCode =
        generated.qrCode ||
        "";


      certificate.certificateId =
        generated.credentialId;


      certificate.data = {

        ...toObject(
          certificate.data
        ),

        certificateId:
          generated.credentialId,
      };


      // -------------------------------------------------
      // EDITED CERTIFICATE GOES TO REVISION STATE
      // -------------------------------------------------

      certificate.status =
        "revision";

      certificate.verifiedBy =
        null;

      certificate.verifiedAt =
        null;

      certificate.employeeRemark =
        "";


      await certificate.save();


      // -------------------------------------------------
      // POPULATE
      // -------------------------------------------------

      const populated =
        await GeneratedCertificate.findById(
          certificate._id
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
            "name type category fields positions templateFile"
          );


      return res.status(200).json({

        success:
          true,

        message:
          "Certificate details updated and draft regenerated successfully.",

        certificate:
          populated,
      });


    } catch (error) {

      console.error(
        "UPDATE CERTIFICATE ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// REQUEST REVISION
// =====================================================

export const requestCertificateRevision =
  async (
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

          success:
            false,

          message:
            "Certificate not found.",
        });
      }


      if (
        certificate.status ===
        "approved"
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Approved certificate cannot be sent for revision.",
        });
      }


      certificate.status =
        "revision";


      certificate.employeeRemark =
        req.body.remark ||
        "Please review and correct the certificate details.";


      certificate.verifiedBy =
        getUserId(
          req
        );


      certificate.verifiedAt =
        new Date();


      await certificate.save();


      return res.status(200).json({

        success:
          true,

        message:
          "Certificate revision requested successfully.",

        certificate,
      });


    } catch (error) {

      console.error(
        "REQUEST CERTIFICATE REVISION ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// APPROVE CERTIFICATE
// FINAL PDF + QR + EMAIL
// =====================================================

export const approveCertificate =
  async (
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
            "title duration"
          )

          .populate(
            "internship",
            "title company duration location workMode"
          )

          .populate(
            "template"
          );


      if (!certificate) {

        return res.status(404).json({

          success:
            false,

          message:
            "Certificate not found.",
        });
      }


      // -------------------------------------------------
      // ALREADY APPROVED
      // -------------------------------------------------

      if (
        !["pending", "revision"].includes(certificate.status)
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Only pending or revision certificates can be approved.",
        });
      }


      // -------------------------------------------------
      // TEMPLATE CHECK
      // -------------------------------------------------

      if (
        !certificate.template
          ?.templateFile
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Certificate template file is missing.",
        });
      }


      // -------------------------------------------------
      // STUDENT
      // -------------------------------------------------

      const studentName =
        getStudentName(
          certificate,
          certificate.student
        );


      // -------------------------------------------------
      // PROGRAM
      // -------------------------------------------------

      const courseName =
        getProgramName(
          certificate,
          certificate.course,
          certificate.internship
        );


      // -------------------------------------------------
      // DATA
      // -------------------------------------------------

      const certificateData =
        toObject(
          certificate.data
        );


      const issueDate =
        certificateData.issueDate ||
        new Date().toLocaleDateString(
          "en-IN"
        );


      const certificateId =
        certificate.certificateId ||
        certificateData.certificateId ||
        `SKIL-${Date.now()}`;


      // =================================================
      // FINAL GENERATION
      // =================================================

      const generated =
        await generateCertificate({

          templatePath:
            buildTemplatePath(
              certificate.template
                .templateFile
            ),

          fields:
            certificate.template
              .fields ||
            {},

          positions:
            certificate.template
              .positions ||
            {},

          studentName,

          courseName,

          marks:
            certificateData.marks ??
            "",

          grade:
            certificateData.grade ||
            "",

          duration:
            certificateData.duration ||
            certificate.course?.duration ||
            certificate.internship?.duration ||
            "",

          attendance:
            certificateData.attendance ??
            "",

          performance:
            certificateData.performance ||
            "",

          feedback:
            certificateData.feedback ||
            "",

          credentialId:
            certificateId,

          issueDate,
        });


      // =================================================
      // SAVE GENERATED FILE
      // =================================================

      certificate.certificateFile =
        generated.certificateFile;


      certificate.qrCode =
        generated.qrCode ||
        "";


      certificate.certificateId =
        generated.credentialId;


      certificate.data = {

        ...certificateData,

        studentName,

        courseName,

        marks:
          certificateData.marks ??
          "",

        grade:
          certificateData.grade ||
          "",

        duration:
          certificateData.duration ||
          certificate.course?.duration ||
          certificate.internship?.duration ||
          "",

        attendance:
          certificateData.attendance ??
          "",

        performance:
          certificateData.performance ||
          "",

        feedback:
          certificateData.feedback ||
          "",

        issueDate,

        certificateId:
          generated.credentialId,
      };


      // =================================================
      // APPROVAL
      // =================================================

      certificate.status =
        "approved";


      certificate.verifiedBy =
        getUserId(
          req
        );


      certificate.verifiedAt =
        new Date();


      certificate.employeeRemark =
        req.body.remark ||
        "Certificate approved.";


      certificate.emailSent =
        false;

      certificate.emailSentAt =
        null;


      await certificate.save();


      // =================================================
      // EMAIL
      // =================================================

      let emailSent =
        false;

      let emailError =
        null;


      const studentEmail =
        certificate.student?.email;


      if (
        studentEmail
      ) {

        try {

          await sendCertificateEmail({

            to:
              studentEmail,

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


          emailSent =
            true;


          await certificate.save();


        } catch (
          mailError
        ) {

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


      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({

        success:
          true,

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

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// REJECT
// =====================================================

export const rejectCertificate =
  async (
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

          success:
            false,

          message:
            "Certificate not found.",
        });
      }


      if (
        certificate.status ===
        "approved"
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Approved certificate cannot be rejected.",
        });
      }


      certificate.status =
        "rejected";


      certificate.employeeRemark =
        req.body.reason ||
        req.body.remark ||
        "Certificate rejected by employee.";


      certificate.verifiedBy =
        getUserId(
          req
        );


      certificate.verifiedAt =
        new Date();


      await certificate.save();


      return res.status(200).json({

        success:
          true,

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

        success:
          false,

        message:
          error.message,
      });
    }
  };


// =====================================================
// PUBLIC CERTIFICATE VERIFICATION
// NO AUTH REQUIRED
//
// Only APPROVED certificates are publicly visible.
// =====================================================

export const verifyCertificatePublic =
  async (
    req,
    res
  ) => {

    try {

      const credentialId =
        String(
          req.params.credentialId ||
          ""
        )
          .trim()
          .toUpperCase();


      if (
        !credentialId
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Certificate ID is required.",
        });
      }


      // -------------------------------------------------
      // ONLY APPROVED CERTIFICATES
      // -------------------------------------------------

      const certificate =
        await GeneratedCertificate.findOne({

          certificateId:
            credentialId,

          status:
            "approved",

        })

          .populate(
            "student",
            "name"
          )

          .populate(
            "course",
            "title"
          )

          .populate(
            "internship",
            "title company"
          )

          .lean();


      if (!certificate) {

        return res.status(404).json({

          success:
            false,

          message:
            "Certificate not found or not verified by SkilVira.",
        });
      }


      // -------------------------------------------------
      // PUBLIC RESPONSE
      // -------------------------------------------------

      return res.status(200).json({

        success:
          true,

        certificate: {

          certificateId:
            certificate.certificateId,


          student: {

            name:
              certificate.student
                ?.name ||

              certificate.data
                ?.studentName ||

              "Student",
          },


          course:
            certificate.course
              ? {

                  title:
                    certificate
                      .course
                      .title,
                }

              : null,


          internship:
            certificate.internship

              ? {

                  title:
                    certificate
                      .internship
                      .title,

                  company:
                    certificate
                      .internship
                      .company,
                }

              : null,


          data: {

            studentName:
              certificate.data
                ?.studentName,

            courseName:
              certificate.data
                ?.courseName,

            marks:
              certificate.data
                ?.marks,

            grade:
              certificate.data
                ?.grade,

            duration:
              certificate.data
                ?.duration,

            attendance:
              certificate.data
                ?.attendance,

            performance:
              certificate.data
                ?.performance,

            feedback:
              certificate.data
                ?.feedback,

            issueDate:
              certificate.data
                ?.issueDate,
          },


          certificateFile:
            certificate.certificateFile,


          status:
            "approved",


          verifiedAt:
            certificate.verifiedAt,


          issuer:
            "SkilVira",
        },
      });


    } catch (error) {

      console.error(
        "PUBLIC CERTIFICATE VERIFICATION ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Unable to verify certificate.",
      });
    }
  };