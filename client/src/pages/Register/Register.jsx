import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";



const Register = () => {


const navigate = useNavigate();

const { role } = useParams();


const [searchParams] = useSearchParams();


// Referral Code From URL

const referralCode =
searchParams.get("ref") || "";





const allowedRoles = [

"student",

"recruiter",

"ambassador",

"employee",

];



const currentRole =
allowedRoles.includes(role)
?
role
:
"student";






const [formData,setFormData] =
useState({

name:"",

email:"",

password:"",

confirmPassword:"",

});





const [loading,setLoading] =
useState(false);







const handleChange=(e)=>{


setFormData((prev)=>({

...prev,

[e.target.name]:
e.target.value,

}));



};








const getRoleName=()=>{


const names={


student:"Student",

recruiter:"Recruiter",

ambassador:"College Ambassador",

employee:"Employee",


};



return names[currentRole];


};








const handleRegister = async()=>{


if(

!formData.name ||

!formData.email ||

!formData.password ||

!formData.confirmPassword

){


return alert(
"Please fill all fields."
);


}






if(
formData.password !==
formData.confirmPassword
){


return alert(
"Passwords do not match."
);


}







try{


setLoading(true);





await axios.post(

"http://localhost:5000/api/auth/register",

{


name:
formData.name,


email:
formData.email,


password:
formData.password,


role:
currentRole,



// Referral

referralCode:
currentRole==="student"
?
referralCode
:
null,


}

);






alert(

currentRole==="recruiter" ||
currentRole==="ambassador"

?

"Registration successful. Wait for approval."

:

"Registration successful."

);





navigate(
`/login/${currentRole}`
);





}catch(err){


console.error(err);


alert(

err.response?.data?.message ||

"Registration Failed"

);



}finally{


setLoading(false);


}



};









return (

<div className="flex min-h-screen bg-[#F8FAFC]">


<AuthBranding />



<div className="flex flex-1 items-center justify-center p-6">



<Card className="w-full max-w-md p-8">



<div className="mb-8 text-center">


<h1 className="text-4xl font-bold text-[#111827]">

{getRoleName()} Registration

</h1>


<p className="mt-3 text-gray-500">

Create your {getRoleName()} Account

</p>



{
referralCode &&
currentRole==="student" &&

<p className="mt-3 rounded-lg bg-green-50 p-2 text-sm text-green-700">

Referral Code Applied:
{referralCode}

</p>

}



</div>







<div className="space-y-5">



<Input

label="Full Name"

name="name"

value={formData.name}

onChange={handleChange}

placeholder="Enter your full name"

required

/>





<Input

label="Email"

name="email"

type="email"

value={formData.email}

onChange={handleChange}

placeholder="Enter your email"

required

/>






<Input

label="Password"

name="password"

type="password"

value={formData.password}

onChange={handleChange}

placeholder="Enter password"

required

/>






<Input

label="Confirm Password"

name="confirmPassword"

type="password"

value={formData.confirmPassword}

onChange={handleChange}

placeholder="Confirm password"

required

/>








<Button

className="w-full"

onClick={handleRegister}

disabled={loading}

>


{
loading
?
"Creating Account..."
:
`Create ${getRoleName()} Account`
}


</Button>



</div>








<p className="mt-8 text-center text-gray-500">


Already have an account?


<Link

to={`/login/${currentRole}`}

className="ml-2 font-semibold text-[#D4AF37] hover:underline"

>

Login

</Link>



</p>







<div className="mt-6 flex flex-col gap-2 text-center">



{
currentRole!=="student" &&

<Link
to="/register/student"
className="text-sm text-blue-600 hover:underline"
>

Register as Student

</Link>

}





{
currentRole!=="recruiter" &&

<Link
to="/register/recruiter"
className="text-sm text-blue-600 hover:underline"
>

Register as Recruiter

</Link>

}





{
currentRole!=="ambassador" &&

<Link
to="/register/ambassador"
className="text-sm text-blue-600 hover:underline"
>

Register as College Ambassador

</Link>

}





{
currentRole!=="employee" &&

<Link
to="/register/employee"
className="text-sm text-blue-600 hover:underline"
>

Register as Employee

</Link>

}





</div>





</Card>



</div>



</div>

);


};



export default Register;