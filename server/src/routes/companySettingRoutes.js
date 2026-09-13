import express from "express";

import {
  getCompanySetting,
  updateCompanySetting,
  uploadCompanyAssets
} from "../controllers/companySettingController.js";


import upload from "../middleware/upload.js";
import uploadDocument from "../middleware/uploadDocument.js";


const router = express.Router();



// Get Settings

router.get(
  "/",
  getCompanySetting
);




// Update Settings

router.put(
  "/",
  updateCompanySetting
);




// Upload Assets

router.post(

  "/upload",

  upload.fields([

    {
      name:"logo",
      maxCount:1
    },

    {
      name:"qrCode",
      maxCount:1
    }

  ]),


  uploadDocument.fields([

    {
      name:"brochure",
      maxCount:1
    }

  ]),


  uploadCompanyAssets

);



export default router;