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
        async lockUser(id) {
            this.loading = true;
            this.error = null;
            let updatedUser = null;
            try {
                // Fetch the user details
                const user = await userService.fetchUserById(id);

                if (!user) {
                    throw new Error(`User with ID ${id} not found`);
                }

                console.log("Locked status:", user.locked);
                if(user.locked === true) {
                    updatedUser = await userService.updateUserDetails(id, {locked: false});
                }
                else {
                    updatedUser = await userService.updateUserDetails(id, {locked: true});
                }

                // Update the user in the local store
                const index = this.users.findIndex((u) => u.id === id);
                if (index !== -1) {
                    this.users[index] = updatedUser;
                }

                // Update currentUser if it's the same user
                if (this.currentUser?.id === id) {
                    this.currentUser = updatedUser;
                }

                return updatedUser;
            } catch (err) {
                this.error = err.message;
                console.error("Error locking user:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // Update a user
        async editUser(updatedUser) {
            this.loading = true;
            this.error = null;
            let updatedUserDetails = null;

            try {
                console.log("Updated User Data in Store:", updatedUser);

                // Send the updated data to the backend
                updatedUserDetails = await userService.updateUserDetails(updatedUser.id, updatedUser);

                console.log("Updated User from Backend:", updatedUserDetails);

                // Update the user in the local store
                const index = this.users.findIndex((u) => u.id === updatedUser.id);
                if (index !== -1) {
                    this.users[index] = updatedUserDetails;
                }

                // Update currentUser if it's the same user
                if (this.currentUser?.id === updatedUser.id) {
                    this.currentUser = updatedUserDetails;
                }

                return updatedUserDetails;
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
