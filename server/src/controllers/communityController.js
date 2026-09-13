import Community from "../models/Community.js";
import User from "../models/User.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";

const getRequestUserId =
  (req) =>
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    req.body?.ambassador ||
    req.body?.createdBy ||
    req.params?.userId ||
    null;

// ======================================
// CREATE COMMUNITY
// Only college-linked ambassador
// ======================================

export const createCommunity =
  async (req, res) => {
    try {
      const userId =
        getRequestUserId(req);

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Ambassador authentication required.",
        });
      }

      if (
        user.role !==
        "ambassador"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only ambassadors can create communities.",
        });
      }

      if (
        !user.ambassadorApproved
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Ambassador approval is required.",
        });
      }

      const profile =
        await AmbassadorProfile.findOne({
          user: user._id,
          isActive: true,
        });

      if (!profile) {
        return res.status(403).json({
          success: false,
          message:
            "Ambassador profile not found.",
        });
      }

      if (
        !profile.college &&
        !profile.collegeId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only a college-linked ambassador can create a college community.",
        });
      }

      const community =
        await Community.create({
          name:
            req.body.name,

          description:
            req.body.description,

          type:
            req.body.type ||
            "student",

          location:
            req.body.location ||
            "",

          ambassador:
            user._id,

          collegeId:
            profile.collegeId ||
            req.body.collegeId ||
            "",

          collegeName:
            profile.college ||
            "",

          universityId:
            profile.universityId ||
            req.body.universityId ||
            "",

          universityName:
            profile.university ||
            "",

          logo:
            req.body.logo ||
            "",

          banner:
            req.body.banner ||
            "",

          rules:
            req.body.rules ||
            "",

          joinMode:
            req.body.joinMode ||
            "open",

          memberCount: 0,

          status: "active",
        });

      community.joinLink =
        `${
          process.env.CLIENT_URL ||
          "http://localhost:5173"
        }/communities/${community._id}`;

      await community.save();

      return res.status(201).json({
        success: true,
        message:
          "Community created successfully.",
        community,
      });
    } catch (error) {
      console.error(
        "CREATE COMMUNITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create community.",
      });
    }
  };

// ======================================
// GET ALL COMMUNITIES
// ======================================

export const getCommunities =
  async (req, res) => {
    try {
      const userId =
        getRequestUserId(req);

      const profile =
        await AmbassadorProfile.findOne({
          user: userId,
        });

      const query = {
        isDeleted: false,
      };

      if (
        profile?.college ||
        profile?.collegeId
      ) {
        query.$or = [
          {
            ambassador:
              userId,
          },
          {
            collegeId:
              profile.collegeId,
          },
          {
            collegeName:
              profile.college,
          },
        ];
      }

      const communities =
        await Community.find(
          query
        )
          .populate(
            "ambassador",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        count:
          communities.length,
        communities,
      });
    } catch (error) {
      console.error(
        "GET COMMUNITIES ERROR:",
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
// GET ONE COMMUNITY
// ======================================

export const getCommunity =
  async (req, res) => {
    try {
      const community =
        await Community.findOne({
          _id: req.params.id,
          isDeleted: false,
        }).populate(
          "ambassador",
          "name email avatar"
        );

      if (!community) {
        return res.status(404).json({
          success: false,
          message:
            "Community not found.",
        });
      }

      return res.json({
        success: true,
        community,
      });
    } catch (error) {
      console.error(
        "GET COMMUNITY ERROR:",
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
// UPDATE COMMUNITY
// Owner ambassador only
// ======================================

export const updateCommunity =
  async (req, res) => {
    try {
      const userId =
        getRequestUserId(req);

      const community =
        await Community.findOne({
          _id: req.params.id,
          isDeleted: false,
        });

      if (!community) {
        return res.status(404).json({
          success: false,
          message:
            "Community not found.",
        });
      }

      if (
        String(
          community.ambassador
        ) !== String(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can manage only your own college community.",
        });
      }

      const fields = [
        "name",
        "description",
        "type",
        "location",
        "logo",
        "banner",
        "rules",
        "joinMode",
        "status",
      ];

      fields.forEach(
        (field) => {
          if (
            Object.prototype.hasOwnProperty.call(
              req.body,
              field
            )
          ) {
            community[field] =
              req.body[field];
          }
        }
      );

      await community.save();

      return res.json({
        success: true,
        message:
          "Community updated successfully.",
        community,
      });
    } catch (error) {
      console.error(
        "UPDATE COMMUNITY ERROR:",
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
// DELETE COMMUNITY
// Owner ambassador only
// ======================================

export const deleteCommunity =
  async (req, res) => {
    try {
      const userId =
        getRequestUserId(req);

      const community =
        await Community.findOne({
          _id: req.params.id,
          isDeleted: false,
        });

      if (!community) {
        return res.status(404).json({
          success: false,
          message:
            "Community not found.",
        });
      }

      if (
        String(
          community.ambassador
        ) !== String(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can delete only your own community.",
        });
      }

      community.isDeleted = true;
      community.status = "archived";

      await community.save();

      return res.json({
        success: true,
        message:
          "Community deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE COMMUNITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };