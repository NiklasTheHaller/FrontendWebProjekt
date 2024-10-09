import {defineStore} from 'pinia';

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        isAuthenticated: false,
        userRole: null, // 'user' or 'admin'
        token: null,
    }),
    actions: {

        login(role, token) {
            this.isAuthenticated = true;
            this.userRole = role;
            this.token = token;
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);
        },

        logout() {
            this.isAuthenticated = false;
            this.userRole = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        },

        checkAuth() {
            // You may expand this function to verify the token with backend or use dummy data for now
            const token = localStorage.getItem('token');
            if (token) {
                this.isAuthenticated = true;
                this.token = token;
                // Set user role based on token, for now, assume 'user' or 'admin'
                this.userRole = localStorage.getItem('userRole') || 'admin'; // or 'admin' based on your dummy data
            }
        },
    },
});