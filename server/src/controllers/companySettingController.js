import CompanySetting from "../models/CompanySetting.js";



// =====================================
// Get Company Setting
// =====================================

export const getCompanySetting = async(req,res)=>{


try{


let setting =
await CompanySetting.findOne();



if(!setting){


setting =
await CompanySetting.create({});

}



res.status(200).json({

success:true,

setting,

});


}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};








// =====================================
// Update Company Setting
// =====================================


export const updateCompanySetting = async(req,res)=>{


try{


let setting =
await CompanySetting.findOne();



if(!setting){


setting =
new CompanySetting();


}



Object.assign(
setting,
req.body
);



setting.updatedBy =
req.user?.id || null;



await setting.save();




res.status(200).json({

success:true,

message:"Company settings updated",

setting,

});


}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}


};








// =====================================
// Upload Assets
// =====================================


export const uploadCompanyAssets = async(req,res)=>{


try{


let setting =
await CompanySetting.findOne();



if(!setting){

setting =
new CompanySetting();

}




if(req.files?.logo){

setting.logo =
"/uploads/" +
req.files.logo[0].filename;

}



if(req.files?.brochure){

setting.brochure =
"/uploads/" +
req.files.brochure[0].filename;

}



if(req.files?.qrCode){

setting.qrCode =
"/uploads/" +
req.files.qrCode[0].filename;

}



await setting.save();




res.status(200).json({

success:true,

message:"Files uploaded successfully",

setting,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}


};