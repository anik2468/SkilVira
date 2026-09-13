import CertificateTemplate from "../models/CertificateTemplate.js";

// =====================================================
// HELPERS
// =====================================================

const parseJSON = (value, fallback = {}) => {
  if (!value) return fallback;

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value).toLowerCase() === "true";
};

const normalizeCourseId = (value) => {
  if (!value || value === "null" || value === "undefined") {
    return null;
  }

  return value;
};

// =====================================================
// CREATE TEMPLATE
// =====================================================

export const createTemplate = async (req, res) => {
  try {
    const {
      name,
      category = "certificate",
      type = "course",
      courseId,
      requiresApproval,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Template name is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate template file is required.",
      });
    }

    const fields = parseJSON(req.body.fields, {});
    const positions = parseJSON(req.body.positions, {});

    const createdBy =
      req.user?.id ||
      req.user?._id ||
      req.body.createdBy ||
      null;

    const template = await CertificateTemplate.create({
      name: name.trim(),

      category,

      type,

      courseId: normalizeCourseId(courseId),

      templateFile: `/uploads/certificate/${req.file.filename}`,

      fields,

      positions,

      requiresApproval: parseBoolean(
        requiresApproval,
        true
      ),

      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate template created successfully.",
      template,
    });
  } catch (error) {
    console.error(
      "CREATE CERTIFICATE TEMPLATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create certificate template.",
    });
  }
};

// =====================================================
// GET ACTIVE TEMPLATE
// =====================================================

export const getTemplate = async (req, res) => {
  try {
    const template =
      await CertificateTemplate.findOne({
        isActive: true,
        category: "certificate",
      })
        .populate("courseId", "title")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    console.error(
      "GET ACTIVE CERTIFICATE TEMPLATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch active certificate template.",
    });
  }
};

// =====================================================
// GET ALL TEMPLATES
// =====================================================

export const getTemplates = async (req, res) => {
  try {
    const templates =
      await CertificateTemplate.find()
        .populate("courseId", "title")
        .populate("createdBy", "name email")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error(
      "GET CERTIFICATE TEMPLATES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch certificate templates.",
    });
  }
};

// =====================================================
// GET SINGLE TEMPLATE
// =====================================================

export const getTemplateById = async (
  req,
  res
) => {
  try {
    const template =
      await CertificateTemplate.findById(
        req.params.id
      )
        .populate("courseId", "title")
        .populate("createdBy", "name email");

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Certificate template not found.",
      });
    }

    return res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    console.error(
      "GET CERTIFICATE TEMPLATE BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch certificate template.",
    });
  }
};

// =====================================================
// UPDATE TEMPLATE
// =====================================================

export const updateTemplate = async (
  req,
  res
) => {
  try {
    const template =
      await CertificateTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Certificate template not found.",
      });
    }

    const {
      name,
      category,
      type,
      courseId,
      requiresApproval,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Template name cannot be empty.",
        });
      }

      template.name = name.trim();
    }

    if (category !== undefined) {
      template.category = category;
    }

    if (type !== undefined) {
      template.type = type;
    }

    if (courseId !== undefined) {
      template.courseId =
        normalizeCourseId(courseId);
    }

    if (requiresApproval !== undefined) {
      template.requiresApproval =
        parseBoolean(
          requiresApproval,
          template.requiresApproval
        );
    }

    if (req.body.fields !== undefined) {
      template.fields = parseJSON(
        req.body.fields,
        template.fields || {}
      );
    }

    if (req.body.positions !== undefined) {
      template.positions = parseJSON(
        req.body.positions,
        template.positions || {}
      );
    }

    // Replace uploaded template file
    if (req.file) {
      template.templateFile =
        `/uploads/certificate/${req.file.filename}`;
    }

    await template.save();

    const updatedTemplate =
      await CertificateTemplate.findById(
        template._id
      ).populate("courseId", "title");

    return res.status(200).json({
      success: true,
      message:
        "Certificate template updated successfully.",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error(
      "UPDATE CERTIFICATE TEMPLATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update certificate template.",
    });
  }
};

// =====================================================
// DELETE / DEACTIVATE TEMPLATE
// =====================================================

export const deleteTemplate = async (
  req,
  res
) => {
  try {
    const template =
      await CertificateTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Certificate template not found.",
      });
    }

    template.isActive = false;

    await template.save();

    return res.status(200).json({
      success: true,
      message:
        "Certificate template deactivated successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CERTIFICATE TEMPLATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to deactivate certificate template.",
    });
  }
};