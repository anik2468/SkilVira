import mongoose from "mongoose";
import University from "../models/University.js";

const validId = (id) => mongoose.Types.ObjectId.isValid(String(id || ""));

const allowedFields = [
  "name",
  "university",
  "location",
  "email",
  "phone",
  "website",
  "address",
  "logo",
  "description",
];

const pickFields = (body = {}) => {
  const data = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  if (!data.name && body.collegeName) {
    data.name = String(body.collegeName).trim();
  }

  if (!data.name && body.university) {
    data.name = String(body.university).trim();
  }

  if (!data.location && body.city) {
    data.location = String(body.city).trim();
  }

  return data;
};

const sendServerError = (res, error, message) => {
  console.error(`${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: universities.length,
      universities,
      colleges: universities,
      data: universities,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to load colleges and universities."
    );
  }
};

export const getUniversityById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    return res.json({
      success: true,
      university,
      college: university,
      data: university,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to load college/university."
    );
  }
};

export const createUniversity = async (req, res) => {
  try {
    const fields = pickFields(req.body);

    if (!fields.name) {
      return res.status(400).json({
        success: false,
        message: "College/university name is required.",
      });
    }

    const university = await University.create({
      ...fields,
      createdBy: req.user?.id || req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "College/university created successfully.",
      university,
      college: university,
      data: university,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to create college/university."
    );
  }
};

export const updateUniversity = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const fields = pickFields(req.body);

    const university = await University.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    return res.json({
      success: true,
      message: "College/university updated successfully.",
      university,
      college: university,
      data: university,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to update college/university."
    );
  }
};

export const deleteUniversity = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const university = await University.findByIdAndDelete(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    return res.json({
      success: true,
      message: "College/university deleted successfully.",
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to delete college/university."
    );
  }
};

export const verifyUniversity = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          verified: true,
          blocked: false,
          status: "verified",
        },
      },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    return res.json({
      success: true,
      message: "College/university verified successfully.",
      university,
      college: university,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to verify college/university."
    );
  }
};

export const blockUniversity = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      { $set: { blocked: true, status: "blocked" } },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    return res.json({
      success: true,
      message: "College/university blocked.",
      university,
      college: university,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to block college/university."
    );
  }
};

export const unblockUniversity = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college/university ID.",
      });
    }

    const current = await University.findById(req.params.id);

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "College/university not found.",
      });
    }

    current.blocked = false;
    current.status = current.verified ? "verified" : "pending";

    await current.save();

    return res.json({
      success: true,
      message: "College/university unblocked.",
      university: current,
      college: current,
    });
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Unable to unblock college/university."
    );
  }
};