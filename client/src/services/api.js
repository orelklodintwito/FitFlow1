import axios from "axios";

const api = axios.create({
  baseURL: "https://fitflow1.onrender.com/api",
});


// הוספת token אוטומטית לכל בקשה
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
