import Company from "../models/Company.js";

// ======================================
// Get Company
// ======================================
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      recruiter: req.params.userId,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Create / Update Company
// ======================================
export const saveCompany = async (req, res) => {
  try {
    let company = await Company.findOne({
      recruiter: req.params.userId,
    });

    if (company) {
      Object.assign(company, req.body);
    } else {
      company = new Company({
        recruiter: req.params.userId,
        ...req.body,
      });
    }

    const fields = [
      "companyName",
      "logo",
      "website",
      "email",
      "phone",
      "industry",
      "headquarters",
      "description",
      "linkedin",
    ];

    let completed = 0;

    fields.forEach((field) => {
      if (
        company[field] &&
        company[field] !== ""
      ) {
        completed++;
      }
    });

    company.profileCompleted = Math.round(
      (completed / fields.length) * 100
    );

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company profile saved successfully.",
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Company
// ======================================
export const deleteCompany = async (req, res) => {
  try {
    await Company.findOneAndDelete({
      recruiter: req.params.userId,
    });

    res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Companies
// ======================================
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};