import { useState } from "react";
import api from "../../services/api";


const CompanyProfile = () => {


const user = JSON.parse(
  localStorage.getItem("user")
);



const [loading,setLoading] =
useState(false);



const [uploading,setUploading] =
useState(false);



const [company,setCompany] = useState({

recruiter:user?.id || "",

logo:"",

name:"",

website:"",

email:user?.email || "",

phone:"",

industry:"",

founded:"",

employees:"",

headquarters:"",

description:"",

linkedin:"",

twitter:"",

});





const update=(e)=>{

setCompany({

...company,

[e.target.name]:
e.target.value,

});

};







const uploadLogo = async(e)=>{


try{


const file =
e.target.files[0];


if(!file) return;



const formData =
new FormData();



formData.append(
"image",
file
);



setUploading(true);



const res =
await api.post(

"/upload/avatar",

formData,

{

headers:{

"Content-Type":
"multipart/form-data",

},

}

);




setCompany({

...company,

logo:
res.data.url,

});



alert(
"Company Logo Uploaded Successfully"
);



}catch(error){


console.log(error);


alert(
"Logo Upload Failed"
);



}finally{


setUploading(false);


}


};








const save = async()=>{


try{


setLoading(true);



localStorage.setItem(

"companyProfile",

JSON.stringify(company)

);



alert(
"Company Profile Saved Successfully"
);



}catch(error){


console.log(error);


alert(
"Unable to save profile"
);



}finally{


setLoading(false);


}



};







return (

<div className="mx-auto max-w-7xl space-y-8">



<div className="flex items-center justify-between">


<div>

<h1 className="text-4xl font-bold">
Company Profile
</h1>


<p className="mt-2 text-gray-500">
Complete your company profile.
</p>


</div>



<button

onClick={save}

disabled={loading}

className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white"

>


{
loading
?
"Saving..."
:
"Save Profile"
}



</button>



</div>








<div className="rounded-2xl bg-white p-8 shadow">



<div className="grid gap-6 md:grid-cols-2">





{/* LOGO UPLOAD */}

<div>


<label className="mb-2 block font-medium">

Company Logo

</label>



<input

type="file"

accept="image/*"

onChange={uploadLogo}

className="w-full rounded-xl border p-3"

/>



{
uploading && (

<p className="mt-2 text-gray-500">

Uploading...

</p>

)

}



{
company.logo && (

<img

src={
`http://localhost:5000${company.logo}`
}

className="mt-4 h-28 w-28 rounded-xl object-cover"

alt="logo"

/>

)

}



</div>







<div>

<label className="mb-2 block font-medium">

Company Name

</label>


<input

name="name"

value={company.name}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Website
</label>


<input

name="website"

value={company.website}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Official Email
</label>


<input

name="email"

value={company.email}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Phone Number
</label>


<input

name="phone"

value={company.phone}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Industry
</label>


<input

name="industry"

value={company.industry}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Founded Year
</label>


<input

type="number"

name="founded"

value={company.founded}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Employees
</label>


<input

type="number"

name="employees"

value={company.employees}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div className="md:col-span-2">

<label>
Headquarters
</label>


<input

name="headquarters"

value={company.headquarters}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div className="md:col-span-2">

<label>
Company Description
</label>


<textarea

rows="5"

name="description"

value={company.description}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
LinkedIn
</label>


<input

name="linkedin"

value={company.linkedin}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>

<label>
Twitter / X
</label>


<input

name="twitter"

value={company.twitter}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>






</div>



</div>



</div>

);

};


export default CompanyProfile;