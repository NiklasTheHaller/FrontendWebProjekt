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
    /** @type {Post[]} */
    posts: [],
    /** @type {Post|null} */
    currentPost: null,
    /** @type {boolean} */
    loading: false,
    /** @type {string|null} */
    error: null,
  }),

  getters: {
    getAllPosts: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find((post) => post.id === id),
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      try {
        const data = await postService.getAllPosts();
        console.log("Fetched Posts:", data); // Add this line
        this.posts = data;
      } catch (err) {
        this.error = err.message;
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
  },
});
