// ✅ src/utils/newRequest.js
// src/utils/newRequest.js
import axios from "axios";


const newRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ send cookies
});

const token = sessionStorage.getItem("accessToken");
if (token) {
  newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ Utility: set token after login
export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem("accessToken", token);
    newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// ✅ Add Bearer token from localStorage (optional fallback)
newRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const logoutRequest = async () => {
  try {
    await newRequest.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


export default newRequest;

