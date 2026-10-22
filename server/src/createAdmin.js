import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from "./utils/passwordPolicy.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/User.js";

dotenv.config();

const createControlAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const name = String(
    process.env.CONTROL_ADMIN_NAME || "SkilVira Control Admin"
  ).trim();
  const email = String(
    process.env.CONTROL_ADMIN_EMAIL || ""
  ).trim().toLowerCase();
  const password = process.env.CONTROL_ADMIN_PASSWORD;
  if (password && !isStrongPassword(password)) {
    throw new Error(PASSWORD_REQUIREMENT_MESSAGE);
  }
  const resetExisting =
    process.env.CONTROL_ADMIN_RESET_PASSWORD === "true";

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment.");
  }

  if (!email || !password) {
    throw new Error(
      "Set CONTROL_ADMIN_EMAIL and CONTROL_ADMIN_PASSWORD before running this script."
    );
  }

  if (password.length < 12) {
    throw new Error(
      "Control password must contain at least 12 characters."
    );
  }

  await mongoose.connect(mongoUri);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role !== "control") {
      throw new Error(
        "This email belongs to a non-control account. No changes were made."
      );
    }

    if (!resetExisting) {
      console.log(
        "Control account already exists. No changes made."
      );
      return;
    }

    existingUser.name = name;
    existingUser.password = await bcrypt.hash(password, 12);
    existingUser.status = "active";
    existingUser.isDeleted = false;
    existingUser.isVerified = true;
    existingUser.emailVerified = true;

    await existingUser.save();

    console.log(
      `Control account password reset successfully for ${email}.`
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "control",
    status: "active",
    isDeleted: false,
    isVerified: true,
    emailVerified: true,
  });

  console.log(`Control account created for ${email}.`);
};

try {
  await createControlAdmin();
} catch (error) {
  console.error("CONTROL ADMIN SETUP FAILED:", error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}