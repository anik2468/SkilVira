import Internship from "../models/Internship.js";

// ===============================
// Create Internship
// ===============================
export const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);

    res.status(201).json({
      success: true,
      message: "Internship created successfully.",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Internships
// ===============================
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Single Internship
// ===============================
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Internship
// ===============================
export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship updated successfully.",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Internship
// ===============================
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};