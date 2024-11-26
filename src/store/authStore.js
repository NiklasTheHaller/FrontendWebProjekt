import { defineStore } from "pinia";
import axios from "axios";

let mockMode = true; // Enable mock mode for testing

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: false,
    userRole: null,
    mockMode: false, // Remove mock mode when in production
  }),
  actions: {
    async login(email, password) {
      if (mockMode) {
        return this.mockLogin(email, password);
      }
      try {
        const response = await axios.post(
          "/api/login",
          { email, password },
          { withCredentials: true }
        );
        this.isAuthenticated = true;
        this.userRole = response.data.role;
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },

    async logout() {
      if (mockMode) {
        return this.mockLogout();
      }
      try {
        await axios.post("/api/logout", {}, { withCredentials: true });
        this.isAuthenticated = false;
        this.userRole = null;
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },

    async checkAuth() {
      if (mockMode) {
        return this.mockCheckAuth();
      }
      try {
        const response = await axios.get("/api/check-auth", {
          withCredentials: true,
        });
        this.isAuthenticated = true;
        this.userRole = response.data.role;
      } catch (error) {
        this.isAuthenticated = false;
        this.userRole = null;
      }
    },

    async switchRole(newRole) {
      if (mockMode) {
        return this.mockSwitchRole(newRole);
      }
      try {
        const response = await axios.post(
          "/api/switch-role",
          { role: newRole },
          { withCredentials: true }
        );
        this.userRole = response.data.role;
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Role switch failed:", error);
        this.isAuthenticated = false;
      }
    },

    // Mock implementations
    mockLogin(email, password) {
      if (email === "admin@test.com" && password === "admin") {
        this.isAuthenticated = true;
        this.userRole = "admin";
        return true;
      } else if (email === "user@test.com" && password === "user") {
        this.isAuthenticated = true;
        this.userRole = "user";
        return true;
      } else {
        this.isAuthenticated = false;
        return false;
      }
    },

    mockLogout() {
      this.isAuthenticated = false;
      this.userRole = null;
    },

    mockCheckAuth() {
      // Simulate a logged-in user and preserve the current role
      if (this.userRole) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
        this.userRole = null;
      }
    },

    mockSwitchRole(newRole) {
      if (newRole) {
        this.userRole = newRole;
        this.isAuthenticated = true; // Simulate an authenticated session
      } else {
        this.isAuthenticated = false;
        this.userRole = null;
      }
    },
  },
});
