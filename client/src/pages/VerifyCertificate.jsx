import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
FiCheckCircle,
FiXCircle,
FiDownload,
} from "react-icons/fi";


import {
verifyCertificateByCredential
} from "../../services/certificateService";



const VerifyCertificate = ()=>{


const {credentialId}=useParams();


const [certificate,setCertificate]=useState(null);

const [loading,setLoading]=useState(true);





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



}catch(error){


console.log(error);


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






if(!certificate){


return (

<div className="flex min-h-screen items-center justify-center">


<div className="rounded-xl bg-white p-10 text-center shadow">


<FiXCircle className="mx-auto text-5xl text-red-500"/>


<h1 className="mt-4 text-2xl font-bold">

Invalid Certificate

</h1>


<p className="text-gray-500">

Certificate not found

</p>


</div>


</div>

);


}







return (

<div className="min-h-screen bg-gray-100 p-8">


<div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">



<div className="text-center">


<FiCheckCircle className="mx-auto text-6xl text-green-600"/>


<h1 className="mt-4 text-3xl font-bold">

Certificate Verified

</h1>


<p className="text-gray-500">

This certificate is issued by SkilVira

</p>


</div>






<div className="mt-8 space-y-4">


<p>

<b>Student:</b>

{certificate.student?.name}

</p>



<p>

<b>Certificate:</b>

{certificate.title}

</p>



<p>

<b>Issuer:</b>

{certificate.issuer}

</p>



<p>

<b>Credential ID:</b>

{certificate.credentialId}

</p>



<p>

<b>Date:</b>

{
new Date(
certificate.issueDate
).toLocaleDateString()
}

</p>



</div>






{

certificate.certificateFile &&


<a

href={`http://localhost:5000${certificate.certificateFile}`}

target="_blank"

className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-white"

>


<FiDownload/>

View Certificate


</a>


}





</div>


</div>

);


};




export default VerifyCertificate;