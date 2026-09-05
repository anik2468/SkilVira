import { useState } from "react";
import api from "../../services/api";


const CreateUser = () => {


const [form,setForm] = useState({

name:"",
email:"",
password:"",
role:"student",

});


const [loading,setLoading] =
useState(false);



const changeHandler=(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value,

});

};





const submitHandler = async(e)=>{

e.preventDefault();


try{


setLoading(true);


await api.post(
"/control/users/create",
form
);


alert(
"User Created Successfully"
);



setForm({

name:"",
email:"",
password:"",
role:"student",

});



}catch(error){

console.log(error);


alert(
error?.response?.data?.message ||
"Unable to create user"
);


}
finally{

setLoading(false);

}


};






return (

<div className="rounded-2xl bg-white p-8 shadow">


<h1 className="text-3xl font-bold">
Create User
</h1>


<p className="mt-2 text-gray-500">
Admin can create student, recruiter, ambassador and employee accounts.
</p>





<form
onSubmit={submitHandler}
className="mt-8 grid gap-5 max-w-xl"
>



<input

name="name"

placeholder="Full Name"

value={form.name}

onChange={changeHandler}

className="rounded-xl border p-3"

required

/>





<input

name="email"

type="email"

placeholder="Email"

value={form.email}

onChange={changeHandler}

className="rounded-xl border p-3"

required

/>





<input

name="password"

type="password"

placeholder="Password"

value={form.password}

onChange={changeHandler}

className="rounded-xl border p-3"

required

/>







<select

name="role"

value={form.role}

onChange={changeHandler}

className="rounded-xl border p-3"

>


<option value="student">
Student
</option>


<option value="recruiter">
Recruiter
</option>


<option value="ambassador">
Ambassador
</option>


<option value="employee">
Employee
</option>


</select>







<button

disabled={loading}

className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"

>


{
loading
?
"Creating..."
:
"Create User"
}


</button>





</form>


</div>

);

};


export default CreateUser;