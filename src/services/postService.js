import apiClient from "./axios";

const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8080";

export const postService = {
  async getAllPosts() {
    const response = await apiClient.get(`${API_URL}/api/posts`);
    return response.data;
  },

  async createPost(postData) {
    const response = await apiClient.post(`${API_URL}/api/posts`, postData);
    return response.data;
  },

  async getUserPostsById(userId) {
    const response = await apiClient.get(
      `${API_URL}/api/users/${userId}/posts`
    );
    return response.data;
  },

  async getPostById(id) {
    const response = await apiClient.get(`${API_URL}/api/posts/${id}`);
    return response.data;
  },

  async getPostsByUsername(username) {
    const response = await apiClient.get(
      `${API_URL}/api/posts/user/username/${username}`
    );
    return response.data;
  },

  async deletePost(id) {
    await apiClient.delete(`${API_URL}/api/posts/${id}`);
  },

  async updatePost(id, postData) {
    const response = await apiClient.put(
      `${API_URL}/api/posts/${id}`,
      postData
    );
    return response.data;
  },
};
