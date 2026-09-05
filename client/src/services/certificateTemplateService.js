import api from "./api";


// ======================================
// Create Certificate Template
// ======================================

export const createCertificateTemplate = async(formData)=>{

const {data}=await api.post(
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



// ======================================
// Get All Templates
// ======================================

export const getCertificateTemplates = async()=>{

const {data}=await api.get(
"/certificate-template"
);

return data;

};



// ======================================
// Get Active Template
// ======================================

export const getActiveTemplate = async()=>{

const {data}=await api.get(
"/certificate-template/active"
);

return data;

};



// ======================================
// Delete Template
// ======================================

export const deleteCertificateTemplate = async(id)=>{

const {data}=await api.delete(
`/certificate-template/${id}`
);

return data;

};