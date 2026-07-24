import User from "../models/User.js";
import Internship from "../models/Internship.js";

export const getDashboardStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const recruiters = await User.countDocuments({ role: "recruiter" });
    const colleges = await User.countDocuments({ role: "college" });
    const admins = await User.countDocuments({ role: "admin" });

    const internships = await Internship.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        students,
        recruiters,
        colleges,
        admins,
        internships,
        applications: 0,
        certificates: 0,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};