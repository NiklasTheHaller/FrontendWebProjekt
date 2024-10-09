import { defineStore } from 'pinia';
import axios from 'axios';

export const useBlogStore = defineStore('blogStore', {
    state: () => ({
        posts: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchPosts() {
            this.loading = true;
            try {
                const response = await axios.get('/api/posts'); // Replace with actual API endpoint
                this.posts = response.data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async createPost(post) {
            try {
                await axios.post('/api/posts', post); // Replace with actual API endpoint
                await this.fetchPosts(); // Refresh posts after creating a new one
            } catch (error) {
                this.error = error.message;
            }
        },
        // Add other CRUD operations (update, delete) as needed
    },
    getters: {
        getPosts: (state) => state.posts,
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
    },
});
