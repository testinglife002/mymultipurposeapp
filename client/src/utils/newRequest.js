  
import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // optional if using cookies
});

newRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default newRequest;


