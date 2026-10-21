import EmployeeProfile from "../models/EmployeeProfile.js";
import User from "../models/User.js";
import Internship from "../models/Internship.js";

const EMPLOYEE_PROFILE_EDITABLE_FIELDS = [
  "designation", "department", "phone", "officeEmail", "qualification",
  "experience", "address", "city", "state", "country", "linkedin",
];

const sanitizeEmployeeProfileUpdates = (body = {}) => {
  const updates = {};
  for (const field of EMPLOYEE_PROFILE_EDITABLE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
    if (field === "experience") {
      const value = Number(body[field]);
      if (Number.isFinite(value) && value >= 0 && value <= 80) updates[field] = value;
    } else {
      updates[field] = String(body[field] ?? "").trim().slice(0, 1000);
    }
  }
  return updates;
};


// ======================================
// Get Employee Profile
// ======================================
export const getEmployeeProfile = async (
  req,
  res
) => {
  try {

    const profile =
      await EmployeeProfile.findOne({
        user: req.params.userId,
      })
      .populate(
        "user",
        "name email avatar"
      );


    if (!profile) {

      return res.status(404).json({

        success:false,

        message:
          "Employee profile not found.",

      });

    }


    res.status(200).json({

      success:true,

      profile,

    });


  } catch(error) {

    console.error(error);


    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};




// ======================================
// Create / Update Employee Profile
// ======================================
export const saveEmployeeProfile = async (
  req,
  res
) => {

try {

let profile =
await EmployeeProfile.findOne({
 user:req.params.userId,
});


if(profile){

 Object.assign(
  profile,
  sanitizeEmployeeProfileUpdates(req.body)
 );

}else{

 profile =
 new EmployeeProfile({

  user:req.params.userId,

  ...sanitizeEmployeeProfileUpdates(req.body),

 });


 if(!profile.employeeId){

  profile.employeeId =
  "EMP" +
  Date.now()
  .toString()
  .slice(-6);

 }

}



const fields=[

"designation",
"department",
"phone",
"officeEmail",
"qualification",
"address",
"city",
"state",
"profileImage",
"linkedin",

];


let completed=0;


fields.forEach(field=>{

 if(
  profile[field] &&
  profile[field] !== ""
 ){

  completed++;

 }

});


profile.profileCompleted =
Math.round(
(completed / fields.length) * 100
);


await profile.save();


res.status(200).json({

success:true,

message:
"Employee profile saved successfully.",

profile,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};
// ======================================
// Employee Dashboard
// ======================================
export const employeeDashboard = async (
  req,
  res
) => {

  try {

    let profile =
      await EmployeeProfile.findOne({
        user:req.params.userId,
      });



    if (!profile) {
      const employeeUser = await User.findOne({
        _id: req.params.userId,
        role: "employee",
        isDeleted: { $ne: true },
      });

      if (!employeeUser) {
        return res.status(404).json({
          success: false,
          message: "Employee account not found.",
        });
      }

      profile = await EmployeeProfile.create({
        user: employeeUser._id,
      });
    }



    const pendingRecruiters =
      await User.countDocuments({

        role:"recruiter",

        recruiterApproved:false,

        isDeleted:false,

      });



    const pendingAmbassadors =
      await User.countDocuments({

        role:"ambassador",

        ambassadorApproved:false,

        isDeleted:false,

      });



    const pendingInternships =
      await Internship.countDocuments({

        approvalStatus:"Pending",

        isDeleted:false,

      });



    res.status(200).json({

      success:true,


      stats:{

        profileCompleted:
          profile.profileCompleted,

        designation:
          profile.designation,

        department:
          profile.department,


        pendingRecruiters,

        pendingAmbassadors,

        pendingInternships,

      },


      profile,

    });



  }catch(error){

    console.error(error);


    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};




// ======================================
// Get All Employees
// ======================================
export const getEmployees = async (
req,
res
)=>{

try{


const employees =
await EmployeeProfile.find()
.populate(
"user",
"name email role"
)
.sort({
createdAt:-1,
});


res.status(200).json({

success:true,

employees,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};





// ======================================
// Pending Recruiters
// ======================================
export const getPendingRecruiters =
async(req,res)=>{


try{


const recruiters =
await User.find({

role:"recruiter",

recruiterApproved:false,

status:"active",

isDeleted:false,

})
.select(
"-password -refreshToken"
)
.sort({
createdAt:-1,
});



res.status(200).json({

success:true,

count: recruiters.length,

recruiters,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}


};





// ======================================
// Approve Recruiter
// ======================================
export const approveRecruiter =
async(req,res)=>{


try{


const recruiter =
await User.findByIdAndUpdate(

req.params.id,

{

recruiterApproved:true,

companyVerified:true,

isVerified:true,

status:"active",

approvedAt:new Date(),

},

{

new:true,

}

)
.select(
"-password -refreshToken"
);



if(!recruiter){

return res.status(404).json({

success:false,

message:
"Recruiter not found.",

});

}



res.status(200).json({

success:true,

message:
"Recruiter approved successfully.",

recruiter,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}


};





// ======================================
// Reject Recruiter
// ======================================
export const rejectRecruiter =
async(req,res)=>{


try{


const recruiter =
await User.findByIdAndUpdate(

req.params.id,

{

recruiterApproved:false,

status:"blocked",

}

,

{

new:true,

}

);



res.status(200).json({

success:true,

message:
"Recruiter rejected.",

recruiter,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};





// ======================================
// Pending Ambassadors
// ======================================
export const getPendingAmbassadors =
async(req,res)=>{


try{


const ambassadors =
await User.find({

role:"ambassador",

ambassadorApproved:false,

status:"active",

isDeleted:false,

})
.select(
"-password -refreshToken"
)
.sort({

createdAt:-1,

});



res.status(200).json({

success:true,

count:ambassadors.length,

ambassadors,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};


// ======================================
// Approve Ambassador
// ======================================
export const approveAmbassador =
async(req,res)=>{


try{


const ambassador =
await User.findByIdAndUpdate(

req.params.id,

{

ambassadorApproved:true,

isVerified:true,

status:"active",

approvedAt:new Date(),

},

{

new:true,

}

)
.select(
"-password -refreshToken"
);



if(!ambassador){

return res.status(404).json({

success:false,

message:
"Ambassador not found.",

});

}



res.status(200).json({

success:true,

message:
"Ambassador approved successfully.",

ambassador,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};





// ======================================
// Reject Ambassador
// ======================================
export const rejectAmbassador =
async(req,res)=>{


try{


const ambassador =
await User.findByIdAndUpdate(

req.params.id,

{
  ambassadorApproved:false,
  status:"blocked",
  isVerified:false,
},

{
  new:true,
}

);



if(!ambassador){

return res.status(404).json({

success:false,

message:
"Ambassador not found.",

});

}



res.status(200).json({

success:true,

message:
"Ambassador rejected.",

ambassador,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};



// ======================================
// Pending Internships
// ======================================
export const getPendingInternships =
async(req,res)=>{

try{


const internships =
await Internship.find({

approvalStatus:"Pending",

isDeleted:false,

})
.populate(
"recruiter",
"name email"
)
.sort({

createdAt:-1,

});



res.status(200).json({

success:true,

count:internships.length,

internships,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};
// ======================================
// Approve Internship
// ======================================
export const approveInternship =
async (req,res)=>{

  try{

    const internship =
      await Internship.findByIdAndUpdate(

        req.params.id,

        {
          approvalStatus:"Approved",
        },

        {
          new:true,
        }

      );


    if(!internship){

      return res.status(404).json({

        success:false,

        message:"Internship not found.",

      });

    }


    res.status(200).json({

      success:true,

      message:"Internship approved successfully.",

      internship,

    });


  }catch(error){

    console.error(error);


    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};





// ======================================
// Reject Internship
// ======================================
export const rejectInternship =
async (req,res)=>{

  try{


    const internship =
      await Internship.findByIdAndUpdate(

        req.params.id,

        {
          approvalStatus:"Rejected",
        },

        {
          new:true,
        }

      );



    if(!internship){

      return res.status(404).json({

        success:false,

        message:"Internship not found.",

      });

    }



    res.status(200).json({

      success:true,

      message:"Internship rejected.",

      internship,

    });



  }catch(error){

    console.error(error);


    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};
// ======================================
// Get All Platform Users
// ======================================
export const getAllUsers = async(req,res)=>{

try{

const users =
await User.find({

isDeleted:false,

})
.select(
"-password -refreshToken"
)
.sort({

createdAt:-1,

});


res.status(200).json({

success:true,

count:users.length,

users,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};




// ======================================
// Block User
// ======================================
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
.select(
"-password -refreshToken"
);



if(!user){

return res.status(404).json({

success:false,

message:"User not found.",

});

}



res.status(200).json({

success:true,

message:"User blocked successfully.",

user,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};





// ======================================
// Unblock User
// ======================================
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
.select(
"-password -refreshToken"
);



if(!user){

return res.status(404).json({

success:false,

message:"User not found.",

});

}



res.status(200).json({

success:true,

message:"User unblocked successfully.",

user,

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};





// ======================================
// Delete User
// ======================================
export const deleteUser =
async(req,res)=>{


try{


const user =
await User.findByIdAndUpdate(

req.params.id,

{

isDeleted:true,

status:"deleted",

},

{

new:true,

}

);



if(!user){

return res.status(404).json({

success:false,

message:"User not found.",

});

}



res.status(200).json({

success:true,

message:"User deleted successfully.",

});


}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};