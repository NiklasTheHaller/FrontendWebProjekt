// src/store/allUserStore.js
import { defineStore } from "pinia";
import {userService} from "@/services/userService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    users: [], // List of all users
    currentUser: null, // The current user's details
    loading: false, // Loading state for async operations
    error: null, // Error state for error handling
  }),

  actions: {
    /**
     * Fetch all users and store them in the state.
     */
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await userService.fetchAllUsers(); // Call the userService function
        console.log("Fetched users:", response);
        this.users = await response;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.error = error.message || "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch a single user by username
     * @param {string} username - The username to fetch
     */
    async fetchUserByUsername(username) {
      this.loading = true;
      this.error = null;
      try {
        const response = await userService.fetchUserProfile(username);
        this.currentUser = response;
        return response;
      } catch (error) {
        console.error("Error fetching user by username:", error);
        this.error = error.message || "Failed to fetch user.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update a user's details and update the state.
     * @param {string} userId - The ID of the user to update.
     * @param {Object} payload - The user details to update.
     */
    // Update a user
    async updateUser(id, userData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedUser = await userService.updateUserDetails(id, userData);
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser; // Update user locally
        }
        if (this.currentUser?.id === id) {
          this.currentUser = updatedUser; // Update currentUser if it matches
        }
        return updatedUser;
      } catch (err) {
        this.error = err.message;
        console.error("Error updating user:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },



    /**
     * Lock a user and update the state.
     * @param {string} userId - The ID of the user to lock.
     */
    async lockUser(userId) {
      try {
        await userService.lockUser(userId);
        this.users = this.users.map((user) =>
          user.id === userId ? { ...user, locked: true } : user
        );
      } catch (error) {
        console.error("Error locking user:", error);
        throw error;
      }
    },

    /**
     * Delete a user and update the state.
     * @param {string} userId - The ID of the user to delete.
     */
    async deleteUser(userId) {
      try {
        await userService.deleteUser(userId);
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
  },
});
