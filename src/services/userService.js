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
  try {
    // Fetch the user profile to get the ID
    const userProfile = await fetchUserProfile();

    console.log("User Profile:", userProfile);
    console.log("Payload:", payload);

    // Ensure the profile contains an ID
    if (!userProfile.id) {
      throw new Error(
        "User ID is missing in the fetched profile. Cannot update user."
      );
    }

    // Prepare the final payload
    const finalPayload = {
      username: payload.username.trim(), // Ensure no trailing spaces
      email: payload.email.trim(), // Ensure email is properly formatted
      password: payload.password, // Password validation should already be done
      role: "USER", // Hardcoded role
      salutation: payload.salutation,
      country: payload.country,
    };

    console.log("Final Payload:", finalPayload);

    // Perform the update API call
    const response = await apiClient.put(
      `/api/users/${userProfile.id}`,
      finalPayload
    );

    // Return the updated user data
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
}
