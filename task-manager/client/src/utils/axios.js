import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
