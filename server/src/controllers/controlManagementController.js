import mongoose from "mongoose";

import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Certificate from "../models/Certificate.js";
import PlatformSetting from "../models/PlatformSetting.js";

const validId = (id) => mongoose.Types.ObjectId.isValid(String(id || ""));

const fail = (res, error, message) => {
  console.error(`${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getControlUserById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(req.params.id).select(
      "-password -refreshToken -resetPasswordToken"
    );

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({ success: true, user, data: user });
  } catch (error) {
    return fail(res, error, "Unable to load user.");
  }
};

export const blockControlUser = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "blocked" } },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User blocked successfully.",
      user,
    });
  } catch (error) {
    return fail(res, error, "Unable to block user.");
  }
};

export const unblockControlUser = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "active" } },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User unblocked successfully.",
      user,
    });
  } catch (error) {
    return fail(res, error, "Unable to unblock user.");
  }
};

export const getControlInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      isDeleted: { $ne: true },
    })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: internships.length,
      internships,
      data: internships,
    });
  } catch (error) {
    return fail(res, error, "Unable to load internships.");
  }
};

export const deleteControlInternship = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship ID.",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true, status: "Closed" } },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    return res.json({
      success: true,
      message: "Internship removed from the active listing.",
      internship,
    });
  } catch (error) {
    return fail(res, error, "Unable to delete internship.");
  }
};

export const getControlRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
      isDeleted: { $ne: true },
    })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: recruiters.length,
      recruiters,
      data: recruiters,
    });
  } catch (error) {
    return fail(res, error, "Unable to load recruiters.");
  }
};

export const approveControlRecruiter = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const recruiter = await User.findOneAndUpdate(
      { _id: req.params.id, role: "recruiter" },
      {
        $set: {
          recruiterApproved: true,
          isVerified: true,
          status: "active",
          approvedBy: req.user?.id || req.user?._id || null,
          approvedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    return res.json({
      success: true,
      message: "Recruiter approved successfully.",
      recruiter,
    });
  } catch (error) {
    return fail(res, error, "Unable to approve recruiter.");
  }
};

export const rejectControlRecruiter = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const recruiter = await User.findOneAndUpdate(
      { _id: req.params.id, role: "recruiter" },
      {
        $set: {
          recruiterApproved: false,
          status: "inactive",
        },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    return res.json({
      success: true,
      message: "Recruiter approval rejected.",
      recruiter,
    });
  } catch (error) {
    return fail(res, error, "Unable to reject recruiter.");
  }
};

export const getControlStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      isDeleted: { $ne: true },
    })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: students.length,
      students,
      data: students,
    });
  } catch (error) {
    return fail(res, error, "Unable to load students.");
  }
};

export const deleteControlStudent = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      { $set: { isDeleted: true, status: "deleted" } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.json({
      success: true,
      message: "Student deactivated successfully.",
    });
  } catch (error) {
    return fail(res, error, "Unable to remove student.");
  }
};

export const getControlApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      isDeleted: { $ne: true },
    })
      .populate("student", "name email")
      .populate("recruiter", "name email")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: applications.length,
      applications,
      data: applications,
    });
  } catch (error) {
    return fail(res, error, "Unable to load applications.");
  }
};

export const updateControlApplicationStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    const { status, recruiterRemarks } = req.body || {};

    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          ...(recruiterRemarks !== undefined
            ? { recruiterRemarks: String(recruiterRemarks) }
            : {}),
        },
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({
      success: true,
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    return fail(res, error, "Unable to update application.");
  }
};

export const getControlCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: certificates.length,
      certificates,
      data: certificates,
    });
  } catch (error) {
    return fail(res, error, "Unable to load certificates.");
  }
};

export const verifyControlCertificate = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID.",
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: { verified: true } },
      { new: true, runValidators: true }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    return res.json({
      success: true,
      message: "Certificate verified successfully.",
      certificate,
    });
  } catch (error) {
    return fail(res, error, "Unable to verify certificate.");
  }
};

export const getControlSettings = async (req, res) => {
  try {
    let settings = await PlatformSetting.findOne();

    if (!settings) {
      settings = await PlatformSetting.create({});
    }

    return res.json({
      success: true,
      settings,
      data: settings,
    });
  } catch (error) {
    return fail(res, error, "Unable to load platform settings.");
  }
};

export const updateControlSettings = async (req, res) => {
  try {
    const allowed = [
      "platformName",
      "maintenance",
      "allowRegistration",
      "emailNotification",
      "smsNotification",
    ];

    const updates = {};

    for (const key of allowed) {
      if (req.body?.[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    let settings = await PlatformSetting.findOne();

    if (!settings) {
      settings = new PlatformSetting();
    }

    Object.assign(settings, updates);
    settings.updatedBy = req.user?.id || req.user?._id || null;

    await settings.save();

    return res.json({
      success: true,
      message: "Platform settings saved.",
      settings,
      data: settings,
    });
  } catch (error) {
    return fail(res, error, "Unable to save platform settings.");
  }
};