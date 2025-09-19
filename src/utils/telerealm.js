import axios from "axios";

export const fileToCloud = async (document) => {
  try {
    const formData = new FormData();
    formData.append("bot_token", import.meta.env.VITE_BOT_TOKEN);
    formData.append("chat_id", import.meta.env.VITE_CHAT_ID);
    formData.append("document", document);

    const response = await axios.post(
      `${import.meta.env.VITE_CDN_URL}send`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file to cloud:", error);
    throw error;
  }
};
