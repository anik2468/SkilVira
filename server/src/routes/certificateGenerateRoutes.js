import express from "express";


import {
generateStudentCertificate
} from "../controllers/certificateGenerateController.js";



const router = express.Router();




// ======================================
// Generate Certificate
// ======================================

router.post(
"/generate",
generateStudentCertificate
);



export default router;