import { useState } from "react";

import { applyInternship } from "../../services/applicationService";

import {
createPaymentOrder,
verifyPayment,
} from "../../services/paymentService";

import api from "../../services/api";



const ApplyInternshipModal = ({
internship,
studentId,
onClose,
})=>{


const [loading,setLoading]=useState(false);

const [uploading,setUploading]=useState(false);



const [form,setForm]=useState({

resume:"",

coverLetter:"",

portfolio:"",

referralCode:"",

discount:0,

finalAmount:
internship.price,

});





const changeHandler=(e)=>{


setForm({

...form,

[e.target.name]:
e.target.value,

});


};






const uploadResume = async(e)=>{


try{


const file=e.target.files[0];


if(!file)
return;



const data=new FormData();


data.append(
"image",
file
);



setUploading(true);



const res =
await api.post(

"/upload/avatar",

data,

{

headers:{

"Content-Type":
"multipart/form-data"

}

}

);





setForm(prev=>({

...prev,

resume:
res.data.url

}));





alert(
"Resume uploaded successfully"
);



}catch(error){


console.log(error);

alert(
"Resume upload failed"
);


}finally{

setUploading(false);

}


};









// Apply Referral

const applyReferral=async()=>{


try{


if(!form.referralCode){

return alert(
"Enter referral code"
);

}



const {data}=await api.post(

"/referral/validate",

{

code:
form.referralCode,

internshipId:
internship._id

}

);






if(data.success){


setForm(prev=>({

...prev,

discount:
data.discount,

finalAmount:
data.finalAmount

}));



alert(
"Referral discount applied"
);


}



}catch(error){


console.log(error);


alert(
"Invalid referral code"
);


}


};









const submitApplication=async()=>{


await applyInternship({

student:studentId,

internship:
internship._id,

resume:
form.resume,

coverLetter:
form.coverLetter,

portfolio:
form.portfolio,


});


};










const payNow=async()=>{


try{


setLoading(true);





const orderData =
await createPaymentOrder({

student:studentId,


type:"internship",


internship:
internship._id,


amount:
internship.price,


referralCode:
form.referralCode,

});








const options={


key:
import.meta.env.VITE_RAZORPAY_KEY_ID,


amount:
orderData.order.amount,


currency:"INR",


name:"SkilVira",


description:
internship.title,


order_id:
orderData.order.id,





handler:
async(response)=>{





await verifyPayment({

razorpay_order_id:
response.razorpay_order_id,


razorpay_payment_id:
response.razorpay_payment_id,


razorpay_signature:
response.razorpay_signature,


paymentId:
orderData.paymentId,


});






alert(
"Payment successful"
);





onClose();



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


}finally{


setLoading(false);


}



};









const submitHandler=async(e)=>{


e.preventDefault();



if(!form.resume){

return alert(
"Please upload resume"
);

}





try{


if(Number(internship.price)>0){


await payNow();


}else{


await submitApplication();


alert(
"Application submitted"
);


onClose();


}



}catch(error){


console.log(error);


alert(
"Unable to submit"
);


}



};









return (

<div className="
fixed inset-0
z-50
flex
items-center
justify-center
bg-black/50
p-4
">


<div className="
w-full
max-w-2xl
rounded-2xl
bg-white
p-8
shadow-xl
">



<h2 className="
mb-6
text-3xl
font-bold
">

Apply Internship

</h2>






<form
onSubmit={submitHandler}
className="space-y-5"
>




<label className="font-medium">

Upload Resume (PDF)

</label>



<input

type="file"

accept=".pdf"

onChange={uploadResume}

className="w-full rounded-xl border p-3"

/>





{
uploading &&

<p>
Uploading Resume...
</p>

}





{
form.resume &&

<p className="text-green-600">

Resume Uploaded ✅

</p>

}






<textarea

name="coverLetter"

placeholder="Cover Letter"

value={form.coverLetter}

onChange={changeHandler}

rows="5"

className="w-full rounded-xl border p-3"

/>






<input

type="url"

name="portfolio"

placeholder="Portfolio / Github"

value={form.portfolio}

onChange={changeHandler}

className="w-full rounded-xl border p-3"

/>








<div className="flex gap-3">


<input

name="referralCode"

placeholder="Referral Code"

value={form.referralCode}

onChange={changeHandler}

className="flex-1 rounded-xl border p-3"

/>




<button

type="button"

onClick={applyReferral}

className="
rounded-xl
bg-black
px-5
text-white
"

>

Apply

</button>



</div>







{
form.discount>0 &&

<div className="
rounded-xl
bg-green-50
p-4
text-green-700
">

Discount:

₹{form.discount}


<br/>

Pay:

₹{form.finalAmount}

</div>

}






<div className="flex justify-end gap-4">


<button

type="button"

onClick={onClose}

className="rounded-xl border px-6 py-3"

>

Cancel

</button>




<button

disabled={loading}

className="
rounded-xl
bg-[#D4AF37]
px-8
py-3
text-white
font-semibold
"

>


{
loading
?
"Processing..."
:
`Pay ₹${form.finalAmount} & Apply`
}


</button>


</div>




</form>


</div>


</div>


);


};


export default ApplyInternshipModal;