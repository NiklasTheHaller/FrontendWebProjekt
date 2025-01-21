// src/store/allUserStore.js
import { defineStore } from "pinia";
import {
  fetchAllUsers,
  updateUserProfile,
  lockUser,
  deleteUser,
  fetchUserProfile,
} from "@/services/userService";

export const useAllUserStore = defineStore("allUserStore", {
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
        const response = await fetchAllUsers(); // Call the userService function
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
        const response = await fetchUserProfile(username);
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
    async updateUser(identifier, data) {
      try {
        const updatedUser = await updateUserProfile(data);
        this.currentUser = updatedUser;
        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    /**
     * Lock a user and update the state.
     * @param {string} userId - The ID of the user to lock.
     */
    async lockUser(userId) {
      try {
        await lockUser(userId);
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
        await deleteUser(userId);
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
  },
});
