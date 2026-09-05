import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


const ResetPassword = () => {


  const { token } = useParams();

  const navigate = useNavigate();



  const [password,setPassword] = useState("");

  const [confirmPassword,setConfirmPassword] = useState("");

  const [loading,setLoading] = useState(false);





  const handleSubmit = async()=>{


    if(password !== confirmPassword){

      return alert(
        "Passwords do not match"
      );

    }



    try{


      setLoading(true);



      const {data} =
        await axios.post(

          `http://localhost:5000/api/auth/reset-password/${token}`,

          {
            password,
          }

        );



      alert(
        data.message ||
        "Password reset successful"
      );


      navigate("/login/student");



    }catch(error){


      alert(

        error.response?.data?.message ||

        "Reset password failed"

      );


    }finally{

      setLoading(false);

    }


  };





  return (

    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">


      <Card className="w-full max-w-md p-8">


        <h1 className="mb-6 text-center text-3xl font-bold">

          Reset Password

        </h1>



        <div className="space-y-5">



          <Input

            label="New Password"

            type="password"

            value={password}

            onChange={(e)=>
              setPassword(e.target.value)
            }

            placeholder="Enter new password"

          />



          <Input

            label="Confirm Password"

            type="password"

            value={confirmPassword}

            onChange={(e)=>
              setConfirmPassword(e.target.value)
            }

            placeholder="Confirm password"

          />




          <Button

            className="w-full"

            onClick={handleSubmit}

            disabled={loading}

          >

            {
              loading
              ?
              "Updating..."
              :
              "Update Password"
            }


          </Button>



        </div>


      </Card>


    </div>

  );

};


export default ResetPassword;