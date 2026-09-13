import RecruiterProfile from "../models/RecruiterProfile.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";

// =======================================
// Get Recruiter Profile
// =======================================
export const getRecruiterProfile = async (
  req,
  res
) => {
  try {
    const profile = await RecruiterProfile.findOne({
      user: req.params.userId,
    }).populate(
      "user",
      "name email avatar"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          "Recruiter profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Save Recruiter Profile
// =======================================
export const saveRecruiterProfile = async (
  req,
  res
) => {
  try {
    let profile =
      await RecruiterProfile.findOne({
        user: req.params.userId,
      });

    if (profile) {
      Object.assign(profile, req.body);
    } else {
      profile =
        await RecruiterProfile.create({
          user: req.params.userId,
          ...req.body,
        });
    }

    const fields = [
      "companyName",
      "website",
      "industry",
      "phone",
      "email",
      "about",
      "headquarters",
      "linkedin",
      "twitter",
      "companyLogo",
    ];

    let completed = 0;

    fields.forEach((field) => {
      if (
        profile[field] &&
        profile[field] !== ""
      ) {
        completed++;
      }
    });

    profile.profileCompleted =
      Math.round(
        (completed / fields.length) * 100
      );

    await profile.save();

    res.status(200).json({
      success: true,
      message:
        "Recruiter profile saved successfully.",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Recruiter Dashboard
// =======================================
export const recruiterDashboard = async (
  req,
  res
) => {
  try {
    const recruiterId =
      req.params.userId;

    const internships =
      await Internship.find({
        recruiter: recruiterId,
        isDeleted: false,
      }).sort({
        createdAt: -1,
      });

    const internshipIds =
      internships.map((i) => i._id);

    const totalInternships =
      internships.length;

    const pendingInternships =
      internships.filter(
        (i) =>
          i.approvalStatus ===
          "Pending"
      ).length;

    const approvedInternships =
      internships.filter(
        (i) =>
          i.approvalStatus ===
          "Approved"
      ).length;

    const rejectedInternships =
      internships.filter(
        (i) =>
          i.approvalStatus ===
          "Rejected"
      ).length;

    const applications =
      await Application.countDocuments({
        internship: {
          $in: internshipIds,
        },
        isDeleted: false,
      });

    const pendingApplications =
      await Application.countDocuments({
        internship: {
          $in: internshipIds,
        },
        status: "Pending",
        isDeleted: false,
      });

    const shortlisted =
      await Application.countDocuments({
        internship: {
          $in: internshipIds,
        },
        status: "Shortlisted",
        isDeleted: false,
      });

    const selected =
      await Application.countDocuments({
        internship: {
          $in: internshipIds,
        },
        status: "Selected",
        isDeleted: false,
      });

    const rejected =
      await Application.countDocuments({
        internship: {
          $in: internshipIds,
        },
        status: "Rejected",
        isDeleted: false,
      });

    const latestApplications =
      await Application.find({
        internship: {
          $in: internshipIds,
        },
        isDeleted: false,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "internship",
          "title company"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalInternships,
        pendingInternships,
        approvedInternships,
        rejectedInternships,
        applications,
        pendingApplications,
        shortlisted,
        selected,
        rejected,
      },

      latestApplications,
      internships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};