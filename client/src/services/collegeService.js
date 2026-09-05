import api from "./api";


// Get Colleges
export const getColleges = async () => {

  const { data } = await api.get(
    "/colleges"
  );

  return data;

};



// Verify College
export const verifyCollege = async (id) => {

  const { data } = await api.put(
    `/colleges/verify/${id}`
  );

  return data;

};



// Block College
export const blockCollege = async (id) => {

  const { data } = await api.put(
    `/colleges/block/${id}`
  );

  return data;

};