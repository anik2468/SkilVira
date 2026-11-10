import Certificate from "../models/Certificate.js";

// ======================================
// Add Certificate
// ======================================
export const addCertificate = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    const staffRoles = ["employee", "admin", "control"];
    const input = req.body || {};

    const studentId = staffRoles.includes(role)
      ? input.student
      : req.user?.id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student is required.",
      });
    }

    const certificateData = {
      student: studentId,
      title: String(input.title || "").trim().slice(0, 200),
      issuer: String(input.issuer || "").trim().slice(0, 200),
      issueDate: input.issueDate,
    };

    for (const field of [
      "expiryDate",
      "credentialId",
      "credentialUrl",
      "certificateFile",
    ]) {
      if (input[field] !== undefined) {
        certificateData[field] = input[field];
      }
    }

    if (Array.isArray(input.skills)) {
      certificateData.skills = input.skills
        .filter((item) => typeof item === "string")
        .slice(0, 30)
        .map((item) => item.trim().slice(0, 80));
    }

    // Never accept verified status from the requester.
    const certificate = await Certificate.create(certificateData);

    return res.status(201).json({
      success: true,
      message: "Certificate added successfully.",
      certificate,
    });
  } catch (error) {
    console.error("ADD CERTIFICATE ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Student Certificates
// ======================================
export const getStudentCertificates = async (
  req,
  res
) => {
  try {
    const certificates = await Certificate.find({
      student: req.params.studentId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      certificates,
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
// All Certificates
// ======================================
export const getCertificates = async (
  req,
  res
) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
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
// Verify Certificate
// ======================================
export const verifyCertificate = async (
  req,
  res
) => {
  try {
    const certificate =
      await Certificate.findByIdAndUpdate(
        req.params.id,
        {
          verified: true,
          rejected: false,
        },
        {
          new: true,
        }
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate verified.",
      certificate,
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
// ======================================
// Reject Certificate
// ======================================
export const rejectCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          verified: false,
          rejected: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate rejected.",
      certificate,
    });
  } catch (error) {
    console.error("REJECT CERTIFICATE ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================

// Delete Certificate
// ======================================
export const deleteCertificate = async (
  req,
  res
) => {
  try {
    const certificate =
      await Certificate.findByIdAndDelete(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully.",
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
// Verify Certificate By Credential ID
// ======================================

export const verifyCertificateById = async(req,res)=>{

try{


const certificate =
await Certificate.findOne({

credentialId:req.params.credentialId

})
.populate(
"student",
"name email"
);



if(!certificate){

return res.status(404).json({

success:false,

message:"Certificate not found"

});

}



res.status(200).json({

success:true,

certificate

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};