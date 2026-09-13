import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/User.js";


dotenv.config();


const createAdmin = async () => {

  try {


    await mongoose.connect(
      process.env.MONGODB_URI
    );


    console.log("MongoDB Connected");


    const existing =
      await User.findOne({
        email:"admin@skilvira.com"
      });



    if(existing){

      console.log(
        "Admin already exists"
      );

      process.exit();

    }



    const hashedPassword =
      await bcrypt.hash(
        "Admin@123",
        10
      );



    const admin =
      await User.create({

        name:"Super Admin",

        email:"admin@skilvira.com",

        password:hashedPassword,

        role:"control",

        status:"active",

        isVerified:true,

        emailVerified:true,

        phoneVerified:true,

        recruiterApproved:true,

        ambassadorApproved:true,

      });



    console.log(
      "Admin Created:",
      admin.email
    );


    process.exit();



  } catch(error){

    console.log(error);

    process.exit(1);

  }


};


createAdmin();