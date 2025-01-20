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

import { defineStore } from "pinia";
import { postService } from "@/services/postService";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    userPosts: [],
    currentPost: null,
    loading: false,
    error: null,
    lastFetch: null,
    cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
  }),

  getters: {
    getAllPosts: (state) => state.posts,
    getUserPosts: (state) => state.userPosts,
    isLoading: (state) => state.loading,
    shouldRefetch: (state) => {
      if (!state.lastFetch) return true;
      return Date.now() - state.lastFetch > state.cacheDuration;
    },
  },

  actions: {
    async fetchPosts(forceRefresh = false) {
      if (!forceRefresh && !this.shouldRefetch && this.posts.length > 0) {
        return this.posts;
      }

      this.loading = true;
      this.error = null;
      try {
        const data = await postService.getAllPosts();
        this.posts = data;
        this.lastFetch = Date.now();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserPosts(username) {
      this.loading = true;
      this.error = null;
      try {
        const data = await postService.getPostsByUsername(username);
        this.userPosts = data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchPostById(id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await postService.getPostById(id);
        this.currentPost = data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createPost(postData) {
      this.loading = true;
      this.error = null;
      try {
        const newPost = await postService.createPost(postData);
        this.posts.unshift(newPost);
        return newPost;
      } catch (err) {
        this.error = err.message;
        throw err;
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
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updatePost(id, postData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedPost = await postService.updatePost(id, postData);
        const index = this.posts.findIndex((post) => post.id === id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
        return updatedPost;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCache() {
      this.lastFetch = null;
      this.posts = [];
    },
  },
});
