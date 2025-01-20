import apiClient from "./axios";

const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8080";

export const likeService = {
  async getAllLikes() {
    const response = await apiClient.get(`${API_URL}/api/likes`);
    return response.data;
  },

  async createLike(userId, postId) {
    const response = await apiClient.post(`${API_URL}/api/likes`, {
      userId,
      postId,
    });
    return response.data;
  },

  async deleteLike(likeId) {
    await apiClient.delete(`${API_URL}/api/likes/${likeId}`);
  },

  async getLikesByPost(postId) {
    const response = await apiClient.get(`${API_URL}/api/likes/post/${postId}`);
    return response.data;
  },

  async getLikesByUser(userId) {
    const response = await apiClient.get(`${API_URL}/api/likes/user/${userId}`);
    return response.data;
  },
};
