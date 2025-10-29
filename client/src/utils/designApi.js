import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL + "/api/designs" });

// You can add auth headers here if needed
// API.interceptors.request.use(cfg => { cfg.headers.Authorization = `Bearer ${token}`; return cfg; });

export const createDesign = (payload) => API.post("/save", payload);
export const listDesigns  = (userId)   => API.get("/", { params: { userId } });
export const getDesign    = (id)       => API.get(`/${id}`);
export const updateDesign = (id, body) => API.patch(`/${id}`, body);

export const uploadImage  = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return API.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
};
