<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">All Posts</h1>

    <!-- Search Bar -->
    <div class="mb-4 text-center">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by username..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading posts...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div v-else>
      <div
          v-if="filteredPosts.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UserPostPreview
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
        />
      </div>
      <div v-else>
        <p class="text-center text-gray-500">No posts available.</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAllPostsStore } from "@/store/allPostsStore";
import UserPostPreview from "@/components/organisms/UserPostPreview.vue";

const postStore = useAllPostsStore();

// Extract allPosts, loading, and error from the store
const { allPosts, loading, error } = storeToRefs(postStore);

// State for the search query
const searchQuery = ref("");

// Fetch all posts when the component mounts
onMounted(async () => {
  await postStore.fetchAllPosts();
});

// Compute sorted posts for display
const sortedAllPosts = computed(() => {
  if (!allPosts.value) return []; // Ensure fallback for undefined state
  return [...allPosts.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});

// Filter posts based on the search query
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedAllPosts.value.filter((post) =>
      post.username.toLowerCase().includes(query)
  );
});
</script>

