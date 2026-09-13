import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Certificate from "../models/Certificate.js";

import StudentProfile from "../models/StudentProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";
// ======================================
// Dashboard
// ======================================
export const getDashboard = async (req, res) => {
  try {
    const students = await User.countDocuments({
      role: "student",
    });

    const recruiters = await User.countDocuments({
      role: "recruiter",
    });

    const employees = await User.countDocuments({
      role: "employee",
    });

    const ambassadors = await User.countDocuments({
      role: "ambassador",
    });

    const internships =
      await Internship.countDocuments();

    const applications =
      await Application.countDocuments();

    const companies =
      await Company.countDocuments();

    const certificates =
      await Certificate.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        students,
        recruiters,
        employees,
        ambassadors,
        internships,
        applications,
        companies,
        certificates,
      },
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
// All Users
// ======================================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Approve Internship
// ======================================
export const approveInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
        req.params.id,
        {
          approvalStatus: "Approved",
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Reject Internship
// ======================================
export const rejectInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findByIdAndUpdate(
        req.params.id,
        {
          approvalStatus: "Rejected",
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete User
// ======================================
export const deleteUser = async (
  req,
  res
) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Create User By Admin
// ======================================
export const createUser = async (req,res)=>{

  try{

    const {
      name,
      email,
      password,
      role,
    } = req.body;


    if(
      !name ||
      !email ||
      !password ||
      !role
    ){

      return res.status(400).json({
        success:false,
        message:"All fields are required."
      });

    }



    const allowedRoles = [
      "student",
      "recruiter",
      "ambassador",
      "employee",
    ];



    if(!allowedRoles.includes(role)){

      return res.status(403).json({
        success:false,
        message:"Invalid role."
      });

    }



    const existingUser =
      await User.findOne({
        email:email.toLowerCase()
      });



    if(existingUser){

      return res.status(409).json({
        success:false,
        message:"Email already exists."
      });

    }




    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );




    const user =
      await User.create({

        name,

        email:
          email.toLowerCase(),

        password:
          hashedPassword,

        role,

        status:"active",

        isVerified:true,


        recruiterApproved:
          role==="recruiter"
          ? false
          : true,


        ambassadorApproved:
          role==="ambassador"
          ? false
          : true,

      });





    // ==========================
    // Create Profile
    // ==========================


    if(role==="student"){

      await StudentProfile.create({

        user:user._id,

        degree:"B.Tech",

        country:"India",

        profileCompleted:5,

      });

    }





    if(role==="recruiter"){

      await RecruiterProfile.create({

        user:user._id,

        profileCompleted:5,

      });

    }





if(role==="employee"){

  await EmployeeProfile.create({

    user:user._id,

    employeeId:
      "EMP" +
      Date.now()
      .toString()
      .slice(-6),

    department:"Operations",

    profileCompleted:5,

  });

}



    if(role==="ambassador"){

      await AmbassadorProfile.create({

        user:user._id,

        totalReferrals:0,

        successfulReferrals:0,

        rewardPoints:0,

        rank:0,

        profileCompleted:5,

      });

    }





    res.status(201).json({

      success:true,

      message:
        "User created successfully.",


      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
      }

    });



  }catch(error){

    console.log(
      "Create User Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};