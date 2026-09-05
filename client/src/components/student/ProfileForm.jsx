import { useState } from "react";
import api from "../../services/api";


const ProfileForm = ({ form, setForm }) => {


const [uploading,setUploading] =
useState(false);



const update = (e)=>{

setForm({

...form,

[e.target.name]:
e.target.value,

});

};





const uploadImage = async(e)=>{


try{


const file =
e.target.files[0];


if(!file) return;




const data =
new FormData();


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
"multipart/form-data",

},

}

);




setForm({

...form,

profilePicture:
res.data.url,

});




alert(
"Image uploaded successfully"
);



}catch(error){


console.log(error);

alert(
"Image upload failed"
);


}finally{


setUploading(false);


}


};





return (

<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-6 text-2xl font-bold">

Personal Information

</h2>




<div className="grid gap-6 md:grid-cols-2">



{/* Profile Image Upload */}

<div>


<label className="mb-2 block font-medium">

Profile Picture

</label>



<input

type="file"

accept="image/*"

onChange={uploadImage}

className="w-full rounded-xl border p-3"

/>



{
uploading && (

<p className="mt-2 text-sm text-gray-500">

Uploading image...

</p>

)

}




{
form.profilePicture && (

<img

src={
`http://localhost:5000${form.profilePicture}`
}

className="mt-4 h-24 w-24 rounded-full object-cover"

alt="Preview"

/>

)

}



</div>





<div>

<label className="mb-2 block font-medium">

Phone

</label>


<input

type="text"

name="phone"

value={form.phone}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>






<div>

<label className="mb-2 block font-medium">

Gender

</label>


<select

name="gender"

value={form.gender}

onChange={update}

className="w-full rounded-xl border p-3"

>


<option value="">

Select

</option>


<option>

Male

</option>


<option>

Female

</option>


<option>

Other

</option>


</select>


</div>






<div>

<label className="mb-2 block font-medium">

Date of Birth

</label>


<input

type="date"

name="dateOfBirth"

value={
form.dateOfBirth?.substring(0,10)
}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div className="md:col-span-2">


<label className="mb-2 block font-medium">

Bio

</label>


<textarea

rows={4}

name="bio"

value={form.bio}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div className="md:col-span-2">


<label className="mb-2 block font-medium">

Address

</label>


<input

name="address"

value={form.address}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>


<label className="mb-2 block font-medium">

City

</label>


<input

name="city"

value={form.city}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>


<label className="mb-2 block font-medium">

State

</label>


<input

name="state"

value={form.state}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>


<label className="mb-2 block font-medium">

Country

</label>


<input

name="country"

value={form.country}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>







<div>


<label className="mb-2 block font-medium">

Pincode

</label>


<input

name="pincode"

value={form.pincode}

onChange={update}

className="w-full rounded-xl border p-3"

/>


</div>




</div>


</div>

);


};


export default ProfileForm;