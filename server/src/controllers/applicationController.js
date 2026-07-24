import Application from "../models/Application.js";

// =============================
// Apply Internship
// =============================
export const applyInternship = async (req, res) => {
  try {
    const {
      student,
      internship,
      resume,
      coverLetter,
      portfolio,
    } = req.body;

    // Check if already applied
    const existing = await Application.findOne({
      student,
      internship,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this internship.",
      });
    }

    const application = await Application.create({
      student,
      internship,
      resume,
      coverLetter,
      portfolio,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Student Applications
// =============================
export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.params.studentId,
    })
      .populate("internship")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Applications (Admin)
// =============================
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Status (Admin)
// =============================
export const updateApplicationStatus = async (req, res) => {
  try {
    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application updated.",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};