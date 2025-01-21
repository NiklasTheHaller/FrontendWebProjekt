import apiClient from "@/services/axios";

const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8080";

export const fileService = {
  // Add proper error handling and null checks
  async uploadFile(file) {
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post(`${API_URL}/api/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  },

  async getFile(fileId) {
    if (!fileId) {
      throw new Error("No fileId provided");
    }

    try {
      const response = await apiClient.get(`${API_URL}/api/files/${fileId}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("File fetch failed:", error);
      throw error;
    }
  },
};

export default fileService;
