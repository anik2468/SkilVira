import GeneratedCertificate from "../models/GeneratedCertificate.js";
import GeneratedReport from "../models/GeneratedReport.js";


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
// GET MY CERTIFICATES
// =====================================================

export const getMyCertificates = async (
  req,
  res
) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }


    const certificates =
      await GeneratedCertificate.find({
        student:
          studentId,

        status:
          "approved",
      })
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
          "name"
        )
        .sort({
          createdAt:
            -1,
        });


    return res.status(200).json({
      success: true,

      count:
        certificates.length,

      certificates,
    });

  } catch (error) {

    console.error(
      "GET MY CERTIFICATES ERROR:",
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
// GET MY REPORTS
// =====================================================

export const getMyReports = async (
  req,
  res
) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }


    const reports =
      await GeneratedReport.find({
        student:
          studentId,

        status:
          "approved",
      })
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
          "name"
        )
        .sort({
          createdAt:
            -1,
        });


    return res.status(200).json({
      success: true,

      count:
        reports.length,

      reports,
    });

  } catch (error) {

    console.error(
      "GET MY REPORTS ERROR:",
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
// GET MY DOCUMENTS
// =====================================================

export const getMyDocuments = async (
  req,
  res
) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }


    const [
      certificates,
      reports,
    ] = await Promise.all([

      GeneratedCertificate.find({
        student:
          studentId,
        status:
          "approved",
      })
        .populate(
          "course",
          "title"
        )
        .populate(
          "internship",
          "title company"
        )
        .sort({
          createdAt:
            -1,
        }),

      GeneratedReport.find({
        student:
          studentId,
        status:
          "approved",
      })
        .populate(
          "course",
          "title"
        )
        .populate(
          "internship",
          "title company"
        )
        .sort({
          createdAt:
            -1,
        }),
    ]);


    return res.status(200).json({
      success: true,

      certificates,

      reports,

      totalCertificates:
        certificates.length,

      totalReports:
        reports.length,
    });

  } catch (error) {

    console.error(
      "GET MY DOCUMENTS ERROR:",
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

export const getMyCertificateById = async (
  req,
  res
) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }


    const certificate =
      await GeneratedCertificate.findOne({
        _id:
          req.params.id,

        student:
          studentId,

        status:
          "approved",
      })
        .populate(
          "course",
          "title duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name category type"
        );


    if (!certificate) {
      return res.status(404).json({
        success: false,
        message:
          "Certificate not found or not approved.",
      });
    }


    return res.status(200).json({
      success: true,

      certificate,
    });

  } catch (error) {

    console.error(
      "GET MY CERTIFICATE ERROR:",
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
// GET SINGLE REPORT
// =====================================================

export const getMyReportById = async (
  req,
  res
) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }


    const report =
      await GeneratedReport.findOne({
        _id:
          req.params.id,

        student:
          studentId,

        status:
          "approved",
      })
        .populate(
          "course",
          "title duration"
        )
        .populate(
          "internship",
          "title company duration location workMode"
        )
        .populate(
          "template",
          "name type"
        );


    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Report not found or not approved.",
      });
    }


    return res.status(200).json({
      success: true,

      report,
    });

  } catch (error) {

    console.error(
      "GET MY REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};