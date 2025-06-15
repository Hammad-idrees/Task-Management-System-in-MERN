import axios from "../utils/axios";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post("/api/chatbot/message", { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};

export const getInitialSuggestions = async () => {
  try {
    const response = await axios.get("/api/chatbot/suggestions");
    return response.data;
  } catch (error) {
    console.error("Error getting chatbot suggestions:", error);
    throw error;
  }
};
