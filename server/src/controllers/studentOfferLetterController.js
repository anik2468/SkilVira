import GeneratedOfferLetter from "../models/GeneratedOfferLetter.js";

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

/**
 * GET /api/student-offer-letters
 * Student ke saare approved offer letters
 */
export const getMyOfferLetters = async (req, res) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const offerLetters = await GeneratedOfferLetter.find({
      student: studentId,
      status: "approved",
      isDeleted: { $ne: true },
    })
      .populate("course", "title name")
      .populate(
        "internship",
        "title company companyLogo internshipType workMode location duration"
      )
      .populate("template", "name type")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: offerLetters.length,
      data: offerLetters,
    });
  } catch (error) {
    console.error("getMyOfferLetters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch offer letters",
      error: error.message,
    });
  }
};

/**
 * GET /api/student-offer-letters/:id
 * Student apna specific approved offer letter dekhe
 */
export const getMyOfferLetterById = async (req, res) => {
  try {
    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const offerLetter = await GeneratedOfferLetter.findOne({
      _id: id,
      student: studentId,
      status: "approved",
      isDeleted: { $ne: true },
    })
      .populate("course", "title name description")
      .populate(
        "internship",
        "title company companyLogo companyWebsite internshipType workMode location duration skills description"
      )
      .populate("template", "name type")
      .lean();

    if (!offerLetter) {
      return res.status(404).json({
        success: false,
        message: "Offer letter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: offerLetter,
    });
  } catch (error) {
    console.error("getMyOfferLetterById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch offer letter",
      error: error.message,
    });
  }
};