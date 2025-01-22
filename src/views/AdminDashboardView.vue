<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">All Posts</h1>

    <!-- Search Bar -->
    <div class="mb-4 text-center">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <p>Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Posts List -->
    <div v-else>
      <div
          v-if="filteredPosts.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UserPostPreview
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            @click-post="openPostModal"
        />
      </div>
      <div v-else class="text-center text-gray-500">
        <p>No posts available.</p>
      </div>

      <!-- Post Modal -->
      <PostModal
          v-if="selectedPost"
          v-model="showPostModal"
          :post="selectedPost"
          @post-deleted="handlePostDeleted"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAllPostsStore } from "@/store/allPostsStore";
import UserPostPreview from "@/components/organisms/UserPostPreview.vue";
import PostModal from "@/components/organisms/PostModal.vue";

// Post store
const postStore = useAllPostsStore();
const { posts, loading, error } = storeToRefs(postStore);

// Modal state
const showPostModal = ref(false);
const selectedPost = ref(null);

// Search query
const searchQuery = ref("");

// Open modal with the selected post
const openPostModal = (post) => {
  selectedPost.value = post;
  showPostModal.value = true;
};

// Handle post deletion
const handlePostDeleted = async (postId) => {
  try {
    console.log("Deleting post with ID:", postId);
    //await postStore.deletePost(postId);
    selectedPost.value = null;
    showPostModal.value = false;
    await postStore.fetchPosts()
  } catch (err) {
    console.error("Failed to delete post:", err);
  }
};

// Fetch posts on mount
onMounted(async () => {
  await postStore.fetchPosts()
});

// Sorted posts
const sortedUserPosts = computed(() => {
  return [...posts.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});

// Filter posts based on the search query
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedUserPosts.value.filter(
      (post) =>
          post.username.toLowerCase().includes(query) || // Filter by username
          post.content.toLowerCase().includes(query)    // Filter by post content
  );
});
</script>
