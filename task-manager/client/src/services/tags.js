import axios from "../utils/axios";

export const getTags = async () => {
  const response = await axios.get("/api/tags");
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await axios.post("/api/tags", tagData);
  return response.data;
};

export const updateTag = async (tagData) => {
  const { id, ...data } = tagData;
  const response = await axios.put(`/api/tags/${id}`, data);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await axios.delete(`/api/tags/${id}`);
  return response.data;
};
