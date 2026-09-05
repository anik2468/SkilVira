import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCourse
} from "../../services/courseService";

import {
  createPaymentOrder,
  verifyPayment
} from "../../services/paymentService";



const CourseDetails = () => {


const { id } = useParams();


const [course,setCourse] = useState(null);

const [loading,setLoading] = useState(true);

const [paying,setPaying] = useState(false);





useEffect(()=>{

loadCourse();

},[]);





const loadCourse = async()=>{


try{


const data = await getCourse(id);


setCourse(
data.course
);



}catch(error){

console.log(error);

}


finally{

setLoading(false);

}


};







const handleEnroll = async()=>{


try{


setPaying(true);



const user =
JSON.parse(
localStorage.getItem("user")
);



if(!user){

alert("Please login first");

return;

}





// Create Order

const orderData =
await createPaymentOrder({

student:user._id,

type:"course",

course:course._id,

amount:course.price,

});






const options = {


key:
import.meta.env.VITE_RAZORPAY_KEY_ID,


amount:
orderData.order.amount,


currency:
"INR",


name:
"SkilVira",


description:
course.title,


order_id:
orderData.order.id,





handler:async(response)=>{



const verifyData = await verifyPayment({

razorpay_order_id:
response.razorpay_order_id,


razorpay_payment_id:
response.razorpay_payment_id,


razorpay_signature:
response.razorpay_signature,


paymentId:
orderData.paymentId,

});




if(verifyData.success){


alert(
"Course enrolled successfully 🎉"
);


}



},



prefill:{


name:user.name,

email:user.email,


},



theme:{


color:"#D4AF37"


}



};






const razor =
new window.Razorpay(options);


razor.open();




}catch(error){


console.log(error);


alert(
"Payment failed"
);


}

finally{


setPaying(false);


}


};








if(loading){

return (

<div className="p-10">

Loading Course...

</div>

);

}






if(!course){

return (

<div className="p-10">

Course not found

</div>

);

}






return (


<div className="p-8">



<div className="overflow-hidden rounded-2xl bg-white shadow">



<img

src={
course.thumbnail
?
`http://localhost:5000${course.thumbnail}`
:
"https://via.placeholder.com/800x400"
}

className="h-80 w-full object-cover"

/>





<div className="p-8">


<h1 className="text-4xl font-bold">

{course.title}

</h1>



<p className="mt-4 text-gray-600">

{course.description}

</p>




<div className="mt-6 grid grid-cols-3 gap-5">


<div>

Category

<h3 className="font-bold">

{course.category}

</h3>

</div>



<div>

Duration

<h3 className="font-bold">

{course.duration}

</h3>

</div>




<div>

Price

<h3 className="font-bold">

₹ {course.price}

</h3>

</div>


</div>






<h2 className="mt-8 text-2xl font-bold">

Course Modules

</h2>



<ul className="mt-3 list-disc pl-6">


{

course.modules?.map(

(module,index)=>(

<li key={index}>

{module}

</li>

)

)

}


</ul>






<button

onClick={handleEnroll}

disabled={paying}

className="mt-8 rounded-xl bg-[#D4AF37] px-10 py-3 text-white"

>


{

paying
?
"Processing..."
:
"Enroll Now"

}


</button>




</div>


</div>


</div>


);


};


export default CourseDetails;