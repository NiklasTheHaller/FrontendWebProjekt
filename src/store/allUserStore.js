// src/store/allUserStore.js
import { defineStore } from "pinia";
import {
    fetchAllUsers,
    updateUserDetails,
    lockUser,
    deleteUser,
} from "@/services/userService";
import {ref} from "vue";

export const useAllUserStore = defineStore("allUserStore", {
    state: () => ({
        users: ref([]), // List of all users
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
                this.users = response; // Update the reactive array
                console.log("Updated users in store:", this.users);
            } catch (error) {
                console.error("Error fetching users:", error);
                this.error = error.message || "Failed to fetch users.";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Update a user's details and update the state.
         * @param {string} userId - The ID of the user to update.
         * @param {Object} payload - The user details to update.
         */
        async updateUser(userId, payload) {
            try {
                const updatedUser = await updateUserDetails(userId, payload);
                this.users = this.users.map((user) =>
                    user.id === userId ? { ...user, ...updatedUser } : user
                );
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
