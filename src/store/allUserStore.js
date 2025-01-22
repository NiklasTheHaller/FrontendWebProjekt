import { defineStore } from "pinia";
import { userService } from "@/services/userService"; // Ensure this service is implemented

export const useAllUserStore = defineStore("allUserStore", {
    state: () => ({
        users: [], // All users
        currentUser: null, // Selected user
        loading: false, // Loading state
        error: null, // Error message
    }),

    getters: {
        getAllUsers: (state) => state.users,
        isLoading: (state) => state.loading,
    },

    actions: {
        // Fetch all users
        async fetchAllUsers() {
            this.loading = true;
            this.error = null;
            try {
                const data = await userService.fetchAllUsers();
                this.users = data; // Populate users array
            } catch (err) {
                this.error = err.message;
                console.error("Error fetching users:", err);
            } finally {
                this.loading = false;
            }
        },

        // Delete a user
        async deleteUser(id) {
            this.loading = true;
            this.error = null;
            try {
                await userService.deleteUser(id);
                this.users = this.users.filter((user) => user.id !== id); // Remove user locally
                if (this.currentUser?.id === id) {
                    this.currentUser = null; // Clear currentUser if it matches the deleted user
                }
            } catch (err) {
                this.error = err.message;
                console.error("Error deleting user:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

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

        // Clear cache (optional, based on use case)
        clearCache() {
            this.users = [];
            this.currentUser = null;
        },
    },
});
