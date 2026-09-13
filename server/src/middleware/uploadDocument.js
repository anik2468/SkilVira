import multer from "multer";
import path from "path";


const storage = multer.diskStorage({

  destination:(req,file,cb)=>{

    cb(
      null,
      "uploads/"
    );

  },


  filename:(req,file,cb)=>{

    const ext =
    path.extname(file.originalname);


    cb(
      null,
      `${Date.now()}${ext}`
    );

  }

});




const fileFilter = (req,file,cb)=>{


const allowed = [

  "application/pdf",

  "image/jpeg",

  "image/png",

  "image/webp"

];



if(
  allowed.includes(file.mimetype)
){

  cb(null,true);

}

else{

  cb(
    new Error(
      "Only PDF and image files allowed"
    ),
    false
  );

}


};





const uploadDocument = multer({

storage,


fileFilter,


limits:{

  fileSize:
  10 * 1024 * 1024

}


});


export default uploadDocument;