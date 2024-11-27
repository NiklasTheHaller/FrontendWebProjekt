import apiClient from "@/services/axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";

function getUsernameFromToken() {
    const authStore = useAuthStore();
    const token = authStore.accessToken; // or use authStore.accessToken
    if (!token) {
        throw new Error("No token found");
    }

    const decoded = jwtDecode(token);
    return decoded.sub;
}


export async function fetchUserProfile() {
    try {
        const username = getUsernameFromToken();
    
        const response = await apiClient.get(`/api/users/username/${username}`);
        return response.data; // Return updated profile data
    } catch (error) {
        console.error("Failed to update user profile:", error);
        throw error;
    }
}

export async function updateUserProfile(payload) {
    try {
        // Fetch the user profile to get the ID
        const userProfile = await fetchUserProfile();

        // Ensure the profile contains an ID
        if (!userProfile.id) {
            throw new Error("User ID is missing in the fetched profile. Cannot update user.");
        }
        const finalPayload = {
            username: payload.username.trim(), // Ensure no trailing spaces
            email: payload.email.trim(),       // Ensure email is properly formatted
            password: payload.password,        // Password validation should already be done
            role: "USER",                      // Hardcoded role
        };

        console.log("Final Payload:", finalPayload); 


        // Perform the update API call
        const response = await apiClient.put(`/api/users/${userProfile.id}`, finalPayload);

        // Return the updated user data
        return response.data;
    } catch (error) {
        console.error("Failed to update user profile:", error);
        throw error;
    }
}