import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";


const Login = () => {


  const { role } = useParams();

  const navigate = useNavigate();



  const roleName =
    role === "ambassador"
      ? "College Ambassador"
      : role?.charAt(0).toUpperCase() +
        role?.slice(1);



  const [formData,setFormData] =
    useState({

      email:"",
      password:"",

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





  const handleLoginSuccess=(user)=>{


    switch(user.role){


      case "student":
        navigate("/student/dashboard");
        break;


      case "recruiter":
        navigate("/recruiter/dashboard");
        break;


      case "ambassador":
        navigate("/ambassador/dashboard");
        break;


      case "employee":
        navigate("/employee/dashboard");
        break;


      case "control":
        navigate("/control/dashboard");
        break;


      default:
        navigate("/");

    }

  };






  const handleLogin=async()=>{


    try{


      setLoading(true);



      const res =
        await axios.post(

          "http://localhost:5000/api/auth/login",

          {

            email:
              formData.email,

            password:
              formData.password,

          }

        );



      const user =
        res.data.user;



      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );



      localStorage.setItem(
        "token",
        res.data.token
      );



      handleLoginSuccess(user);



    }catch(err){


      alert(

        err.response?.data?.message ||

        "Login Failed"

      );


    }finally{


      setLoading(false);


    }


  };





  const googleLogin=()=>{

    window.location.href =
      "http://localhost:5000/api/auth/google";

  };





  const linkedinLogin=()=>{

    window.location.href =
      "http://localhost:5000/api/auth/linkedin";

  };





  return (

<div className="flex min-h-screen bg-[#F8FAFC]">


<AuthBranding />



<div className="flex flex-1 items-center justify-center p-6">


<Card className="w-full max-w-md p-8">



<div className="mb-8 text-center">


<h1 className="text-4xl font-bold">

Welcome Back 👋

</h1>


<p className="mt-3 text-gray-500">

Login as

<span className="ml-2 font-semibold text-[#D4AF37]">

{roleName}

</span>

</p>


</div>





<div className="space-y-5">


<Input

label="Email"

name="email"

value={formData.email}

onChange={handleChange}

placeholder="Enter your email"

/>




<Input

type="password"

label="Password"

name="password"

value={formData.password}

onChange={handleChange}

placeholder="Enter password"

/>





<div className="flex justify-end">


<Link

to="/forgot-password"

className="text-sm text-[#D4AF37] hover:underline"

>

Forgot Password?

</Link>


</div>





<Button

className="w-full"

onClick={handleLogin}

disabled={loading}

>

{
loading
?
"Logging in..."
:
"Login"
}


</Button>



</div>







<div className="my-8 flex items-center">


<div className="h-px flex-1 bg-gray-200"/>


<span className="mx-4 text-sm text-gray-400">

OR

</span>


<div className="h-px flex-1 bg-gray-200"/>


</div>







<div className="grid grid-cols-2 gap-4">


<button

onClick={googleLogin}

className="rounded-xl border py-3 hover:bg-gray-50"

>

🔵 Google

</button>




<button

onClick={linkedinLogin}

className="rounded-xl border py-3 hover:bg-gray-50"

>

💼 LinkedIn

</button>


</div>





{role==="student" && (

<p className="mt-8 text-center text-gray-500">

Don't have an account?


<Link

to="/register/student"

className="ml-2 font-semibold text-[#D4AF37]"

>

Register

</Link>


</p>

)}



</Card>


</div>


</div>

  );

};


export default Login;