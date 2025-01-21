// userService.js

import apiClient from "@/services/axios";
import { jwtDecode } from "jwt-decode"; // Changed from import jwtDecode
import { useAuthStore } from "@/store/authStore";

/**
 * Retrieves the username from the JWT token.
 * @returns {string} - The username extracted from the token.
 * @throws {Error} - If no token is found.
 */
function getUsernameFromToken() {
  const authStore = useAuthStore();
  const token = authStore.accessToken || localStorage.getItem("accessToken"); // Consistent token retrieval
  if (!token) {
    throw new Error("No token found");
  }

  const decoded = jwtDecode(token);
  return decoded.sub; // Assuming 'sub' contains the username
}

/**
 * Fetches the user profile based on the username from the token.
 * @returns {Object} - The user profile data.
 * @throws {Error} - If fetching fails.
 */
export async function fetchUserProfile() {
  try {
    const username = getUsernameFromToken();

    const response = await apiClient.get(`/api/users/username/${username}`);
    return response.data; // Return updated profile data
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

/**
 * Updates the user profile with the provided payload.
 * @param {Object} payload - The data to update the user profile.
 * @returns {Object} - The updated user data.
 * @throws {Error} - If updating fails.
 */
export async function updateUserProfile(payload) {
  if (!payload) {
    throw new Error("Update payload is required");
  }

  try {
    const userProfile = await fetchUserProfile();

    // Only include fields that are present in the payload
    const finalPayload = {
      ...(payload.username && { username: payload.username.trim() }),
      ...(payload.email && { email: payload.email.trim() }),
      ...(payload.password && { password: payload.password }),
      role: "USER",
      ...(payload.salutation && { salutation: payload.salutation }),
      ...(payload.country && { country: payload.country }),
      ...(payload.fileId && { fileId: payload.fileId }), // Include fileId only if it exists
    };

    const response = await apiClient.put(
      `/api/users/${userProfile.id}`,
      finalPayload
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
}

/**
 * Fetches all users for admin purposes.
 * @returns {Object} - List of all users.
 * @throws {Error} - If fetching fails.
 */
export async function fetchAllUsers() {
  console.log("Fetching users..."); // Log when the function starts
  try {
    const response = await apiClient.get("/api/users");
    console.log("API response:", response.data); // Log the API data
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
}

/**
 * Updates a user's details (e.g., role, profile).
 * @param {string} userId - The user's ID.
 * @param {Object} payload - The data to update the user.
 * @returns {Object} - The updated user data.
 * @throws {Error} - If updating fails.
 */
export async function updateUserDetails(userId, payload) {
  try {
    const response = await apiClient.put(`/api/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
}

/**
 * Locks a user out of the application.
 * @param {string} userId - The user's ID.
 * @returns {void}
 * @throws {Error} - If locking fails.
 */
export async function lockUser(userId) {
  try {
    await apiClient.post(`/api/users/${userId}/lock`);
  } catch (error) {
    console.error("Failed to lock user:", error);
    throw error;
  }
}

/**
 * Deletes a user from the system.
 * @param {string} userId - The user's ID.
 * @returns {void}
 * @throws {Error} - If deletion fails.
 */
export async function deleteUser(userId) {
  try {
    await apiClient.delete(`/api/users/${userId}`);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}
