import mongoose from "mongoose";

import User from "../models/User.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

const getProfileResponse = (user, profile) => ({
  ...(profile?.toObject ? profile.toObject() : profile || {}),
  user: user?._id,
  name: user?.name || "",
  email: user?.email || "",
  avatar: user?.avatar || "",
  role: user?.role || "recruiter",
  phone: profile?.phone || "",
  designation: profile?.hrDesignation || "",
  company: profile?.companyName || "",
  location: profile?.headquarters || profile?.address || "",
  bio: profile?.about || "",
  website: profile?.website || "",
  linkedin: profile?.linkedin || "",
  twitter: profile?.twitter || "",
});

const fail = (res, error, message) => {
  console.error(`${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getRecruiterAccountProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "recruiter",
      isDeleted: { $ne: true },
    }).select("name email avatar role status");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recruiter account not found.",
      });
    }

    const profile = await RecruiterProfile.findOne({
      user: userId,
    });

    const result = getProfileResponse(user, profile);

    return res.status(200).json({
      success: true,
      profile: result,
      data: result,
    });
  } catch (error) {
    return fail(res, error, "Unable to load recruiter profile.");
  }
};

export const saveRecruiterAccountProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "recruiter",
      isDeleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recruiter account not found.",
      });
    }

    const body = req.body || {};

    // Only update safe personal-account fields here.
    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty.",
        });
      }

      user.name = name;
    }

    if (body.avatar !== undefined) {
      user.avatar = String(body.avatar || "");
    }

    const profileFields = {
      phone: body.phone,
      companyName: body.companyName ?? body.company,
      website: body.website,
      industry: body.industry,
      headquarters: body.headquarters ?? body.location,
      address: body.address,
      about: body.about ?? body.bio,
      linkedin: body.linkedin,
      twitter: body.twitter,
      hrDesignation: body.hrDesignation ?? body.designation,
      companyLogo: body.companyLogo,
    };

    const updates = {};

    for (const [key, value] of Object.entries(profileFields)) {
      if (value !== undefined) {
        updates[key] = String(value ?? "").trim();
      }
    }

    await user.save();

    let profile = await RecruiterProfile.findOne({
      user: userId,
    });

    if (profile) {
      Object.assign(profile, updates);
    } else {
      profile = new RecruiterProfile({
        user: userId,
        ...updates,
      });
    }

    const completionFields = [
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

    const completed = completionFields.filter(
      (field) => String(profile[field] || "").trim()
    ).length;

    profile.profileCompleted = Math.round(
      (completed / completionFields.length) * 100
    );

    await profile.save();

    const result = getProfileResponse(user, profile);

    return res.status(200).json({
      success: true,
      message: "Recruiter profile saved successfully.",
      profile: result,
      data: result,
    });
  } catch (error) {
    return fail(res, error, "Unable to save recruiter profile.");
  }
};