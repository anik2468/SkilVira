import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


const ForgotPassword = () => {


  const [email,setEmail] = useState("");

  const [loading,setLoading] = useState(false);



  const handleSubmit = async()=>{


    try{


      setLoading(true);


      const {data} =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          {
            email,
          }
        );


      alert(
        data.message ||
        "Password reset link sent"
      );


    }catch(error){


      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );


    }finally{

      setLoading(false);

    }


  };



  return (

    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">


      <Card className="w-full max-w-md p-8">


        <h1 className="mb-6 text-center text-3xl font-bold">

          Forgot Password

        </h1>



        <div className="space-y-5">


          <Input

            label="Email"

            type="email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            placeholder="Enter registered email"

          />



          <Button

            className="w-full"

            onClick={handleSubmit}

            disabled={loading}

          >

            {
              loading
              ?
              "Sending..."
              :
              "Send Reset Link"
            }


          </Button>


        </div>



      </Card>


    </div>

  );

};


export default ForgotPassword;