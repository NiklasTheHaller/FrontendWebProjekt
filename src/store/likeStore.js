import { defineStore } from "pinia";
import { likeService } from "@/services/likeService";

export const useLikeStore = defineStore("like", {
  state: () => ({
    likes: {},
    loading: false,
    error: null,
  }),

  getters: {
    getLikesForPost: (state) => (postId) => state.likes[postId] || [],
    isPostLikedByUser: (state) => (postId, userId) => {
      return (
        state.likes[postId]?.some((like) => like.userId === userId) || false
      );
    },
  },

  actions: {
    async fetchLikesForPost(postId) {
      this.loading = true;
      try {
        const likes = await likeService.getLikesByPost(postId);
        this.likes[postId] = likes;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(postId) {
      const userId = "currentUserId"; // Replace with actual user ID from auth
      const isLiked = this.isPostLikedByUser(postId, userId);

      try {
        if (isLiked) {
          const likeToDelete = this.likes[postId].find(
            (like) => like.userId === userId
          );
          await likeService.deleteLike(likeToDelete.id);
          this.likes[postId] = this.likes[postId].filter(
            (like) => like.userId !== userId
          );
        } else {
          const newLike = await likeService.createLike(postId);
          if (!this.likes[postId]) this.likes[postId] = [];
          this.likes[postId].push(newLike);
        }
      } catch (error) {
        this.error = error.message;
      }
    },
  },
});
