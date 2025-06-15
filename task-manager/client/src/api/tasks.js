import api from "../utils/axios";

export const getTasks = async (filters = {}) => {
  const response = await api.get("/tasks", { params: filters });
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const toggleTaskCompletion = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data;
};

export const exportTasks = async (format) => {
  const response = await api.get(`/tasks/export/${format}`, {
    responseType: "blob",
  });
  return response.data;
};
