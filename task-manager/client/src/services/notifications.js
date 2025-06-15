import axios from "../utils/axios";

export const getNotifications = async () => {
  const response = await axios.get("/api/notifications");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(`/api/notifications/${id}`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch("/api/notifications/read-all");
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await axios.delete("/api/notifications");
  return response.data;
};
