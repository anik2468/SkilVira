import express from "express";


import {

addCertificate,

getStudentCertificates,

getCertificates,

verifyCertificate,

deleteCertificate,

verifyCertificateById

} from "../controllers/certificateController.js";



const router = express.Router();



// ======================================
// Student
// ======================================


// Add Certificate

router.post(
"/",
addCertificate
);



// Get Student Certificates

router.get(
"/student/:studentId",
getStudentCertificates
);




// ======================================
// Public Verification (QR Scan)
// ======================================


router.get(
"/verify/:credentialId",
verifyCertificateById
);




// ======================================
// Admin / Control
// ======================================


// Get All Certificates

router.get(
"/",
getCertificates
);



// Admin Verify Certificate

router.put(
"/verify/id/:id",
verifyCertificate
);



// Delete Certificate

router.delete(
"/:id",
deleteCertificate
);



export default router;