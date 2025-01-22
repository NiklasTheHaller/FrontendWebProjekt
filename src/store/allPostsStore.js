/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} role
 * @property {string} salutation
 * @property {string} country
 * @property {string} createdAt
 * @property {string|null} profilePicture
 */

/**
 * @typedef {Object} File
 * @property {string} uuid
 * @property {string} fileName
 * @property {string} contentType
 * @property {string} createdAt
 * @property {string} uploader
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {User} user
 * @property {string} content
 * @property {File|null} file
 * @property {string} createdAt
 */

import {defineStore} from "pinia";
import {postService} from "@/services/postService";

export const useAllPostsStore = defineStore("allPosts", {
    state: () => ({
        posts: [],
        currentPost: null,
        loading: false,
        error: null,
    }),

    getters: {
        getAllPosts: (state) => state.posts,
        isLoading: (state) => state.loading,
    },

    actions: {
        async fetchPosts() {
            this.loading = true;
            this.error = null;
            try {
                this.posts = await postService.getAllPosts();
            } catch (err) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },

        async deletePost(id) {
            this.loading = true;
            this.error = null;
            try {
                await postService.deletePost(id);
                this.posts = this.posts.filter((post) => post.id !== id);
                this.userPosts = this.userPosts.filter((post) => post.id !== id);
                this.currentPost = null;
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
