import ReportTemplate from "../models/ReportTemplate.js";


// =====================================================
// CREATE REPORT TEMPLATE
// =====================================================

export const createReportTemplate = async (req, res) => {
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

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Template name is required.",
      });
    }

    if (
      !["course", "internship", "achievement"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid template type.",
      });
    }

    if (type === "course" && !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please select a course.",
      });
    }

    if (
      type === "internship" &&
      !internshipId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select an internship.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Report template file is required.",
      });
    }

    let parsedFields = {};

    if (fields) {
      try {
        parsedFields =
          typeof fields === "string"
            ? JSON.parse(fields)
            : fields;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid fields configuration.",
        });
      }
    }

    let parsedPositions = {};

    if (positions) {
      try {
        parsedPositions =
          typeof positions === "string"
            ? JSON.parse(positions)
            : positions;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid positions configuration.",
        });
      }
    }

    const template =
      await ReportTemplate.create({
        name: name.trim(),
        type,
        courseId: courseId || null,
        internshipId: internshipId || null,
        templateFile:
          `/uploads/${req.file.filename}`,
        fields: parsedFields,
        positions: parsedPositions,
        requiresApproval:
          requiresApproval !== false &&
          requiresApproval !== "false",
        isActive: true,
        createdBy:
          req.user?.id ||
          req.user?._id ||
          null,
      });

    const result =
      await ReportTemplate.findById(
        template._id
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
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL
// =====================================================

export const getReportTemplates = async (
  req,
  res
) => {
  try {
    const {
      type,
      courseId,
      internshipId,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (type) {
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
      await ReportTemplate.find(filter)
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
      count: templates.length,
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
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE
// =====================================================

export const getReportTemplateById =
  async (req, res) => {
    try {
      const template =
        await ReportTemplate.findById(
          req.params.id
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
        error: error.message,
      });
    }
  };


// =====================================================
// UPDATE
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

      if (name !== undefined) {
        if (!name.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Template name cannot be empty.",
          });
        }

        template.name =
          name.trim();
      }

      if (type !== undefined) {
        template.type = type;
      }

      if (courseId !== undefined) {
        template.courseId =
          courseId || null;
      }

      if (internshipId !== undefined) {
        template.internshipId =
          internshipId || null;
      }

      if (fields !== undefined) {
        try {
          template.fields =
            typeof fields === "string"
              ? JSON.parse(fields)
              : fields;
        } catch {
          return res.status(400).json({
            success: false,
            message:
              "Invalid fields configuration.",
          });
        }
      }

      if (positions !== undefined) {
        try {
          template.positions =
            typeof positions === "string"
              ? JSON.parse(positions)
              : positions;
        } catch {
          return res.status(400).json({
            success: false,
            message:
              "Invalid positions configuration.",
          });
        }
      }

      if (
        requiresApproval !==
        undefined
      ) {
        template.requiresApproval =
          requiresApproval === true ||
          requiresApproval === "true";
      }

      if (isActive !== undefined) {
        template.isActive =
          isActive === true ||
          isActive === "true";
      }

      if (req.file) {
        template.templateFile =
          `/uploads/${req.file.filename}`;
      }

      await template.save();

      const updated =
        await ReportTemplate.findById(
          template._id
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
        error: error.message,
      });
    }
  };


// =====================================================
// DELETE
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

      template.isActive = false;

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
          "Failed to delete report template.",
        error: error.message,
      });
    }
  };


// =====================================================
// ACTIVATE
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

      template.isActive = true;

      await template.save();

      return res.status(200).json({
        success: true,
        message:
          "Report template activated successfully.",
        template,
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
        error: error.message,
      });
    }
  };