import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Certificate from "../models/Certificate.js";
import Payment from "../models/Payment.js";
import University from "../models/University.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    const activeRecords = { isDeleted: { $ne: true } };

    const [
      students,
      recruiters,
      colleges,
      admins,
      operationalAdmins,
      employees,
      ambassadors,
      internships,
      applications,
      certificates,
      payments,
      revenueRows,
    ] = await Promise.all([
      User.countDocuments({ ...activeRecords, role: "student" }),
      User.countDocuments({ ...activeRecords, role: "recruiter" }),
      University.countDocuments({ blocked: { $ne: true } }),
      User.countDocuments({ ...activeRecords, role: "control" }),
      User.countDocuments({ ...activeRecords, role: "admin" }),
      User.countDocuments({ ...activeRecords, role: "employee" }),
      User.countDocuments({ ...activeRecords, role: "ambassador" }),
      Internship.countDocuments(activeRecords),
      Application.countDocuments(activeRecords),
      Certificate.countDocuments(activeRecords),
      Payment.countDocuments(activeRecords),
      Payment.aggregate([
        {
          $match: {
            ...activeRecords,
            status: "approved",
            finalAmount: { $type: "number" },
          },
        },
        {
          $project: {
            net: {
              $max: [
                0,
                {
                  $subtract: [
                    "$finalAmount",
                    { $ifNull: ["$ambassadorCommissionAmount", 0] },
                  ],
                },
              ],
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$net" } } },
      ]),
    ]);

    const netRevenue = Number(revenueRows?.[0]?.total || 0);

    return res.status(200).json({
      success: true,
      stats: {
        students,
        recruiters,
        colleges,
        admins,
        operationalAdmins,
        employees,
        ambassadors,
        internships,
        applications,
        certificates,
        payments,
        netRevenue,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard statistics.",
    });
  }
};