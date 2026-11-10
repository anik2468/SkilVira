import mongoose from "mongoose";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import LiveClass from "../models/LiveClass.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";

const MANAGED_ROLES = ["student", "recruiter", "ambassador"];

const safeFields =
  "-password -refreshToken -resetPasswordToken -resetPasswordExpire";

const validId = (id) => mongoose.Types.ObjectId.isValid(String(id || ""));

// Admin dashboard: normal users only

export const getAdminDashboard = async (req, res) => {
  try {
    const visible = { isDeleted: { $ne: true } };

    const [
      students,
      recruiters,
      pendingRecruiters,
      ambassadors,
      pendingAmbassadors,
      internships,
      pendingInternships,
      approvedInternships,
      applications,
      pendingApplications,
      shortlistedApplications,
      selectedApplications,
      certificates,
      pendingCertificates,
      verifiedCertificates,
      rejectedCertificates,
      courses,
      lessons,
      liveClasses,
      upcomingLiveClasses,
      liveNow,
      completedLiveClasses,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ ...visible, role: "student" }),
      User.countDocuments({ ...visible, role: "recruiter" }),
      User.countDocuments({
        ...visible, role: "recruiter", recruiterApproved: false,
      }),
      User.countDocuments({ ...visible, role: "ambassador" }),
      User.countDocuments({
        ...visible, role: "ambassador", ambassadorApproved: false,
      }),

      Internship.countDocuments(visible),
      Internship.countDocuments({ ...visible, approvalStatus: "Pending" }),
      Internship.countDocuments({ ...visible, approvalStatus: "Approved" }),

      Application.countDocuments(visible),
      Application.countDocuments({ ...visible, status: "Pending" }),
      Application.countDocuments({ ...visible, status: "Shortlisted" }),
      Application.countDocuments({ ...visible, status: "Selected" }),

      Certificate.countDocuments({}),
      Certificate.countDocuments({
        verified: { $ne: true },
        rejected: { $ne: true },
      }),
      Certificate.countDocuments({ verified: true }),
      Certificate.countDocuments({ rejected: true }),

      Course.countDocuments(visible),
      Lesson.countDocuments(visible),

      LiveClass.countDocuments(visible),
      LiveClass.countDocuments({ ...visible, status: "scheduled" }),
      LiveClass.countDocuments({ ...visible, status: "live" }),
      LiveClass.countDocuments({ ...visible, status: "ended" }),

      ActivityLog.find({})
        .select("action entityType entityId success createdAt actor")
        .populate("actor", "name email role")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    return res.json({
      success: true,
      stats: {
        students,
        recruiters,
        pendingRecruiters,
        ambassadors,
        pendingAmbassadors,
        internships,
        pendingInternships,
        approvedInternships,
        applications,
        pendingApplications,
        shortlistedApplications,
        selectedApplications,
        certificates,
        pendingCertificates,
        verifiedCertificates,
        rejectedCertificates,
        courses,
        lessons,
        liveClasses,
        upcomingLiveClasses,
        liveNow,
        completedLiveClasses,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Admin dashboard.",
    });
  }
};

// List only students, recruiters and ambassadors
export const getAdminUsers = async (req, res) => {
  try {
    const filter = {
      role: { $in: MANAGED_ROLES },
      isDeleted: { $ne: true },
    };

    const query = String(req.query.search || "").trim();

    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select(safeFields)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

// View one managed user
export const getAdminUserById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: MANAGED_ROLES },
      isDeleted: { $ne: true },
    })
      .select(safeFields)
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("ADMIN USER DETAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load user details.",
    });
  }
};

// Admin may edit name and account status only.
// Role, email, password and privileged accounts cannot be changed here.
export const updateAdminUser = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const update = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
      const name = String(req.body.name || "").trim();

      if (!name || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name must contain 1 to 100 characters.",
        });
      }

      update.name = name;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "status")) {
      const status = String(req.body.status || "").toLowerCase();

      if (!["active", "blocked"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Only active or blocked status is allowed.",
        });
      }

      update.status = status;
    }

    if (!Object.keys(update).length) {
      return res.status(400).json({
        success: false,
        message: "No permitted fields provided for update.",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: { $in: MANAGED_ROLES },
        isDeleted: { $ne: true },
      },
      { $set: update },
      { new: true, runValidators: true }
    ).select(safeFields);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or not manageable by Admin.",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update user.",
    });
  }
};
