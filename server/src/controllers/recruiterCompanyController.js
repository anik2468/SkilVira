import mongoose from "mongoose";
import Company from "../models/Company.js";

const normalizeCompany = (company, recruiterId) => {
  const data = company?.toObject
    ? company.toObject()
    : company || {};

  return {
    ...data,
    recruiter: String(data.recruiter || recruiterId),
    name: data.companyName || data.name || "",
    companyName: data.companyName || data.name || "",
    logo: data.logo || data.companyLogo || "",
    founded: data.founded ?? data.foundedYear ?? "",
    employees: data.employees ?? data.companySize ?? "",
    description: data.description || data.about || "",
  };
};

const respondError = (res, error, message) => {
  console.error(`${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getRecruiterCompany = async (req, res) => {
  try {
    const recruiterId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const company = await Company.findOne({
      recruiter: recruiterId,
    });

    // A new recruiter can open an empty company form before saving it.
    const result = normalizeCompany(
      company || {},
      recruiterId
    );

    return res.status(200).json({
      success: true,
      company: result,
      data: result,
    });
  } catch (error) {
    return respondError(
      res,
      error,
      "Unable to load company profile."
    );
  }
};

export const saveRecruiterCompany = async (req, res) => {
  try {
    const recruiterId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const body = req.body || {};

    // The current React page sends "name"; MongoDB requires "companyName".
    const companyName = String(
      body.companyName || body.name || ""
    ).trim();

    const existing = await Company.findOne({
      recruiter: recruiterId,
    });

    if (!companyName && !existing) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    const updates = {};

    const fields = [
      "website",
      "email",
      "phone",
      "industry",
      "headquarters",
      "linkedin",
      "twitter",
      "facebook",
      "instagram",
    ];

    if (companyName) {
      updates.companyName = companyName;
    }

    // Map fields sent by the frontend to the database schema.
    if (body.logo !== undefined) {
      updates.logo = String(body.logo || "");
    }

    if (body.description !== undefined || body.about !== undefined) {
      updates.description = String(
        body.description ?? body.about ?? ""
      );
    }

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates[field] = String(body[field] ?? "").trim();
      }
    }

    if (body.founded !== undefined && body.founded !== "") {
      const founded = Number(body.founded);

      if (
        !Number.isInteger(founded) ||
        founded < 1800 ||
        founded > new Date().getFullYear() + 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid company founding year.",
        });
      }

      updates.founded = founded;
    } else if (body.founded === "") {
      updates.founded = undefined;
    }

    if (body.employees !== undefined) {
      updates.employees = String(body.employees ?? "").trim();
    }

    const company = existing
      ? Object.assign(existing, updates)
      : new Company({
          recruiter: recruiterId,
          ...updates,
        });

    const completionFields = [
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

    const completed = completionFields.filter(
      (field) => String(company[field] || "").trim()
    ).length;

    company.profileCompleted = Math.round(
      (completed / completionFields.length) * 100
    );

    // Recruiter ID is always determined by the authenticated route,
    // never by the request body's recruiter field.
    company.recruiter = recruiterId;

    await company.save();

    const result = normalizeCompany(company, recruiterId);

    return res.status(200).json({
      success: true,
      message: "Company profile saved successfully.",
      company: result,
      data: result,
    });
  } catch (error) {
    return respondError(
      res,
      error,
      "Unable to save company profile."
    );
  }
};