import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/User.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import ActivityLog from "../models/ActivityLog.js";

const validId = (id) =>
  mongoose.Types.ObjectId.isValid(String(id || ""));

const serverError = (res, error, message) => {
  console.error(`${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
      isDeleted: { $ne: true },
    })
      .select("name email role status lastLogin lastActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const ids = employees.map((employee) => employee._id);

    const profiles = await EmployeeProfile.find({
      user: { $in: ids },
    }).lean();

    const profileMap = new Map(
      profiles.map((profile) => [
        String(profile.user),
        profile,
      ])
    );

    const data = employees.map((employee) => ({
      ...employee,
      profile: profileMap.get(String(employee._id)) || null,
    }));

    return res.json({
      success: true,
      count: data.length,
      employees: data,
      data,
    });
  } catch (error) {
    return serverError(res, error, "Unable to load employees.");
  }
};

export const createEmployee = async (req, res) => {
  let createdUserId = null;

  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    const designation = String(req.body?.designation || "").trim();
    const department = String(req.body?.department || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and temporary password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const existing = await User.findOne({ email }).select("_id");

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email already belongs to an account.",
      });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: "employee",
      status: "active",
      isDeleted: false,
      isVerified: true,
      emailVerified: true,
    });

    createdUserId = user._id;

    await EmployeeProfile.create({
      user: user._id,
      employeeId: `EMP-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`,
      designation,
      department,
      officeEmail: email,
      joiningDate: new Date(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      employee: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    // If profile creation fails, don't leave a half-created account.
    if (createdUserId) {
      try {
        await User.deleteOne({ _id: createdUserId });
        await EmployeeProfile.deleteOne({ user: createdUserId });
      } catch (rollbackError) {
        console.error("EMPLOYEE CREATION ROLLBACK ERROR:", rollbackError);
      }
    }

    return serverError(res, error, "Unable to create employee.");
  }
};

export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = String(req.body?.status || "").toLowerCase();

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or blocked.",
      });
    }

    const employee = await User.findOneAndUpdate(
      {
        _id: id,
        role: "employee",
        isDeleted: { $ne: true },
      },
      {
        $set: {
          status,
          ...(status === "blocked" ? { refreshToken: "" } : {}),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email role status lastLogin lastActive");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Active employee not found.",
      });
    }

    await EmployeeProfile.updateOne(
      { user: employee._id },
      { $set: { isActive: status === "active" } }
    );

    return res.json({
      success: true,
      message: `Employee ${status === "active" ? "activated" : "blocked"} successfully.`,
      employee,
    });
  } catch (error) {
    return serverError(res, error, "Unable to update employee status.");
  }
};

export const removeEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    const employee = await User.findOne({
      _id: id,
      role: "employee",
      isDeleted: { $ne: true },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Active employee not found.",
      });
    }

    // Soft delete: preserves the account record and its activity history.
    employee.isDeleted = true;
    employee.status = "deleted";
    employee.refreshToken = "";

    await employee.save();

    await EmployeeProfile.updateOne(
      { user: employee._id },
      { $set: { isActive: false } }
    );

    return res.json({
      success: true,
      message: "Employee removed from active access.",
    });
  } catch (error) {
    return serverError(res, error, "Unable to remove employee.");
  }
};

export const getEmployeeActivity = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 50)
    );

    const [activities, total] = await Promise.all([
      ActivityLog.find({
        actorRole: { $in: ["employee", "control", "admin", "superadmin", "super_admin"] }
      })
        .populate("actor", "name email role isDeleted")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      ActivityLog.countDocuments({
        actorRole: { $in: ["employee", "control", "admin", "superadmin", "super_admin"] }
      }),
    ]);

    return res.json({
      success: true,
      activities,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return serverError(
      res,
      error,
      "Unable to load employee activity."
    );
  }
};