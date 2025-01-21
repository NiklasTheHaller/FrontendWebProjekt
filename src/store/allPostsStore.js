import { defineStore } from "pinia";
import { ref } from "vue";
import { postService } from "@/services/postService";

export const useAllPostsStore = defineStore("allPosts", () => {
    const allPosts = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchAllPosts = async () => {
        loading.value = true;
        error.value = null;
        try {
            allPosts.value = await postService.getAllPosts();
        } catch (err) {
            error.value = err.message || "Failed to fetch all posts";
        } finally {
            loading.value = false;
        }
    };

    const deleteAdminPost = async (postId) => {
        try {
            await postService.deletePost(postId);
            allPosts.value = allPosts.value.filter((post) => post.id !== postId);
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    return { allPosts, loading, error, fetchAllPosts, deleteAdminPost };
});
