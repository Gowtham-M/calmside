import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getCompanies = () => api.get("/companies");
export const getMenu = (company) => api.get(`/menu/${company}`);
export const postPayment = (data) => api.post("/payment", data);
export const postLogin = (data) => api.post("/login", data);

export default api;
