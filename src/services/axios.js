import axios from "axios";
import { useAuthStore } from "@/store/authStore";

let isRefreshing = false;
let failedQueue = [];

/**
 * Processes the queue of failed requests.
 * @param {Error|null} error - The error to reject the promises with.
 * @param {string|null} token - The new token to resolve the promises with.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

export const baseApiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken || localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Initialize retry count if not present
    config.retryCount = config.retryCount || 0;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // If retry count exceeds 3, clear auth state and reject
    if (originalRequest.retryCount >= 3) {
      authStore.clearAuthState();
      return Promise.reject(new Error("Maximum retry attempts reached"));
    }

    // Check for 401 Unauthorized error
    if (error.response?.status === 401 && originalRequest.retryCount < 3) {
      originalRequest.retryCount += 1; // Increment retry count

      if (isRefreshing) {
        // If token is already being refreshed, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await authStore.refreshToken(); // Refresh the token
        const newToken = authStore.accessToken;
        processQueue(null, newToken); // Resolve all queued requests
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        isRefreshing = false;
        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        processQueue(refreshError, null); // Reject all queued requests
        authStore.clearAuthState();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden error
    if (error.response?.status === 403) {
      authStore.clearAuthState();
      return Promise.reject(new Error("Access forbidden"));
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;
