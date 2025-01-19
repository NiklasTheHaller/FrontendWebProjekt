// src/services/axios.js
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "http://localhost:8080", // defined in .env file
  withCredentials: true, // To send cookies
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Access Pinia store
    const token = authStore.accessToken || localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling global errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401) {
      // Attempt token refresh if a 401 error occurs
      try {
        await authStore.refreshToken();
        return apiClient.request(error.config); // Retry the failed request
      } catch (refreshError) {
        authStore.clearAuthState(); // Clear auth state if refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
