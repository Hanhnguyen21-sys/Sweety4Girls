import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const checkoutOrder = async (orderData) => {
  const res = await axios.post(`${API_URL}/checkout`, orderData);
  return res.data;
};

export const trackOrder = async (trackingData) => {
  const res = await axios.post(`${API_URL}/track`, trackingData);
  return res.data;
};