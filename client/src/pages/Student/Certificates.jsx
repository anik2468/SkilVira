import { useEffect, useState } from "react";

import {
FiAward,
FiDownload,
FiCheckCircle,
FiExternalLink,
} from "react-icons/fi";


import {
getStudentCertificates
} from "../../services/certificateService";



const Certificates = () => {



const user =
JSON.parse(
localStorage.getItem("user")
);



const [certificates,setCertificates] = useState([]);

const [loading,setLoading] = useState(true);






useEffect(()=>{


loadCertificates();


},[]);






const loadCertificates = async()=>{


try{


const data =
await getStudentCertificates(
user?._id || user?.id
);



setCertificates(
data.certificates || []
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

<div className="flex min-h-[60vh] items-center justify-center">

<h2 className="text-xl font-bold">

Loading Certificates...

</h2>

</div>

);

}








return (

<div className="space-y-8">



<div>

<h1 className="text-3xl font-bold">

My Certificates 🏆

</h1>


<p className="mt-2 text-gray-500">

Your SkilVira achievements and certifications

</p>


</div>








{

certificates.length===0 ?


(

<div className="rounded-2xl bg-white p-10 text-center shadow">


<FiAward className="mx-auto mb-4 text-5xl text-[#D4AF37]" />


<h2 className="text-xl font-bold">

No Certificates Yet

</h2>


<p className="mt-2 text-gray-500">

Complete your courses to earn certificates.

</p>


</div>

)


:


(

<div className="grid gap-6 md:grid-cols-3">



{

certificates.map((certificate)=>(



<div

key={certificate._id}

className="rounded-2xl bg-white p-6 shadow"

>


<div className="mb-4 flex items-center justify-between">


<FiAward className="text-4xl text-[#D4AF37]" />



{

certificate.verified &&

<FiCheckCircle className="text-2xl text-green-600"/>

}



</div>






<h2 className="text-xl font-bold">

{certificate.title}

</h2>





<p className="mt-2 text-gray-500">

Issuer:

{certificate.issuer}

</p>







<p className="mt-4 text-sm">

Credential ID

</p>


<p className="break-all rounded bg-gray-100 p-2 text-sm">

{certificate.credentialId}

</p>







<p className="mt-3 text-sm text-gray-500">

Issue Date:

{

new Date(
certificate.issueDate
)
.toLocaleDateString()

}

</p>








<div className="mt-5 space-y-3">





{

certificate.certificateFile &&

<a

href={`http://localhost:5000${certificate.certificateFile}`}

target="_blank"

className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-white"

>


<FiDownload/>


Download PDF


</a>


}








{

certificate.credentialUrl &&


<a

href={certificate.credentialUrl}

target="_blank"

className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] py-3 text-[#D4AF37]"

>


<FiExternalLink/>


Verify Certificate


</a>


}





</div>





</div>



))


}



</div>


)

}



</div>


);


};


export default Certificates;