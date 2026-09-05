import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
FiCheckCircle,
FiXCircle,
FiAward,
} from "react-icons/fi";


import {
verifyCertificateByCredential
} from "../services/certificateService";



const CertificateVerify = () => {


const { credentialId } = useParams();


const [certificate,setCertificate] = useState(null);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");





useEffect(()=>{

verify();

},[]);






const verify = async()=>{


try{


const data =
await verifyCertificateByCredential(
credentialId
);



setCertificate(
data.certificate
);



}catch(err){


console.log(err);


setError(
"Certificate not found or invalid"
);


}

finally{

setLoading(false);

}


};







if(loading){

return (

<div className="flex min-h-screen items-center justify-center">

<h2 className="text-xl font-bold">

Verifying Certificate...

</h2>

</div>

);

}







return (

<div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">


<div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">



{

certificate ?


<>


<FiCheckCircle className="mx-auto text-6xl text-green-600"/>



<h1 className="mt-5 text-3xl font-bold text-green-600">

Certificate Verified

</h1>





<FiAward className="mx-auto mt-6 text-5xl text-[#D4AF37]"/>





<h2 className="mt-5 text-2xl font-bold">

{certificate.title}

</h2>





<div className="mt-6 space-y-3 text-left">


<p>

<b>Student:</b>

{" "}

{certificate.student?.name}

</p>



<p>

<b>Email:</b>

{" "}

{certificate.student?.email}

</p>



<p>

<b>Issuer:</b>

{" "}

{certificate.issuer}

</p>



<p>

<b>Credential ID:</b>

{" "}

{certificate.credentialId}

</p>



<p>

<b>Issue Date:</b>

{" "}

{

new Date(
certificate.issueDate
)
.toLocaleDateString()

}

</p>



</div>



</>



:


<>


<FiXCircle className="mx-auto text-6xl text-red-600"/>



<h1 className="mt-5 text-3xl font-bold text-red-600">

Invalid Certificate

</h1>



<p className="mt-3 text-gray-500">

{error}

</p>


</>


}



</div>


</div>

);


};


export default CertificateVerify;