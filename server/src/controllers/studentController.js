import Internship from "../models/Internship.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const latestInternships = await Internship.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        applied: 0,
        saved: 0,
        certificates: 0,
        profileCompletion: 60,
      },
      latestInternships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};