import axios from "../utils/axios";

export const login = async (credentials) => {
  const response = await axios.post("/api/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post("/api/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/api/auth/profile");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axios.put("/api/auth/profile", userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.put("/api/auth/profile", passwordData);
  return response.data;
};
