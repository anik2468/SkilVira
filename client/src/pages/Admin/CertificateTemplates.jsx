import { useEffect, useState } from "react";

import {
FiUpload,
FiTrash2,
FiFileText,
} from "react-icons/fi";


import {
createCertificateTemplate,
getCertificateTemplates,
deleteCertificateTemplate,
} from "../../services/certificateTemplateService";



const CertificateTemplates = () => {


const [templates,setTemplates] = useState([]);

const [loading,setLoading] = useState(true);

const [uploading,setUploading] = useState(false);



const [form,setForm] = useState({

name:"",
file:null,

});





useEffect(()=>{

loadTemplates();

},[]);





const loadTemplates = async()=>{


try{


const data =
await getCertificateTemplates();


setTemplates(
data.templates || []
);


}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};







const handleFile = (e)=>{


const file =
e.target.files[0];


if(file){

setForm({

...form,

file

});

}


};







const submitTemplate = async()=>{


try{


if(!form.name || !form.file){

alert(
"Please add template name and file"
);

return;

}




setUploading(true);



const formData =
new FormData();



formData.append(
"name",
form.name
);



formData.append(
"certificate",
form.file
);





await createCertificateTemplate(
formData
);





alert(
"Template uploaded successfully"
);





setForm({

name:"",
file:null

});



loadTemplates();



}catch(error){

console.log(error);

alert(
"Template upload failed"
);


}finally{


setUploading(false);


}


};








const removeTemplate = async(id)=>{


const confirmDelete =
window.confirm(
"Delete template?"
);


if(!confirmDelete)
return;



try{


await deleteCertificateTemplate(id);


loadTemplates();



}catch(error){

console.log(error);

}



};







return (


<div className="space-y-8 p-6">



<div>


<h1 className="text-3xl font-bold">

Certificate Templates

</h1>


<p className="mt-2 text-gray-500">

Manage SkilVira certificate designs

</p>


</div>







<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="mb-5 text-xl font-bold">

Upload New Template

</h2>





<input

type="text"

placeholder="Template Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

className="mb-4 w-full rounded-xl border p-3"

/>







<label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border p-4">


<FiUpload/>


{

uploading

?

"Uploading..."

:

"Choose Certificate Template"

}



<input

type="file"

hidden

accept="image/*,.pdf"

onChange={handleFile}

/>


</label>







{

form.file &&

<div className="mt-4 rounded-xl bg-gray-100 p-3">

Selected:

<p className="text-sm">

{form.file.name}

</p>


</div>

}





<button

onClick={submitTemplate}

className="mt-5 rounded-xl bg-[#D4AF37] px-6 py-3 text-white"

>


Save Template


</button>




</div>








<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="mb-5 text-xl font-bold">

Existing Templates

</h2>






{

loading

?

<p>
Loading...
</p>


:

templates.length===0

?

<p className="text-gray-500">

No templates found.

</p>


:


<div className="grid gap-5 md:grid-cols-3">


{

templates.map((template)=>(


<div

key={template._id}

className="rounded-xl border p-5"

>


<FiFileText className="text-4xl text-[#D4AF37]"/>



<h3 className="mt-3 font-bold">

{template.name}

</h3>




<p className="mt-2 break-all text-sm text-gray-500">

{template.templateFile}

</p>





<button

onClick={()=>removeTemplate(template._id)}

className="mt-4 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white"

>

<FiTrash2/>

Delete

</button>



</div>


))


}


</div>


}


</div>




</div>


);


};


export default CertificateTemplates;