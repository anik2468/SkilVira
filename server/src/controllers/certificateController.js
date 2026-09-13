import Certificate from "../models/Certificate.js";

// ======================================
// Add Certificate
// ======================================
export const addCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);

    res.status(201).json({
      success: true,
      message: "Certificate added successfully.",
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