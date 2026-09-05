import { useEffect, useState } from "react";


const Settings = () => {


const [settings,setSettings] = useState({

platformName:"SkilVira",

maintenance:false,

emailNotification:true,

smsNotification:false,

allowRegistration:true,

});





useEffect(()=>{


const saved =
localStorage.getItem(
"adminSettings"
);


if(saved){

setSettings(
JSON.parse(saved)
);

}


},[]);









const changeHandler=(e)=>{


setSettings({

...settings,

[e.target.name]:

e.target.type==="checkbox"

?

e.target.checked

:

e.target.value,


});


};









const saveSettings=()=>{


localStorage.setItem(

"adminSettings",

JSON.stringify(settings)

);



alert(
"Settings Updated Successfully"
);



};










return (

<div className="space-y-8">





<div>


<h1 className="text-3xl font-bold">

Admin Settings

</h1>


<p className="mt-2 text-gray-500">

Manage complete platform configuration.

</p>


</div>









<div className="rounded-2xl bg-white p-8 shadow space-y-6">





{/* Platform */}


<div className="rounded-xl border p-6">


<h2 className="text-xl font-bold">

Platform Configuration

</h2>


<div className="mt-4">


<label className="font-medium">

Platform Name

</label>


<input

name="platformName"

value={settings.platformName}

onChange={changeHandler}

className="mt-2 w-full rounded-xl border p-3"

/>


</div>




<div className="mt-5 flex items-center gap-3">


<input

type="checkbox"

name="maintenance"

checked={settings.maintenance}

onChange={changeHandler}

/>


<span>

Enable Maintenance Mode

</span>



</div>


</div>









{/* Security */}


<div className="rounded-xl border p-6">


<h2 className="text-xl font-bold">

Security & Access

</h2>


<p className="mt-2 text-gray-500">

Manage user registration and platform access.

</p>





<div className="mt-5 flex items-center gap-3">


<input

type="checkbox"

name="allowRegistration"

checked={settings.allowRegistration}

onChange={changeHandler}

/>


<span>

Allow New User Registration

</span>



</div>



</div>









{/* Notification */}


<div className="rounded-xl border p-6">


<h2 className="text-xl font-bold">

Notifications

</h2>


<p className="mt-2 text-gray-500">

Manage communication settings.

</p>





<div className="mt-5 space-y-4">



<label className="flex items-center gap-3">


<input

type="checkbox"

name="emailNotification"

checked={settings.emailNotification}

onChange={changeHandler}

/>


Email Notifications


</label>






<label className="flex items-center gap-3">


<input

type="checkbox"

name="smsNotification"

checked={settings.smsNotification}

onChange={changeHandler}

/>


SMS Notifications


</label>





</div>



</div>









{/* Danger Zone */}


<div className="rounded-xl border border-red-200 bg-red-50 p-6">


<h2 className="text-xl font-bold text-red-600">

Danger Zone

</h2>


<p className="mt-2 text-gray-600">

Critical platform actions.

</p>



<button

className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-white"

onClick={()=>{

if(
confirm(
"Clear local admin settings?"
)
){

localStorage.removeItem(
"adminSettings"
);

alert(
"Settings Reset"
);

}

}}

>

Reset Settings

</button>



</div>









<button

onClick={saveSettings}

className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white"

>

Save Settings

</button>






</div>





</div>

);

};


export default Settings;