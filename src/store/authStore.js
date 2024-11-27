// src/store/authStore.js
import { defineStore } from "pinia";
import apiClient from "@/services/axios";

const API_BASE_URL = "/api/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: false,
    userRole: null,
    accessToken: null, // Store the access token
  }),
  actions: {
    async login(identifier, password) {
      try {
        const response = await apiClient.post(`${API_BASE_URL}`, {
          identifier,
          password,
        });

        this.accessToken = response.data.accessToken;
        this.isAuthenticated = true;
        this.userRole = response.data.role;

        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken); // Store refresh token
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    async setUserProfile(profileData) {
      this.userProfile = profileData;
    },
    async logout() {
      try {
        await apiClient.post(`${API_BASE_URL}/logout`, {
          token: localStorage.getItem("refreshToken"),
        });
        this.clearAuthState();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    clearAuthState() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.accessToken = null;
      localStorage.removeItem("accessToken");
    },

    async checkAuth() {
      const token = this.accessToken || localStorage.getItem("accessToken");
      if (!token) {
        this.clearAuthState();
        return;
      }

      try {
        const response = await apiClient.get(`${API_BASE_URL}/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.isAuthenticated = true;
        this.userRole = response.data.role;
      } catch (error) {
        console.error("Auth check failed:", error);
        await this.refreshToken(); // Try refreshing if the token is expired
      }
    },

    async refreshToken() {
      try {
        const response = await apiClient.post(`${API_BASE_URL}/refresh`, {
          token: localStorage.getItem("refreshToken"), // Send the refresh token
        });
        this.accessToken = response.data.token; // Use 'token' instead of 'accessToken'
        localStorage.setItem("accessToken", this.accessToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
        this.clearAuthState();
      }
    },
  },
});
