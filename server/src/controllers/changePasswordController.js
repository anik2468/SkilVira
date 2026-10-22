import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from "../utils/passwordPolicy.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const {
      currentPassword,
      newPassword,
    } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_REQUIREMENT_MESSAGE,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    const user = await User.findById(userId);

    if (!user || user.isDeleted || user.status === "blocked") {
      return res.status(404).json({
        success: false,
        message: "Active user account not found.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password right now.",
    });
  }
};

export default changePassword;