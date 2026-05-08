import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ; 

export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_URL}/products/${id}`);
  return res.data;
};