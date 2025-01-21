// src/store/authStore.js

import { defineStore } from "pinia";
import { baseApiClient } from "@/services/axios";
import { jwtDecode } from "jwt-decode";
import router from "@/router";

const API_BASE_URL = "/api/auth";
const REFRESH_THRESHOLD = 60000; // Refresh token 1 minute before expiration

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: false,
    userRole: null,
    accessToken: null,
    refreshTimer: null,
    identifier: null,
  }),
  actions: {
    /**
     * Logs in the user with the provided credentials.
     * @param {string} identifier - The username or email.
     * @param {string} password - The user's password.
     * @returns {boolean} - Returns true if login is successful, else false.
     */
    async login(identifier, password) {
      try {
        const response = await baseApiClient.post(`${API_BASE_URL}`, {
          identifier,
          password,
        });

        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },

    /**
     * Sets the access and refresh tokens in the state and localStorage.
     * @param {string} accessToken - The JWT access token.
     * @param {string} refreshToken - The JWT refresh token.
     */
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken;
      this.isAuthenticated = true;

      const decoded = jwtDecode(accessToken);
      this.userRole = decoded.role;
      this.identifier = decoded.sub;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", this.userRole);
      localStorage.setItem("identifier", this.identifier);

      // Start monitoring token expiration
      this.startRefreshTimer();
    },

    /**
     * Starts a timer to refresh the access token before it expires.
     */
    startRefreshTimer() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      const decoded = jwtDecode(this.accessToken);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilRefresh = expirationTime - currentTime - REFRESH_THRESHOLD;

      if (timeUntilRefresh > 0) {
        this.refreshTimer = setTimeout(async () => {
          await this.refreshToken();
        }, timeUntilRefresh);
      } else {
        // Token is already close to expiration or expired
        this.refreshToken();
      }
    },

    /**
     * Logs out the user by invalidating the refresh token and clearing auth state.
     */
    async logout() {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        await baseApiClient.post(`${API_BASE_URL}/logout`, {
          token: refreshToken,
        });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        this.clearAuthState();
      }
    },

    /**
     * Clears the authentication state and removes tokens from localStorage.
     */
    clearAuthState() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.accessToken = null;
      this.identifier = null;

      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("identifier");
    },

    /**
     * Checks if the current token is valid by verifying with the backend.
     */
    // In src/store/authStore.js
    async checkAuth() {
      const token = this.accessToken || localStorage.getItem("accessToken");
      if (!token) {
        this.clearAuthState();
        return false; // Return false instead of redirecting
      }

      try {
        const response = await baseApiClient.get(
          `${API_BASE_URL}/check?token=${encodeURIComponent(token)}`
        );
        this.isAuthenticated = true;
        this.userRole = response.data.role;
        return true; // Return true on success
      } catch (error) {
        console.error("Auth check failed:", error);
        try {
          await this.refreshToken();
          return true; // Return true if refresh successful
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          this.clearAuthState();
          router.push("/login");
          return false; // Return false if both checks fail
        }
      }
    },

    /**
     * Refreshes the access token using the refresh token.
     */
    async refreshToken() {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken || typeof refreshToken !== "string") {
          throw new Error("Invalid or missing refresh token");
        }

        const response = await baseApiClient.post(`${API_BASE_URL}/refresh`, {
          token: refreshToken,
        });

        if (!response.data?.token) {
          throw new Error("No access token received from refresh endpoint");
        }

        this.setTokens(response.data.token, refreshToken);

        return true;
      } catch (error) {
        console.error("Token refresh failed:", error.message);
        this.clearAuthState();
        router.push("/login");
        return false;
      }
    },
  },
});
