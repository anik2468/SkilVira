import express from "express";

import upload from "../middleware/upload.js";
import uploadCertificate from "../middleware/uploadCertificate.js";


const router = express.Router();



// ===============================
// Upload Normal File/Image
// ===============================

router.post(
"/",
upload.single("file"),

(req,res)=>{


if(!req.file){

return res.status(400).json({

success:false,

message:"File required"

});

}



res.json({

success:true,

url:
`/uploads/${req.file.filename}`

});


}

);






// ===============================
// Upload Certificate Template
// ===============================


router.post(

"/certificate",

uploadCertificate.single("certificate"),

(req,res)=>{


if(!req.file){

return res.status(400).json({

success:false,

message:"Certificate file required"

});

}



res.json({

success:true,

url:
`/uploads/certificate/${req.file.filename}`

});


}

);




export default router;