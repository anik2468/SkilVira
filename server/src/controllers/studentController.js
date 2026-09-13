import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";

// ======================================
// Student Dashboard
// ======================================
export const getStudentDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const latestInternships = await Internship.find({
      approvalStatus: "Approved",
      status: "Open",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalApplications = await Application.countDocuments({
      student: userId,
    });

    const pendingApplications = await Application.countDocuments({
      student: userId,
      status: "Pending",
    });

    const selectedApplications = await Application.countDocuments({
      student: userId,
      status: "Selected",
    });

    const profile = await StudentProfile.findOne({
      user: userId,
    });

    res.status(200).json({
      success: true,
      stats: {
        applied: totalApplications,
        pending: pendingApplications,
        selected: selectedApplications,
        profileCompletion:
          profile?.profileCompleted || 0,
      },
      latestInternships,
    });
  } catch (error) {
    console.error("Student Dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Student Stats
// ======================================
export const getStudentStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const applied = await Application.countDocuments({
      student: userId,
    });

    const shortlisted = await Application.countDocuments({
      student: userId,
      status: "Shortlisted",
    });

    const selected = await Application.countDocuments({
      student: userId,
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      student: userId,
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      stats: {
        applied,
        shortlisted,
        selected,
        rejected,
      },
    });
  } catch (error) {
    console.error("Student Stats:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Student Profile Summary
// ======================================
export const getStudentProfileSummary = async (
  req,
  res
) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.params.userId,
    }).populate("user", "name email avatar");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Profile Summary:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};