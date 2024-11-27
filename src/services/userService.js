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


export async function updateUserProfile() {
    try {
        const username = getUsernameFromToken();
        const response = await apiClient.get(`/api/users/username/${username}`);
        console.log("User profile:", response.data); // Log the response data
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
    }
}