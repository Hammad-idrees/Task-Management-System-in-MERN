import axios from "../utils/axios";

export const exportTasksPDF = async () => {
  const response = await axios.get("/api/export/pdf", {
    responseType: "blob",
  });
  return response.data;
};

export const exportTasksCSV = async () => {
  const response = await axios.get("/api/export/csv", {
    responseType: "blob",
  });
  return response.data;
};
