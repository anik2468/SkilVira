import express from "express";


import {

createGeneratedCertificate,

getPendingCertificates,

updateCertificateDetails,

approveCertificate,

rejectCertificate

}

from "../controllers/generatedCertificateController.js";



import auth from "../middleware/auth.js";



const router = express.Router();




// Create Certificate Generation Request

router.post(

"/generate",

auth,

createGeneratedCertificate

);




// Employee Verification Queue

router.get(

"/pending",

auth,

getPendingCertificates

);




// Employee Edit Certificate Data

router.put(

"/:id/update",

auth,

updateCertificateDetails

);




// Approve

router.put(

"/:id/approve",

auth,

approveCertificate

);




// Reject

router.put(

"/:id/reject",

auth,

rejectCertificate

);



export default router;