import AmbassadorProfile from "../models/AmbassadorProfile.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import GeneratedCertificate from "../models/GeneratedCertificate.js";
import Referral from "../models/Referral.js";
import Payment from "../models/Payment.js";


// ======================================
// Helpers
// ======================================

const DEFAULT_COMMISSION_RATE = 15;


const getReferralLink = (referralCode) => {
  if (!referralCode) return "";

  const serverUrl =
    process.env.SERVER_PUBLIC_URL ||
    "http://localhost:5000";

  return `${serverUrl}/api/referrals/click/${referralCode}`;
};


const getUserId = (req) =>
  req.user?.id ||
  req.user?._id ||
  req.user?.userId ||
  req.params.userId ||
  null;


// ======================================
// Payment Helpers
// ======================================

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase();


const isSuccessfulPayment = (payment) => {
  const status = normalizeStatus(
    payment?.status
  );

  return [
    "paid",
    "approved",
    "verified",
    "success",
    "successful",
    "completed",
    "captured",
  ].includes(status);
};


const isRejectedPayment = (payment) => {
  const status = normalizeStatus(
    payment?.status
  );

  return [
    "rejected",
    "failed",
    "cancelled",
    "canceled",
    "declined",
  ].includes(status);
};


const getPaymentAmount = (payment) => {
  const finalAmount =
    Number(payment?.finalAmount);

  if (
    Number.isFinite(finalAmount) &&
    finalAmount > 0
  ) {
    return finalAmount;
  }


  const originalAmount =
    Number(payment?.originalAmount);


  if (
    Number.isFinite(originalAmount) &&
    originalAmount > 0
  ) {
    return originalAmount;
  }


  return 0;
};


const getCommission = (amountOrPayment, commissionRate = DEFAULT_COMMISSION_RATE) => {
  if (amountOrPayment && typeof amountOrPayment === "object") {
    const payment = amountOrPayment;

    if (
      payment.ambassadorCommissionAmount !== undefined &&
      payment.ambassadorCommissionAmount !== null &&
      Number.isFinite(Number(payment.ambassadorCommissionAmount))
    ) {
      return Number(payment.ambassadorCommissionAmount);
    }

    const amount = Math.max(0, Number(getPaymentAmount(payment)) || 0);
    const rate = Math.max(
      0,
      Number(payment.ambassadorCommissionValue ?? commissionRate) || 0
    );

    if (payment.ambassadorCommissionType === "fixed") {
      return Math.round(Math.min(amount, rate) * 100) / 100;
    }

    return Math.round(amount * Math.min(rate, 100)) / 100;
  }

  const amount = Math.max(0, Number(amountOrPayment) || 0);
  const rate = Math.max(0, Number(commissionRate) || 0);
  return Math.round(amount * rate) / 100;
};


// ======================================
// Revenue Calculator
// ======================================

const calculateAmbassadorRevenue = ({
  payments = [],
  referredStudentIds = [],
  commissionRate = DEFAULT_COMMISSION_RATE,
}) => {

  const studentIdSet =
    new Set(
      referredStudentIds.map(
        (id) => String(id)
      )
    );


  let totalRevenueGenerated = 0;
  let totalCommissionEarned = 0;

  let potentialRevenue = 0;
  let potentialCommission = 0;


  const successfulPayments = [];
  const pendingPayments = [];


  payments.forEach((payment)=>{

    const studentId =
      payment?.student
        ? String(payment.student)
        : "";


    if(
      studentId &&
      !studentIdSet.has(studentId)
    ){
      return;
    }


    const amount =
      getPaymentAmount(payment);


    if(amount <= 0) return;


    if(
      isSuccessfulPayment(payment)
    ){

      const commission =
        getCommission(payment, commissionRate);


      totalRevenueGenerated += amount;
      totalCommissionEarned += commission;


      successfulPayments.push({
        paymentId: payment._id,
        studentId:
          payment.student || null,
        amount,
        commission,
        status:
          payment.status || "",
      });

      return;
    }


    if(
      !isRejectedPayment(payment)
    ){

      const commission =
        getCommission(payment, commissionRate);


      potentialRevenue += amount;
      potentialCommission += commission;


      pendingPayments.push({
        paymentId: payment._id,
        studentId:
          payment.student || null,
        amount,
        commission,
        status:
          payment.status || "",
      });

    }

  });


  return {
    commissionRate,

    totalRevenueGenerated:
      Number(
        totalRevenueGenerated.toFixed(2)
      ),

    totalCommissionEarned:
      Number(
        totalCommissionEarned.toFixed(2)
      ),

    potentialRevenue:
      Number(
        potentialRevenue.toFixed(2)
      ),

    potentialCommission:
      Number(
        potentialCommission.toFixed(2)
      ),

    totalRevenueOpportunity:
      Number(
        (
          totalRevenueGenerated +
          potentialRevenue
        ).toFixed(2)
      ),

    totalCommissionOpportunity:
      Number(
        (
          totalCommissionEarned +
          potentialCommission
        ).toFixed(2)
      ),

    successfulPayments,
    pendingPayments,
  };

};// ======================================
// Get Ambassador Profile
// ======================================

export const getAmbassadorProfile =
  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      const profile =
        await AmbassadorProfile.findOne({
          user: userId,
        })
        .populate(
          "user",
          "name email role avatar phone referralCode ambassadorApproved status createdAt"
        );


      if (!profile) {
        return res.status(404).json({
          success:false,
          message:
            "Ambassador profile not found.",
        });
      }


      const code =
        profile.referralCode ||
        profile.user?.referralCode ||
        "";


      return res.json({
        success:true,

        profile:{
          ...profile.toObject(),

          referralCode:
            code,

          referralLink:
            getReferralLink(code),

          collegeId:
            profile.collegeId || "",

          collegeName:
            profile.college || "",
        },
      });


    } catch(error){

      console.error(
        "GET AMBASSADOR PROFILE ERROR:",
        error
      );


      return res.status(500).json({
        success:false,
        message:error.message,
      });

    }

};



// ======================================
// Save Ambassador Profile
// ======================================

export const saveAmbassadorProfile =
async(req,res)=>{

 try{

  const userId =
    getUserId(req);


  const user =
    await User.findById(userId);


  if(!user){

    return res.status(404).json({
      success:false,
      message:"User not found.",
    });

  }


  if(
    user.role !== "ambassador"
  ){

    return res.status(400).json({
      success:false,
      message:
        "User is not an ambassador.",
    });

  }


  let profile =
    await AmbassadorProfile.findOne({
      user:userId,
    });


  if(!profile){

    profile =
      new AmbassadorProfile({
        user:userId,
      });

  }



  const allowedFields = [

    "college",
    "university",
    "collegeId",
    "universityId",
    "city",
    "state",
    "phone",
    "bio",
    "instagram",
    "linkedin",
    "github",

  ];



  allowedFields.forEach(
    (field)=>{

      if(
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ){

        profile[field] =
          req.body[field] ?? "";

      }

    }
  );



  const completionFields = [

    "college",
    "university",
    "city",
    "state",
    "phone",
    "bio",
    "linkedin",
    "github",

  ];



  const completed =
    completionFields.filter(
      (field)=>
        profile[field] &&
        String(profile[field])
        .trim() !== ""
    ).length;



  profile.profileCompleted =
    Math.round(
      (
        completed /
        completionFields.length
      ) * 100
    );



  await profile.save();



  return res.json({

    success:true,

    message:
      "Ambassador profile saved.",

    profile,

  });



 }catch(error){

  console.error(
    "SAVE AMBASSADOR PROFILE ERROR:",
    error
  );


  return res.status(500).json({

    success:false,

    message:error.message,

  });

 }

};




// ======================================
// Ambassador Dashboard
// ======================================

export const ambassadorDashboard =
async(req,res)=>{

try{


const userId =
  getUserId(req);



const profile =
 await AmbassadorProfile.findOne({
   user:userId,
 });



if(!profile){

 return res.status(404).json({
   success:false,
   message:"Profile not found.",
 });

}



const students =
 await User.find({

   referredBy:
     profile.user,

   role:"student",

   isDeleted:{
     $ne:true,
   },

 })
 .select(
   "name email avatar createdAt"
 );



const studentIds =
 students.map(
   student=>student._id
 );




const [
 clicks,
 enrollments,
 certificates,
 payments,

]=await Promise.all([


Referral.countDocuments({

 ambassador:
   profile.user,

 clicked:true,

 student:null,

 isDeleted:false,

}),



Enrollment.countDocuments({

 student:{
   $in:studentIds,
 },

 isDeleted:false,

 status:{
   $in:[
    "Active",
    "Completed",
   ],
 },

}),



GeneratedCertificate.countDocuments({

 student:{
   $in:studentIds,
 },

 status:"approved",

}),



Payment.find({

 ambassador:
   profile.user,

 isDeleted:{
   $ne:true,
 },

})
.lean(),


]);



const revenue =
 calculateAmbassadorRevenue({

 payments,

 referredStudentIds:
   studentIds,

 commissionRate:
   DEFAULT_COMMISSION_RATE,

 });



const referralLink =
 getReferralLink(
   profile.referralCode
 );



const stats = {


 totalReferrals:
   students.length,


 successfulReferrals:
   enrollments,


 certificates,


 clicks,


 registrations:
   students.length,


 enrollments,


 rewardPoints:
   profile.rewardPoints,


 rank:
   profile.rank,


 commissionRate:
   revenue.commissionRate,


 totalRevenueGenerated:
   revenue.totalRevenueGenerated,


 totalCommissionEarned:
   revenue.totalCommissionEarned,


 potentialRevenue:
   revenue.potentialRevenue,


 potentialCommission:
   revenue.potentialCommission,


 totalRevenueOpportunity:
   revenue.totalRevenueOpportunity,


 totalCommissionOpportunity:
   revenue.totalCommissionOpportunity,


};



return res.json({

 success:true,


 stats,


 revenue:{


 generated:
  revenue.totalRevenueGenerated,


 earned:
  revenue.totalCommissionEarned,


 potential:
  revenue.potentialRevenue,


 potentialEarnings:
  revenue.potentialCommission,


 },


 referral:{


 code:
  profile.referralCode,


 link:
  referralLink,


 referralLink,

 },


 students,


});



}catch(error){

console.error(
 "AMBASSADOR DASHBOARD ERROR:",
 error
);


return res.status(500).json({

 success:false,

 message:error.message,

});


}

};
// ======================================
// Detailed Referral Students
// ======================================

export const getAmbassadorStudents =
async(req,res)=>{

try{

const userId =
  getUserId(req);



const profile =
 await AmbassadorProfile.findOne({
   user:userId,
 });



if(!profile){

 return res.status(404).json({
  success:false,
  message:
   "Ambassador profile not found.",
 });

}



const students =
 await User.find({

 referredBy:
  profile.user,

 role:"student",

 isDeleted:{
  $ne:true,
 },

})
.select(
 "name email avatar phone createdAt"
)
.sort({
 createdAt:-1,
});



const studentIds =
 students.map(
  student=>student._id
 );



const enrollments =
 await Enrollment.find({

 student:{
  $in:studentIds,
 },

 isDeleted:false,

})
.populate(
 "course",
 "title price thumbnail"
)
.populate(
 "internship",
 "title company price internshipImage"
)
.populate(
 "payment",
 "finalAmount originalAmount discountAmount status referralCode ambassador ambassadorCommissionAmount ambassadorCommissionType ambassadorCommissionValue"
)
.sort({
 enrollmentDate:-1,
});



const referrals =
 await Referral.find({

 ambassador:
  profile.user,

 student:{
  $in:studentIds,
 },

 isDeleted:false,

})
.sort({
 createdAt:-1,
});



const payments =
 await Payment.find({

 ambassador:
  profile.user,

 student:{
  $in:studentIds,
 },

 isDeleted:{
  $ne:true,
 },

})
.sort({
 createdAt:-1,
})
.lean();



const revenue =
 calculateAmbassadorRevenue({

 payments,

 referredStudentIds:
  studentIds,

 commissionRate:
  DEFAULT_COMMISSION_RATE,

});



const enrollmentMap =
 new Map();



enrollments.forEach(
(enrollment)=>{

 const key =
 String(enrollment.student);


 if(!enrollmentMap.has(key)){

  enrollmentMap.set(
   key,
   []
  );

 }


 enrollmentMap
 .get(key)
 .push(enrollment);

});



const referralMap =
 new Map();


referrals.forEach(
(referral)=>{

 referralMap.set(
  String(referral.student),
  referral
 );

});



const paymentMap =
 new Map();



payments.forEach(
(payment)=>{

 const key =
 String(payment.student);


 if(!paymentMap.has(key)){

  paymentMap.set(
   key,
   []
  );

 }


 paymentMap
 .get(key)
 .push(payment);

});



const result = [];



students.forEach(
(student)=>{


const key =
 String(student._id);



const studentEnrollments =
 enrollmentMap.get(key) || [];



const studentReferral =
 referralMap.get(key) || null;



const studentPayments =
 paymentMap.get(key) || [];



let amountPaid = 0;

let commissionEarned = 0;



studentPayments.forEach(
(payment)=>{

 const amount =
 getPaymentAmount(payment);


 if(
  isSuccessfulPayment(payment)
 ){

  amountPaid += amount;


  commissionEarned +=
   getCommission(
    amount,
    DEFAULT_COMMISSION_RATE
   );

 }

});




if(studentEnrollments.length===0){

 result.push({

  studentId:
   student._id,

  name:
   student.name,

  email:
   student.email,

  avatar:
   student.avatar,

  phone:
   student.phone,


  status:
   "Pending",


  enrolled:false,


  courseName:"",


  course:null,


  internship:null,


  payment:
   studentPayments[0] || null,


  referral:
   studentReferral,


  amountPaid,


  revenueGenerated:
   amountPaid,


  commissionEarned:
   Number(
    commissionEarned.toFixed(2)
   ),

 });


 return;

}




studentEnrollments.forEach(
(enrollment)=>{


const course =
 enrollment.course;


const internship =
 enrollment.internship;


const payment =
 enrollment.payment;



result.push({

 _id:
 `${student._id}-${enrollment._id}`,

 studentId:
  student._id,


 name:
  student.name,


 email:
  student.email,


 avatar:
  student.avatar,


 phone:
  student.phone,


 status:
  enrollment.status,


 enrollmentStatus:
  enrollment.status,


 enrolled:
 [
  "Active",
  "Completed",
 ].includes(
  enrollment.status
 ),


 courseName:
  course?.title ||
  internship?.title ||
  "",


 courseId:
  course?._id || null,


 internshipId:
  internship?._id || null,


 course,


 internship,


 enrollment:{


  _id:
   enrollment._id,


  status:
   enrollment.status,


  progress:
   enrollment.progress,


  enrollmentDate:
   enrollment.enrollmentDate,


  completionDate:
   enrollment.completionDate,

 },


 payment,


 referral:
  studentReferral,


 amountPaid,


 revenueGenerated:
  amountPaid,


 commissionEarned:
  Number(
   commissionEarned.toFixed(2)
  ),


});


});


});



const clicks =
 await Referral.countDocuments({

 ambassador:
  profile.user,

 clicked:true,

 student:null,

 isDeleted:false,

});



const enrollmentCount =
 enrollments.filter(
  item =>
  [
   "Active",
   "Completed",
  ].includes(
   item.status
  )
 ).length;



const completed =
 enrollments.filter(
  item =>
   item.status==="Completed"
 ).length;



return res.json({

 success:true,


 data:{


 analytics:{


 clicks,


 registrations:
  students.length,


 enrollments:
  enrollmentCount,


 completed,


 commissionRate:
  revenue.commissionRate,


 totalRevenueGenerated:
  revenue.totalRevenueGenerated,


 totalCommissionEarned:
  revenue.totalCommissionEarned,

 },


 referralCode:
  profile.referralCode,


 referralLink:
  getReferralLink(
   profile.referralCode
  ),


 rewardPoints:
  profile.rewardPoints,


 students:
  result,


 },


});



}catch(error){

console.error(
 "GET AMBASSADOR STUDENTS ERROR:",
 error
);


return res.status(500).json({

 success:false,

 message:error.message,

});


}

};




// ======================================
// Leaderboard
// ======================================

export const getLeaderboard =
async(req,res)=>{

try{


const ambassadors =
 await AmbassadorProfile.find({

 isActive:true,

})
.populate(
 "user",
 "name email avatar"
)
.sort({

 rewardPoints:-1,

})
.limit(20);



return res.json({

 success:true,

 ambassadors,

});


}catch(error){


console.error(
 "LEADERBOARD ERROR:",
 error
);


return res.status(500).json({

 success:false,

 message:error.message,

});


}

};