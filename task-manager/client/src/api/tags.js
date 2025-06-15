import api from "../utils/axios";

export const getTags = async () => {
  const response = await api.get("/tags");
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await api.post("/tags", tagData);
  return response.data;
};

export const updateTag = async (id, tagData) => {
  const response = await api.put(`/tags/${id}`, tagData);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};
