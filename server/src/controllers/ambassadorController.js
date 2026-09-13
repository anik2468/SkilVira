import AmbassadorProfile from "../models/AmbassadorProfile.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";
import Referral from "../models/Referral.js";
import Payment from "../models/Payment.js";

// ======================================
// Helpers
// ======================================

const DEFAULT_COMMISSION_RATE = 15;

const getReferralLink = (referralCode) => {
  if (!referralCode) return "";

  const serverUrl =
    process.env.SERVER_PUBLIC_URL ||
    "http://localhost:5000";

  return `${serverUrl}/api/referrals/click/${referralCode}`;
};

const getUserId = (req) =>
  req.user?.id ||
  req.user?._id ||
  req.user?.userId ||
  req.params.userId ||
  null;

// ======================================
// Payment Status Helpers
// ======================================

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase();

const isSuccessfulPayment = (payment) => {
  const status = normalizeStatus(payment?.status);

  return [
    "paid",
    "approved",
    "verified",
    "success",
    "successful",
    "completed",
    "captured",
  ].includes(status);
};

const isRejectedPayment = (payment) => {
  const status = normalizeStatus(payment?.status);

  return [
    "rejected",
    "failed",
    "cancelled",
    "canceled",
    "declined",
  ].includes(status);
};

const getPaymentAmount = (payment) => {
  const finalAmount = Number(payment?.finalAmount);

  if (
    Number.isFinite(finalAmount) &&
    finalAmount > 0
  ) {
    return finalAmount;
  }

  const originalAmount = Number(
    payment?.originalAmount
  );

  if (
    Number.isFinite(originalAmount) &&
    originalAmount > 0
  ) {
    return originalAmount;
  }

  return 0;
};

const getCommission = (
  amount,
  commissionRate
) => {
  const numericAmount = Number(amount) || 0;
  const numericRate =
    Number(commissionRate) || 0;

  return Number(
    (
      (numericAmount * numericRate) /
      100
    ).toFixed(2)
  );
};

// ======================================
// Revenue Calculator
// ======================================

const calculateAmbassadorRevenue = ({
  payments = [],
  referredStudentIds = [],
  commissionRate = DEFAULT_COMMISSION_RATE,
}) => {
  const studentIdSet = new Set(
    referredStudentIds.map((id) =>
      String(id)
    )
  );

  let totalRevenueGenerated = 0;
  let totalCommissionEarned = 0;

  let potentialRevenue = 0;
  let potentialCommission = 0;

  const successfulPayments = [];
  const pendingPayments = [];

  payments.forEach((payment) => {
    const studentId = payment?.student
      ? String(payment.student)
      : "";

    // Ambassador ke referred students se related
    // payment hi count hoga.
    if (
      studentId &&
      !studentIdSet.has(studentId)
    ) {
      return;
    }

    const amount =
      getPaymentAmount(payment);

    if (amount <= 0) return;

    if (isSuccessfulPayment(payment)) {
      const commission =
        getCommission(
          amount,
          commissionRate
        );

      totalRevenueGenerated += amount;
      totalCommissionEarned += commission;

      successfulPayments.push({
        paymentId: payment._id,
        studentId:
          payment.student || null,
        amount,
        commission,
        status: payment.status || "",
      });

      return;
    }

    if (!isRejectedPayment(payment)) {
      const commission =
        getCommission(
          amount,
          commissionRate
        );

      potentialRevenue += amount;
      potentialCommission += commission;

      pendingPayments.push({
        paymentId: payment._id,
        studentId:
          payment.student || null,
        amount,
        commission,
        status: payment.status || "",
      });
    }
  });

  totalRevenueGenerated = Number(
    totalRevenueGenerated.toFixed(2)
  );

  totalCommissionEarned = Number(
    totalCommissionEarned.toFixed(2)
  );

  potentialRevenue = Number(
    potentialRevenue.toFixed(2)
  );

  potentialCommission = Number(
    potentialCommission.toFixed(2)
  );

  return {
    commissionRate,

    totalRevenueGenerated,
    totalCommissionEarned,

    potentialRevenue,
    potentialCommission,

    totalRevenueOpportunity: Number(
      (
        totalRevenueGenerated +
        potentialRevenue
      ).toFixed(2)
    ),

    totalCommissionOpportunity:
      Number(
        (
          totalCommissionEarned +
          potentialCommission
        ).toFixed(2)
      ),

    successfulPayments,
    pendingPayments,
  };
};

// ======================================
// Get Ambassador Profile
// ======================================

export const getAmbassadorProfile =
  async (req, res) => {
    try {
      const userId =
        req.params.userId;

      const profile =
        await AmbassadorProfile.findOne({
          user: userId,
        }).populate(
          "user",
          "name email role avatar phone referralCode ambassadorApproved status createdAt"
        );

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Ambassador profile not found.",
        });
      }

      const code =
        profile.referralCode ||
        profile.user?.referralCode ||
        "";

      return res.json({
        success: true,

        profile: {
          ...profile.toObject(),

          referralCode: code,

          referralLink:
            getReferralLink(code),

          collegeId:
            profile.collegeId || "",

          collegeName:
            profile.college || "",
        },
      });
    } catch (error) {
      console.error(
        "GET AMBASSADOR PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// Save Ambassador Profile
// ======================================

export const saveAmbassadorProfile =
  async (req, res) => {
    try {
      const userId =
        req.params.userId;

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }

      if (
        user.role !==
        "ambassador"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User is not an ambassador.",
        });
      }

      let profile =
        await AmbassadorProfile.findOne({
          user: userId,
        });

      const allowedFields = [
        "college",
        "university",
        "collegeId",
        "universityId",
        "city",
        "state",
        "phone",
        "bio",
        "instagram",
        "linkedin",
        "github",
      ];

      if (!profile) {
        profile =
          new AmbassadorProfile({
            user: userId,
          });
      }

      allowedFields.forEach(
        (field) => {
          if (
            Object.prototype.hasOwnProperty.call(
              req.body,
              field
            )
          ) {
            profile[field] =
              req.body[field] ?? "";
          }
        }
      );

      const fields = [
        "college",
        "university",
        "city",
        "state",
        "phone",
        "bio",
        "linkedin",
        "github",
      ];

      const completed =
        fields.filter(
          (field) =>
            profile[field] &&
            String(
              profile[field]
            ).trim() !== ""
        ).length;

      profile.profileCompleted =
        Math.round(
          (completed /
            fields.length) *
            100
        );

      await profile.save();

      return res.json({
        success: true,
        message:
          "Ambassador profile saved.",
        profile,
      });
    } catch (error) {
      console.error(
        "SAVE AMBASSADOR PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// Ambassador Dashboard
// ======================================

export const ambassadorDashboard =
  async (req, res) => {
    try {
      const userId =
        req.params.userId;

      const profile =
        await AmbassadorProfile.findOne({
          user: userId,
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Profile not found.",
        });
      }

      // ==================================
      // Referred Students
      // ==================================

      const students =
        await User.find({
          referredBy:
            profile.user,

          role: "student",

          isDeleted: {
            $ne: true,
          },
        }).select(
          "name email avatar createdAt"
        );

      const studentIds =
        students.map(
          (student) =>
            student._id
        );

      // ==================================
      // Dashboard Base Counts
      // ==================================

      const [
        clicks,
        enrollments,
        certificates,
        payments,
      ] = await Promise.all([
        Referral.countDocuments({
          ambassador:
            profile.user,

          clicked: true,

          student: null,

          isDeleted: false,
        }),

        Enrollment.countDocuments({
          student: {
            $in: studentIds,
          },

          isDeleted: false,

          status: {
            $in: [
              "Active",
              "Completed",
            ],
          },
        }),

        Certificate.countDocuments({
          student: {
            $in: studentIds,
          },

          verified: {
            $ne: false,
          },
        }),

        Payment.find({
          ambassador:
            profile.user,

          isDeleted: {
            $ne: true,
          },
        }).lean(),
      ]);

      // ==================================
      // Revenue
      // ==================================

      const commissionRate =
        DEFAULT_COMMISSION_RATE;

      const revenue =
        calculateAmbassadorRevenue({
          payments,

          referredStudentIds:
            studentIds,

          commissionRate,
        });

      // ==================================
      // Referral Link
      // ==================================

      const referralLink =
        getReferralLink(
          profile.referralCode
        );

      // ==================================
      // Stats
      // ==================================

      const stats = {
        totalReferrals:
          students.length,

        successfulReferrals:
          enrollments,

        certificates,

        clicks,

        registrations:
          students.length,

        enrollments,

        rewardPoints:
          profile.rewardPoints,

        rank:
          profile.rank,

        // Revenue
        commissionRate:
          revenue.commissionRate,

        totalRevenueGenerated:
          revenue.totalRevenueGenerated,

        totalCommissionEarned:
          revenue.totalCommissionEarned,

        potentialRevenue:
          revenue.potentialRevenue,

        potentialCommission:
          revenue.potentialCommission,

        totalRevenueOpportunity:
          revenue.totalRevenueOpportunity,

        totalCommissionOpportunity:
          revenue.totalCommissionOpportunity,
      };

      return res.json({
        success: true,

        stats,

        revenue: {
          commissionRate:
            revenue.commissionRate,

          generated:
            revenue.totalRevenueGenerated,

          earned:
            revenue.totalCommissionEarned,

          potential:
            revenue.potentialRevenue,

          potentialEarnings:
            revenue.potentialCommission,

          totalOpportunity:
            revenue.totalRevenueOpportunity,

          totalEarningsOpportunity:
            revenue.totalCommissionOpportunity,
        },

        referral: {
          code:
            profile.referralCode,

          referralCode:
            profile.referralCode,

          link:
            referralLink,

          referralLink,
        },

        students,
      });
    } catch (error) {
      console.error(
        "AMBASSADOR DASHBOARD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// Detailed Referral Students
// ======================================

export const getAmbassadorStudents =
  async (req, res) => {
    try {
      const userId =
        req.params.userId;

      const profile =
        await AmbassadorProfile.findOne({
          user: userId,
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Ambassador profile not found.",
        });
      }

      // ==================================
      // Students
      // ==================================

      const students =
        await User.find({
          referredBy:
            profile.user,

          role: "student",

          isDeleted: {
            $ne: true,
          },
        })
          .select(
            "name email avatar phone createdAt"
          )
          .sort({
            createdAt: -1,
          });

      const studentIds =
        students.map(
          (student) =>
            student._id
        );

      // ==================================
      // Enrollments
      // ==================================

      const enrollments =
        await Enrollment.find({
          student: {
            $in: studentIds,
          },

          isDeleted: false,
        })
          .populate(
            "course",
            "title price thumbnail"
          )
          .populate(
            "internship",
            "title company price internshipImage"
          )
          .populate(
            "payment",
            "finalAmount originalAmount discountAmount status referralCode ambassador"
          )
          .sort({
            enrollmentDate: -1,
          });

      // ==================================
      // Referrals
      // ==================================

      const referrals =
        await Referral.find({
          ambassador:
            profile.user,

          student: {
            $in: studentIds,
          },

          isDeleted: false,
        }).sort({
          createdAt: -1,
        });

      // ==================================
      // Payments
      // ==================================

      const payments =
        await Payment.find({
          ambassador:
            profile.user,

          student: {
            $in: studentIds,
          },

          isDeleted: {
            $ne: true,
          },
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      // ==================================
      // Revenue
      // ==================================

      const commissionRate =
        DEFAULT_COMMISSION_RATE;

      const revenue =
        calculateAmbassadorRevenue({
          payments,

          referredStudentIds:
            studentIds,

          commissionRate,
        });

      // ==================================
      // Maps
      // ==================================

      const enrollmentMap =
        new Map();

      enrollments.forEach(
        (enrollment) => {
          const key =
            String(
              enrollment.student
            );

          if (
            !enrollmentMap.has(
              key
            )
          ) {
            enrollmentMap.set(
              key,
              []
            );
          }

          enrollmentMap
            .get(key)
            .push(enrollment);
        }
      );

      const referralMap =
        new Map();

      referrals.forEach(
        (referral) => {
          referralMap.set(
            String(
              referral.student
            ),
            referral
          );
        }
      );

      // ==================================
      // Payment Map
      // ==================================

      const paymentMap =
        new Map();

      payments.forEach(
        (payment) => {
          const key =
            String(
              payment.student
            );

          if (
            !paymentMap.has(key)
          ) {
            paymentMap.set(
              key,
              []
            );
          }

          paymentMap
            .get(key)
            .push(payment);
        }
      );

      // ==================================
      // Student Result
      // ==================================

      const result = [];

      students.forEach(
        (student) => {
          const key =
            String(student._id);

          const studentEnrollments =
            enrollmentMap.get(
              key
            ) || [];

          const studentReferral =
            referralMap.get(
              key
            ) || null;

          const studentPayments =
            paymentMap.get(
              key
            ) || [];

          // ------------------------------
          // Student Revenue
          // ------------------------------

          let studentGenerated =
            0;

          let studentEarned =
            0;

          let studentPotential =
            0;

          let studentPotentialCommission =
            0;

          studentPayments.forEach(
            (payment) => {
              const amount =
                getPaymentAmount(
                  payment
                );

              if (amount <= 0) {
                return;
              }

              if (
                isSuccessfulPayment(
                  payment
                )
              ) {
                studentGenerated +=
                  amount;

                studentEarned +=
                  getCommission(
                    amount,
                    commissionRate
                  );
              } else if (
                !isRejectedPayment(
                  payment
                )
              ) {
                studentPotential +=
                  amount;

                studentPotentialCommission +=
                  getCommission(
                    amount,
                    commissionRate
                  );
              }
            }
          );

          // =================================
          // No enrollment
          // =================================

          if (
            studentEnrollments.length ===
            0
          ) {
            result.push({
              _id:
                student._id,

              studentId:
                student._id,

              name:
                student.name,

              fullName:
                student.name,

              email:
                student.email,

              avatar:
                student.avatar,

              phone:
                student.phone,

              createdAt:
                student.createdAt,

              referralCode:
                profile.referralCode,

              status:
                "Pending",

              enrollmentStatus:
                "Pending",

              enrolled:
                false,

              isEnrolled:
                false,

              courseName:
                "",

              course:
                null,

              internship:
                null,

              payment:
                studentPayments[0] ||
                null,

              referral:
                studentReferral,

              // Revenue
              amountPaid:
                studentGenerated,

              revenueGenerated:
                studentGenerated,

              commissionRate,

              commissionEarned:
                Number(
                  studentEarned.toFixed(
                    2
                  )
                ),

              potentialRevenue:
                Number(
                  studentPotential.toFixed(
                    2
                  )
                ),

              potentialCommission:
                Number(
                  studentPotentialCommission.toFixed(
                    2
                  )
                ),
            });

            return;
          }

          // =================================
          // Enrolled Students
          // =================================

          studentEnrollments.forEach(
            (enrollment) => {
              const isEnrolled =
                [
                  "Active",
                  "Completed",
                ].includes(
                  enrollment.status
                );

              const course =
                enrollment.course;

              const internship =
                enrollment.internship;

              const payment =
                enrollment.payment;

              result.push({
                _id:
                  `${student._id}-${enrollment._id}`,

                studentId:
                  student._id,

                name:
                  student.name,

                fullName:
                  student.name,

                email:
                  student.email,

                avatar:
                  student.avatar,

                phone:
                  student.phone,

                createdAt:
                  student.createdAt,

                referralCode:
                  profile.referralCode,

                status:
                  enrollment.status,

                enrollmentStatus:
                  enrollment.status,

                enrolled:
                  isEnrolled,

                isEnrolled,

                courseName:
                  course?.title ||
                  internship?.title ||
                  "",

                courseId:
                  course?._id ||
                  null,

                internshipId:
                  internship?._id ||
                  null,

                course,

                internship,

                enrollment: {
                  _id:
                    enrollment._id,

                  status:
                    enrollment.status,

                  progress:
                    enrollment.progress,

                  enrollmentDate:
                    enrollment.enrollmentDate,

                  startDate:
                    enrollment.startDate,

                  completionDate:
                    enrollment.completionDate,
                },

                enrolledAt:
                  enrollment.enrollmentDate,

                amountPaid:
                  payment?.finalAmount ??
                  null,

                paymentStatus:
                  payment?.status ||
                  "",

                payment,

                referral:
                  studentReferral,

                // Revenue
                revenueGenerated:
                  Number(
                    studentGenerated.toFixed(
                      2
                    )
                  ),

                commissionRate,

                commissionEarned:
                  Number(
                    studentEarned.toFixed(
                      2
                    )
                  ),

                potentialRevenue:
                  Number(
                    studentPotential.toFixed(
                      2
                    )
                  ),

                potentialCommission:
                  Number(
                    studentPotentialCommission.toFixed(
                      2
                    )
                  ),
              });
            }
          );
        }
      );

      // ======================================
      // Analytics
      // ======================================

      const clicks =
        await Referral.countDocuments({
          ambassador:
            profile.user,

          clicked: true,

          student: null,

          isDeleted: false,
        });

      const registrations =
        students.length;

      const enrollmentCount =
        enrollments.filter(
          (item) =>
            [
              "Active",
              "Completed",
            ].includes(
              item.status
            )
        ).length;

      const completed =
        enrollments.filter(
          (item) =>
            item.status ===
            "Completed"
        ).length;

      return res.json({
        success: true,

        data: {
          analytics: {
            clicks,

            registrations,

            enrollments:
              enrollmentCount,

            completed,

            commissionRate:

              revenue.commissionRate,

            totalRevenueGenerated:
              revenue.totalRevenueGenerated,

            totalCommissionEarned:
              revenue.totalCommissionEarned,

            potentialRevenue:
              revenue.potentialRevenue,

            potentialCommission:
              revenue.potentialCommission,

            totalRevenueOpportunity:
              revenue.totalRevenueOpportunity,

            totalCommissionOpportunity:
              revenue.totalCommissionOpportunity,
          },

          revenue: {
            commissionRate:
              revenue.commissionRate,

            generated:
              revenue.totalRevenueGenerated,

            earned:
              revenue.totalCommissionEarned,

            potential:
              revenue.potentialRevenue,

            potentialEarnings:
              revenue.potentialCommission,

            totalOpportunity:
              revenue.totalRevenueOpportunity,

            totalEarningsOpportunity:
              revenue.totalCommissionOpportunity,
          },

          referralCode:
            profile.referralCode,

          referralLink:
            getReferralLink(
              profile.referralCode
            ),

          rewardPoints:
            profile.rewardPoints,

          students: result,
        },
      });
    } catch (error) {
      console.error(
        "GET AMBASSADOR STUDENTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// Leaderboard
// ======================================

export const getLeaderboard =
  async (req, res) => {
    try {
      const ambassadors =
        await AmbassadorProfile.find({
          isActive: true,
        })
          .populate(
            "user",
            "name email avatar"
          )
          .sort({
            rewardPoints: -1,
          })
          .limit(20);

      return res.json({
        success: true,
        ambassadors,
      });
    } catch (error) {
      console.error(
        "LEADERBOARD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };