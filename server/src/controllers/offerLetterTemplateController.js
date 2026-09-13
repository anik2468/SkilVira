import OfferLetterTemplate from "../models/OfferLetterTemplate.js";


// =====================================================
// CREATE OFFER LETTER TEMPLATE
// =====================================================

export const createOfferLetterTemplate = async (
  req,
  res
) => {
  try {

    const {
      name,
      type,
      courseId,
      internshipId,
      requiresApproval,
    } = req.body;


    // =========================================
    // BASIC VALIDATION
    // =========================================

    if (!name?.trim()) {

      return res.status(400).json({
        success: false,
        message: "Template name is required.",
      });

    }


    if (
      ![
        "course",
        "internship",
        "job",
        "achievement",
      ].includes(type)
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid template type.",
      });

    }


    // =========================================
    // FILE
    // =========================================

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Offer letter template file is required.",
      });

    }


    // =========================================
    // COURSE / INTERNSHIP VALIDATION
    // =========================================

    if (
      type === "course" &&
      !courseId
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Please select a course for this template.",
      });

    }


    if (
      type === "internship" &&
      !internshipId
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Please select an internship for this template.",
      });

    }


    // =========================================
    // FIELDS
    // =========================================

    let fields = {};

    if (req.body.fields) {

      try {

        fields =
          typeof req.body.fields === "string"
            ? JSON.parse(req.body.fields)
            : req.body.fields;

      } catch (error) {

        return res.status(400).json({
          success: false,
          message: "Invalid fields configuration.",
        });

      }

    }


    // =========================================
    // FILE PATH
    // =========================================

    const templateFile =
      `/uploads/${req.file.filename}`;


    // =========================================
    // CREATE
    // =========================================

    const template =
      await OfferLetterTemplate.create({

        name:
          name.trim(),

        type,

        courseId:
          courseId || null,

        internshipId:
          internshipId || null,

        templateFile,

        fields,

        positions:
          {},

        requiresApproval:
          requiresApproval !== "false" &&
          requiresApproval !== false,

        isActive:
          true,

        createdBy:
          req.user?.id ||
          req.user?._id ||
          null,

      });


    const populatedTemplate =
      await OfferLetterTemplate.findById(
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
        "Offer letter template created successfully.",

      template:
        populatedTemplate,

    });

  } catch (error) {

    console.error(
      "CREATE OFFER LETTER TEMPLATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to create offer letter template.",

      error:
        error.message,

    });

  }

};



// =====================================================
// GET ALL OFFER LETTER TEMPLATES
// =====================================================

export const getOfferLetterTemplates = async (
  req,
  res
) => {
  try {

    const templates =
      await OfferLetterTemplate.find({

        isActive:
          true,

      })
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
          createdAt:
            -1,
        });


    return res.status(200).json({

      success: true,

      count:
        templates.length,

      templates,

    });

  } catch (error) {

    console.error(
      "GET OFFER LETTER TEMPLATES ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offer letter templates.",

      error:
        error.message,

    });

  }

};



// =====================================================
// GET SINGLE TEMPLATE
// =====================================================

export const getOfferLetterTemplateById = async (
  req,
  res
) => {
  try {

    const template =
      await OfferLetterTemplate.findById(
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
          "Offer letter template not found.",

      });

    }


    return res.status(200).json({

      success: true,

      template,

    });

  } catch (error) {

    console.error(
      "GET OFFER LETTER TEMPLATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offer letter template.",

      error:
        error.message,

    });

  }

};



// =====================================================
// UPDATE TEMPLATE
// =====================================================

export const updateOfferLetterTemplate = async (
  req,
  res
) => {
  try {

    const template =
      await OfferLetterTemplate.findById(
        req.params.id
      );


    if (!template) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter template not found.",

      });

    }


    const {
      name,
      type,
      courseId,
      internshipId,
      requiresApproval,
      fields,
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

      template.type =
        type;

    }


    if (courseId !== undefined) {

      template.courseId =
        courseId || null;

    }


    if (internshipId !== undefined) {

      template.internshipId =
        internshipId || null;

    }


    if (
      requiresApproval !== undefined
    ) {

      template.requiresApproval =
        requiresApproval === true ||
        requiresApproval === "true";

    }


    if (fields !== undefined) {

      try {

        template.fields =
          typeof fields === "string"
            ? JSON.parse(fields)
            : fields;

      } catch (error) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid fields configuration.",

        });

      }

    }


    if (isActive !== undefined) {

      template.isActive =
        isActive === true ||
        isActive === "true";

    }


    // -----------------------------------------
    // Optional new file
    // -----------------------------------------

    if (req.file) {

      template.templateFile =
        `/uploads/${req.file.filename}`;

    }


    template.updatedAt =
      new Date();


    await template.save();


    const updated =
      await OfferLetterTemplate.findById(
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
        "Offer letter template updated successfully.",

      template:
        updated,

    });

  } catch (error) {

    console.error(
      "UPDATE OFFER LETTER TEMPLATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update offer letter template.",

      error:
        error.message,

    });

  }

};



// =====================================================
// DELETE / DEACTIVATE TEMPLATE
// =====================================================

export const deleteOfferLetterTemplate = async (
  req,
  res
) => {
  try {

    const template =
      await OfferLetterTemplate.findById(
        req.params.id
      );


    if (!template) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter template not found.",

      });

    }


    // Soft deactivate
    template.isActive =
      false;


    await template.save();


    return res.status(200).json({

      success: true,

      message:
        "Offer letter template deactivated successfully.",

    });

  } catch (error) {

    console.error(
      "DELETE OFFER LETTER TEMPLATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to delete offer letter template.",

      error:
        error.message,

    });

  }

};



// =====================================================
// ACTIVATE TEMPLATE
// =====================================================

export const activateOfferLetterTemplate = async (
  req,
  res
) => {
  try {

    const template =
      await OfferLetterTemplate.findById(
        req.params.id
      );


    if (!template) {

      return res.status(404).json({

        success: false,

        message:
          "Offer letter template not found.",

      });

    }


    template.isActive =
      true;


    await template.save();


    return res.status(200).json({

      success: true,

      message:
        "Offer letter template activated successfully.",

      template,

    });

  } catch (error) {

    console.error(
      "ACTIVATE OFFER LETTER TEMPLATE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to activate offer letter template.",

      error:
        error.message,

    });

  }

};