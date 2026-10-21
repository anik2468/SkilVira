import ReportTemplate from "../models/ReportTemplate.js";

// =====================================================
// HELPERS
// =====================================================

const parseBoolean = (
  value,
  defaultValue = true
) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
};

const parseJson = (
  value,
  fallback = {}
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const validTypes = [
  "course",
  "internship",
  "achievement",
];

const populateTemplate = async (id) => {
  return ReportTemplate.findById(id)
    .populate(
      "courseId",
      "title"
    )
    .populate(
      "internshipId",
      "title company"
    )
    .populate(
      "createdBy",
      "name email"
    );
};

// =====================================================
// CREATE REPORT TEMPLATE
// =====================================================

export const createReportTemplate =
  async (req, res) => {
    try {
      const {
        name,
        type,
        courseId,
        internshipId,
        fields,
        positions,
        requiresApproval,
      } = req.body;

      // -----------------------------------------------
      // NAME
      // -----------------------------------------------

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Template name is required.",
        });
      }

      // -----------------------------------------------
      // TYPE
      // -----------------------------------------------

      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid report template type.",
        });
      }

      // -----------------------------------------------
      // COURSE
      // -----------------------------------------------

      if (
        type === "course" &&
        !courseId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a course.",
        });
      }

      // -----------------------------------------------
      // INTERNSHIP
      // -----------------------------------------------

      if (
        type === "internship" &&
        !internshipId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select an internship.",
        });
      }

      // -----------------------------------------------
      // FILE
      // -----------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Report template file is required.",
        });
      }

      // -----------------------------------------------
      // PARSE FIELDS
      // -----------------------------------------------

      const parsedFields =
        parseJson(fields, {});

      if (parsedFields === null) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid fields configuration.",
        });
      }

      // -----------------------------------------------
      // PARSE POSITIONS
      // -----------------------------------------------

      const parsedPositions =
        parseJson(positions, {});

      if (parsedPositions === null) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid positions configuration.",
        });
      }

      // -----------------------------------------------
      // CREATE
      // -----------------------------------------------

      const template =
        await ReportTemplate.create({
          name: name.trim(),

          type,

          courseId:
            type === "course"
              ? courseId
              : null,

          internshipId:
            type === "internship"
              ? internshipId
              : null,

          templateFile:
            `/uploads/${req.file.filename}`,

          fields:
            parsedFields,

          positions:
            parsedPositions,

          requiresApproval:
            parseBoolean(
              requiresApproval,
              true
            ),

          isActive: true,

          createdBy:
            req.user?.id ||
            req.user?._id ||
            null,
        });

      const result =
        await populateTemplate(
          template._id
        );

      return res.status(201).json({
        success: true,

        message:
          "Report template created successfully.",

        template: result,
      });
    } catch (error) {
      console.error(
        "CREATE REPORT TEMPLATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create report template.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// GET ALL ACTIVE REPORT TEMPLATES
// =====================================================

export const getReportTemplates =
  async (req, res) => {
    try {
      const {
        type,
        courseId,
        internshipId,
        includeInactive,
      } = req.query;

      const filter = {};

      if (
        String(
          includeInactive
        ).toLowerCase() !== "true"
      ) {
        filter.isActive = true;
      }

      if (type) {
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid report template type.",
          });
        }

        filter.type = type;
      }

      if (courseId) {
        filter.courseId = courseId;
      }

      if (internshipId) {
        filter.internshipId =
          internshipId;
      }

      const templates =
        await ReportTemplate.find(
          filter
        )
          .populate(
            "courseId",
            "title"
          )
          .populate(
            "internshipId",
            "title company"
          )
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,

        count:
          templates.length,

        templates,
      });
    } catch (error) {
      console.error(
        "GET REPORT TEMPLATES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch report templates.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// GET SINGLE REPORT TEMPLATE
// =====================================================

export const getReportTemplateById =
  async (req, res) => {
    try {
      const template =
        await populateTemplate(
          req.params.id
        );

      if (!template) {
        return res.status(404).json({
          success: false,
          message:
            "Report template not found.",
        });
      }

      return res.status(200).json({
        success: true,
        template,
      });
    } catch (error) {
      console.error(
        "GET REPORT TEMPLATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch report template.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// UPDATE REPORT TEMPLATE
// =====================================================

export const updateReportTemplate =
  async (req, res) => {
    try {
      const template =
        await ReportTemplate.findById(
          req.params.id
        );

      if (!template) {
        return res.status(404).json({
          success: false,
          message:
            "Report template not found.",
        });
      }

      const {
        name,
        type,
        courseId,
        internshipId,
        fields,
        positions,
        requiresApproval,
        isActive,
      } = req.body;

      // -----------------------------------------------
      // NAME
      // -----------------------------------------------

      if (name !== undefined) {
        const trimmedName =
          String(name).trim();

        if (!trimmedName) {
          return res.status(400).json({
            success: false,
            message:
              "Template name cannot be empty.",
          });
        }

        template.name =
          trimmedName;
      }

      // -----------------------------------------------
      // TYPE
      // -----------------------------------------------

      if (type !== undefined) {
        if (
          !validTypes.includes(type)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid report template type.",
          });
        }

        template.type = type;
      }

      const finalType =
        template.type;

      // -----------------------------------------------
      // RELATION VALIDATION
      // -----------------------------------------------

      if (
        finalType === "course"
      ) {
        const finalCourseId =
          courseId !== undefined
            ? courseId
            : template.courseId;

        if (!finalCourseId) {
          return res.status(400).json({
            success: false,
            message:
              "Please select a course.",
          });
        }

        template.courseId =
          finalCourseId;

        template.internshipId =
          null;
      }

      if (
        finalType === "internship"
      ) {
        const finalInternshipId =
          internshipId !== undefined
            ? internshipId
            : template.internshipId;

        if (!finalInternshipId) {
          return res.status(400).json({
            success: false,
            message:
              "Please select an internship.",
          });
        }

        template.internshipId =
          finalInternshipId;

        template.courseId = null;
      }

      if (
        finalType === "achievement"
      ) {
        template.courseId =
          null;

        template.internshipId =
          null;
      }

      // -----------------------------------------------
      // FIELDS
      // -----------------------------------------------

      if (fields !== undefined) {
        const parsedFields =
          parseJson(fields, null);

        if (parsedFields === null) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid fields configuration.",
          });
        }

        template.fields =
          parsedFields;
      }

      // -----------------------------------------------
      // POSITIONS
      // -----------------------------------------------

      if (positions !== undefined) {
        const parsedPositions =
          parseJson(positions, null);

        if (parsedPositions === null) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid positions configuration.",
          });
        }

        template.positions =
          parsedPositions;
      }

      // -----------------------------------------------
      // APPROVAL
      // -----------------------------------------------

      if (
        requiresApproval !==
        undefined
      ) {
        template.requiresApproval =
          parseBoolean(
            requiresApproval,
            true
          );
      }

      // -----------------------------------------------
      // ACTIVE STATUS
      // -----------------------------------------------

      if (
        isActive !== undefined
      ) {
        template.isActive =
          parseBoolean(
            isActive,
            template.isActive
          );
      }

      // -----------------------------------------------
      // OPTIONAL FILE UPDATE
      // -----------------------------------------------

      if (req.file) {
        template.templateFile =
          `/uploads/${req.file.filename}`;
      }

      await template.save();

      const updated =
        await populateTemplate(
          template._id
        );

      return res.status(200).json({
        success: true,

        message:
          "Report template updated successfully.",

        template: updated,
      });
    } catch (error) {
      console.error(
        "UPDATE REPORT TEMPLATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to update report template.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// DEACTIVATE REPORT TEMPLATE
// =====================================================

export const deleteReportTemplate =
  async (req, res) => {
    try {
      const template =
        await ReportTemplate.findById(
          req.params.id
        );

      if (!template) {
        return res.status(404).json({
          success: false,
          message:
            "Report template not found.",
        });
      }

      template.isActive =
        false;

      await template.save();

      return res.status(200).json({
        success: true,

        message:
          "Report template deactivated successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE REPORT TEMPLATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to deactivate report template.",

        error:
          error.message,
      });
    }
  };

// =====================================================
// ACTIVATE REPORT TEMPLATE
// =====================================================

export const activateReportTemplate =
  async (req, res) => {
    try {
      const template =
        await ReportTemplate.findById(
          req.params.id
        );

      if (!template) {
        return res.status(404).json({
          success: false,
          message:
            "Report template not found.",
        });
      }

      template.isActive =
        true;

      await template.save();

      const updated =
        await populateTemplate(
          template._id
        );

      return res.status(200).json({
        success: true,

        message:
          "Report template activated successfully.",

        template: updated,
      });
    } catch (error) {
      console.error(
        "ACTIVATE REPORT TEMPLATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to activate report template.",

        error:
          error.message,
      });
    }
  };