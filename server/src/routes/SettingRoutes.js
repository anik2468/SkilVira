import express from "express";

import {
getCompanySetting,
updateCompanySetting,
uploadCompanyAssets
}
from "../controllers/companySettingController.js";


import upload from "../middleware/upload.js";

import uploadDocument from "../middleware/uploadDocument.js";


const router = express.Router();





router.get(
"/",
getCompanySetting
);




router.put(
"/",
updateCompanySetting
);





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