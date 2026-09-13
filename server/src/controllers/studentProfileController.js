import StudentProfile from "../models/StudentProfile.js";

// ==============================
// Calculate Profile Completion
// ==============================
const calculateCompletion = (profile) => {
  const fields = [
    "profilePicture",
    "phone",
    "bio",
    "gender",
    "dateOfBirth",
    "address",
    "city",
    "state",
    "country",
    "pincode",
    "college",
    "university",
    "degree",
    "branch",
    "semester",
    "passingYear",
    "cgpa",
    "resume",
    "github",
    "linkedin",
    "preferredRole",
    "preferredLocation",
    "workMode",
  ];

  let completed = 0;

  fields.forEach((field) => {
    if (profile[field]) completed++;
  });

  if (profile.skills?.length) completed++;
  if (profile.projects?.length) completed++;
  if (profile.certificates?.length) completed++;
  if (profile.languages?.length) completed++;

  const total = fields.length + 4;

  return Math.round((completed / total) * 100);
};

// ==============================
// Get Profile
// ==============================
export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.params.userId,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Create / Update Profile
// ==============================
export const saveStudentProfile = async (req, res) => {
  try {
    const data = req.body;

    let profile = await StudentProfile.findOne({
      user: req.params.userId,
    });

    if (profile) {
      Object.assign(profile, data);
    } else {
      profile = new StudentProfile({
        ...data,
        user: req.params.userId,
      });
    }

    profile.profileCompleted =
      calculateCompletion(profile);

    await profile.save();

    res.json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Delete Profile
// ==============================
export const deleteStudentProfile =
  async (req, res) => {
    try {
      await StudentProfile.findOneAndDelete({
        user: req.params.userId,
      });

      res.json({
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };