import Internship from "../models/Internship.js";

// ======================================
// Create Internship
// ======================================
export const createInternship = async (req, res) => {

  try {


    const {
      sourceType = "recruiter",
      ...data
    } = req.body;



    const isSkilVira =
      sourceType === "skilvira";



    const internship =
      await Internship.create({

        ...data,


        sourceType,


        approvalStatus:
          isSkilVira
            ? "Approved"
            : "Pending",


        status:"Open",

        featured:false,

        views:0,

        applicants:0,

        isDeleted:false,

      });



    res.status(201).json({

      success:true,

      message:

        isSkilVira

        ?

        "SkilVira internship published successfully."

        :

        "Internship submitted successfully. It is under review and will be published after approval.",


      internship,

    });



  } catch(error){


    console.error(error);



    res.status(500).json({

      success:false,

      message:error.message,

    });


  }

};
// ======================================
// Get Approved Internships
// ======================================
export const getInternships = async (req, res) => {
  try {
    const {
      keyword,
      category,
      workMode,
      location,
    } = req.query;

    let query = {
      approvalStatus: "Approved",
      status: "Open",
      isDeleted: false,
    };

    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    const internships = await Internship.find(query).sort({
      featured: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Recruiter Internships
// ======================================
export const getRecruiterInternships = async (
  req,
  res
) => {
  try {
    const internships = await Internship.find({
      recruiter: req.params.recruiterId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Pending Internships
// ======================================
export const getPendingInternships = async (
  req,
  res
) => {
  try {
    const internships = await Internship.find({
      approvalStatus: "Pending",
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Latest Internships
// ======================================
export const latestInternships = async (
  req,
  res
) => {
  try {
    const internships = await Internship.find({
      approvalStatus: "Approved",
      status: "Open",
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .limit(6);

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Featured Internships
// ======================================
export const featuredInternships = async (
  req,
  res
) => {
  try {
    const internships = await Internship.find({
      featured: true,
      approvalStatus: "Approved",
      status: "Open",
      isDeleted: false,
    }).limit(8);

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Internship Details
// ======================================
export const getInternshipById = async (
  req,
  res
) => {
  try {
    const internship = await Internship.findById(
      req.params.id
    );

    if (!internship || internship.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    internship.views += 1;

    await internship.save();

    res.json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Internship
// ======================================
export const updateInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
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

    res.json({
      success: true,
      message:
        "Internship updated successfully.",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Approve Internship
// ======================================
export const approveInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
        req.params.id,
        {
          approvalStatus: "Approved",
        },
        {
          new: true,
        }
      );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Internship approved successfully.",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Reject Internship
// ======================================
export const rejectInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
        req.params.id,
        {
          approvalStatus: "Rejected",
        },
        {
          new: true,
        }
      );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Internship rejected.",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Feature Internship
// ======================================
export const featureInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
        req.params.id,
        {
          featured: true,
        },
        {
          new: true,
        }
      );

    res.json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Internship
// ======================================
export const deleteInternship = async (
  req,
  res
) => {
  try {
    await Internship.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      }
    );

    res.json({
      success: true,
      message:
        "Internship deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Create SkilVira Internship (Employee)
// ======================================

export const createSkilViraInternship = async (
  req,
  res
) => {

  try {


    const {

      title,
      category,

      internshipType,
      workMode,

      location,
      duration,

      price,

      openings,

      lastDate,

      skills,

      description,

      responsibilities,

      requirements,

      perks,

      benefits,

      internshipImage,

      companyWebsite,


    } = req.body;




    const internship = await Internship.create({

      // Creator
      recruiter:
        req.body.recruiter,


      // Source
      sourceType:
        "skilvira",



      // Company

      company:
        "SkilVira",


      companyWebsite:
        companyWebsite || "",


      companyLogo:
        "",



      internshipImage:
        internshipImage || "",




      // Basic Details

      title,

      category,


      internshipType:
        internshipType || "Internship",


      workMode:
        workMode || "Online",


      location,


      duration,


      price,


      openings:
        openings || 1,


      lastDate,




      // Skills

      skills:
        Array.isArray(skills)
        ?
        skills
        :
        [],





      // Description

      description,


      responsibilities:
        responsibilities || "",


      requirements,


      perks:
        perks || "",




      // Benefits

      benefits:
        Array.isArray(benefits)
        ?
        benefits
        :
        [],





      // Approval

      approvalStatus:
        "Approved",


      status:
        "Open",


      featured:
        false,



      views:
        0,


      applicants:
        0,


      bookmarks:
        0,



      isDeleted:
        false,


    });





    res.status(201).json({

      success:true,


      message:
      "SkilVira paid internship published successfully.",


      internship,


    });



  } catch(error) {


    console.error(error);


    res.status(500).json({

      success:false,

      message:
      error.message,


    });


  }


};