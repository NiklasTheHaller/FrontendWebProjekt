import apiClient from "./axios";
import {jwtDecode} from "jwt-decode";

const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8080";

export const userService = {
  /**
   * Retrieves the username from the JWT token.
   * @returns {string} - The username extracted from the token.
   * @throws {Error} - If no token is found.
   */
  getUsernameFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const decoded = jwtDecode(token);
    return decoded.sub; // Assuming 'sub' contains the username
  },

  /**
   * Fetches the user profile based on the username from the token.
   * @returns {Object} - The user profile data.
   * @throws {Error} - If fetching fails.
   */
  async fetchUserProfile() {
    const username = this.getUsernameFromToken();
    const response = await apiClient.get(`${API_URL}/api/users/username/${username}`);
    return response.data;
  },

  /**
   * Updates the user profile with the provided payload.
   * @param {Object} payload - The data to update the user profile.
   * @returns {Object} - The updated user data.
   * @throws {Error} - If updating fails.
   */
  async updateUserProfile(payload) {
    if (!payload) {
      throw new Error("Update payload is required");
    }

    const userProfile = await this.fetchUserProfile();

    const response = await apiClient.put(`${API_URL}/api/users/${userProfile.id}`, payload);
    return response.data;
  },

  /**
   * Fetches all users for admin purposes.
   * @returns {Array} - List of all users.
   * @throws {Error} - If fetching fails.
   */
  async fetchAllUsers() {
    const response = await apiClient.get(`${API_URL}/api/users`);
    return response.data;
  },

  /**
   * Updates a user's details (e.g., role, profile).
   * @param {string} userId - The user's ID.
   * @param {Object} payload - The data to update the user.
   * @returns {Object} - The updated user data.
   * @throws {Error} - If updating fails.
   */
  async updateUserDetails(userId, payload) {
    const response = await apiClient.put(`${API_URL}/api/users/${userId}`, payload);
    return response.data;
  },

  /**
   * Locks a user out of the application.
   * @param {string} userId - The user's ID.
   * @returns {boolean} - True if successful.
   * @throws {Error} - If locking fails.
   */
  async lockUser(userId) {
    await apiClient.post(`${API_URL}/api/users/${userId}/lock`);
    return true;
  },

  /**
   * Deletes a user from the system.
   * @param {string} userId - The user's ID.
   * @returns {boolean} - True if successful.
   * @throws {Error} - If deletion fails.
   */
  async deleteUser(userId) {
    try {
      console.log(`Fetching posts for user ${userId}...`);

      // Fetch the user's posts
      const response = await apiClient.get(`${API_URL}/api/posts/user/${userId}`);
      const userPosts = response.data;

      console.log(`Found ${userPosts.length} posts for user ${userId}. Deleting posts...`);

      // Delete all posts for the user
      for (const post of userPosts) {
        await apiClient.delete(`${API_URL}/api/posts/${post.id}`);
      }

      console.log(`All posts deleted for user ${userId}. Proceeding to delete user...`);

      // Delete the user
      await apiClient.delete(`${API_URL}/api/users/${userId}`);
      console.log(`User ${userId} deleted successfully.`);

      return true;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error.response || error.message);
      throw error;
    }
  }

};
