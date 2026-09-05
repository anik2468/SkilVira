import api from "./api";



// ======================================
// Normal Upload
// ======================================

export const uploadFile = async(file)=>{


const formData = new FormData();


formData.append(
"file",
file
);



const {data} = await api.post(

"/upload",

formData,

{
headers:{
"Content-Type":"multipart/form-data",
},
}

);



return data;


};





// ======================================
// Certificate Template Upload
// ======================================

export const uploadCertificateTemplate = async(file)=>{


const formData = new FormData();


formData.append(

"certificate",

file

);




const {data} = await api.post(

"/certificate-template",

formData,

{
headers:{
"Content-Type":"multipart/form-data",
},
}

);



return data;


};