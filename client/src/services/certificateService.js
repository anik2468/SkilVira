import api from "./api";



// ======================================
// Get All Certificates (Admin)
// ======================================

export const getCertificates = async()=>{


const {data}=await api.get(

"/certificates"

);


return data;


};







// ======================================
// Student Certificates
// ======================================

export const getStudentCertificates = async(studentId)=>{


const {data}=await api.get(

`/certificates/student/${studentId}`

);


return data;


};







// ======================================
// Add Certificate
// ======================================

export const addCertificate = async(body)=>{


const {data}=await api.post(

"/certificates",

body

);


return data;


};







// ======================================
// Admin Verify Certificate
// ======================================

export const verifyCertificate = async(id)=>{


const {data}=await api.put(

`/certificates/verify/${id}`

);


return data;


};







// ======================================
// Public QR Verification
// ======================================

export const verifyCertificateByCredential = async(
credentialId
)=>{


const {data}=await api.get(

`/certificates/verify/${credentialId}`

);


return data;


};


// ======================================
// Reject Certificate
// ======================================

export const rejectCertificate = async(id)=>{

const {data}=await api.put(
`/certificates/reject/${id}`
);

return data;

};




// ======================================
// Delete Certificate
// ======================================

export const deleteCertificate = async(id)=>{


const {data}=await api.delete(

`/certificates/${id}`

);


return data;


};