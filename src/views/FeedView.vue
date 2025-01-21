<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Feed</h1>

    <div
      v-if="loading"
      class="text-center"
    >
      <p>Loading posts...</p>
    </div>

    <div
      v-else-if="error"
      class="text-red-500 text-center"
    >
      {{ error }}
    </div>

    <div
      v-else
      class="flex justify-center"
    >
      <div class="w-full max-w-2xl">
        <div v-if="sortedPosts.length">
          <ul class="space-y-4">
            <li
              v-for="post in sortedPosts"
              :key="post.id"
            >
              <UserPost
                :post="post"
                @post-deleted="handlePostDeleted"
              />
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="text-center text-gray-500">No posts available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, computed } from "vue";
  import { storeToRefs } from "pinia";
  import { usePostStore } from "@/store/postStore";
  import UserPost from "../components/organisms/UserPost.vue";

  const postStore = usePostStore();

  onMounted(async () => {
    await postStore.fetchPosts();
  });

  const handlePostDeleted = (postId) => {
    // Stay on feed, post will be removed from store automatically
    console.log("Post deleted:", postId);
  };

  const { posts, loading, error } = storeToRefs(postStore);

  const sortedPosts = computed(() => {
    return [...posts.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });
</script>
