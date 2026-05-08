import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

export const checkoutOrder = async (orderData) => {
  const res = await axios.post(`${API_URL}/checkout`, orderData);
  return res.data;
};

export const trackOrder = async (trackingData) => {
  const res = await axios.post(`${API_URL}/track`, trackingData);
  return res.data;
};