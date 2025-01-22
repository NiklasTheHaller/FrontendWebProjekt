import { defineStore } from "pinia";
import { likeService } from "@/services/likeService";
import { useAuthStore} from "@/store/authStore";

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
      const authStore = useAuthStore();
      const userId = authStore.identifier;

      console.log("Post ID in toggleLike:", postId); // Log postId
      console.log("User ID in toggleLike:", userId); // Log userId

      if (!userId) {
        console.error("User not authenticated, cannot toggle like.");
        return;
      }

      const isLiked = this.isPostLikedByUser(postId, userId);

      try {
        if (isLiked) {
          // Unlike the post
          const likeToDelete = this.likes[postId]?.find(
            (like) => like.userId === userId
          );

          if (!likeToDelete) {
            console.error("Like not found for deletion.");
            return;
          }

          console.log("Deleting like:", likeToDelete);
          await likeService.deleteLike(likeToDelete.id);
          this.likes[postId] = this.likes[postId].filter(
            (like) => like.userId !== userId
          );
        } else {
          // Like the post
          console.log("Creating like for userId:", userId, "and postId:", postId);
          const newLike = await likeService.createLike(userId, postId);

          if (!this.likes[postId]) {
            this.likes[postId] = [];
          }

          this.likes[postId].push(newLike);
        }
      } catch (error) {
        console.error("Error toggling like:", error.message || error);
        this.error = error.message;
      }
    },
  },
});
