import User from "../models/User.js";


// =======================================
// Get All Users
// =======================================

export const getAllUsers = async (req, res) => {
  try {
    const actorRole = String(req.user?.role || "")
      .trim()
      .toLowerCase();

    if (!["employee", "control"].includes(actorRole)) {
      return res.status(403).json({
        success: false,
        message: "Employee or Control Admin access is required.",
      });
    }

    const filter = {
      isDeleted: { $ne: true },
    };

    // Employees can manage students, recruiters and ambassadors,
    // but must not see other employee accounts.
    if (actorRole === "employee") {
      filter.role = {
        $in: ["student", "recruiter", "ambassador"],
      };
    }

    const users = await User.find(filter)
      .select(
        "-password -refreshToken -resetPasswordToken -resetPasswordExpire"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

// =======================================
// Get Pending Recruiters
// =======================================

export const getPendingRecruiters =
async(req,res)=>{

try{


const recruiters =
await User.find({

role:"recruiter",

recruiterApproved:false,

isDeleted:false,

})
.select("-password -refreshToken");



res.status(200).json({

success:true,

count:recruiters.length,

recruiters,

});


}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}

};






// =======================================
// Approve Recruiter
// =======================================

export const approveRecruiter =
async(req,res)=>{


try{


const recruiter =
await User.findByIdAndUpdate(

req.params.id,

{

recruiterApproved:true,

isVerified:true,

},

{

new:true,

}

)
.select("-password -refreshToken");




if(!recruiter){

return res.status(404).json({

success:false,

message:"Recruiter not found"

});

}




res.json({

success:true,

message:"Recruiter approved successfully",

recruiter,

});


}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};








// =======================================
// Reject Recruiter
// =======================================

export const rejectRecruiter =
async(req,res)=>{


try{


const recruiter =
await User.findByIdAndUpdate(

req.params.id,

{

recruiterApproved:false,

status:"blocked",

},

{

new:true,

}

)
.select("-password -refreshToken");




if(!recruiter){

return res.status(404).json({

success:false,

message:"Recruiter not found",

});

}



res.json({

success:true,

message:"Recruiter rejected successfully",

recruiter,

});



}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};








// =======================================
// Block User
// =======================================

export const blockUser =
async(req,res)=>{


try{


const user =
await User.findByIdAndUpdate(

req.params.id,

{

status:"blocked",

},

{

new:true,

}

)
.select("-password -refreshToken");



res.json({

success:true,

message:"User blocked successfully",

user,

});


}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};








// =======================================
// Unblock User
// =======================================

export const unblockUser =
async(req,res)=>{


try{


const user =
await User.findByIdAndUpdate(

req.params.id,

{

status:"active",

},

{

new:true,

}

)
.select("-password -refreshToken");



res.json({

success:true,

message:"User unblocked successfully",

user,

});


}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};









// =======================================
// Delete User
// =======================================

export const deleteUser =
async(req,res)=>{


try{


await User.findByIdAndUpdate(

req.params.id,

{

isDeleted:true,

status:"deleted",

}

);



res.json({

success:true,

message:"User deleted successfully",

});


}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};







// =======================================
// Update Avatar
// =======================================

export const updateAvatar =
async(req,res)=>{


try{


const {avatar}=req.body;



if(!avatar){

return res.status(400).json({

success:false,

message:"Avatar path required",

});

}



const user =
await User.findByIdAndUpdate(

req.params.id,

{

avatar,

},

{

new:true,

}

)
.select("-password -refreshToken");





if(!user){

return res.status(404).json({

success:false,

message:"User not found",

});

}




res.status(200).json({

success:true,

message:"Profile image updated successfully",

user,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};