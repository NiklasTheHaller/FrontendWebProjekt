<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">{{ username }}'s Posts</h1>

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

    <div v-else>
      <div
        v-if="sortedUserPosts.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UserPostPreview
          v-for="post in sortedUserPosts"
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
  import { onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import { storeToRefs } from "pinia";
  import { usePostStore } from "@/store/postStore";
  import UserPostPreview from "@/components/organisms/UserPostPreview.vue";

  const route = useRoute();
  const username = computed(() => route.params.username);
  const postStore = usePostStore();

  const { userPosts, loading, error } = storeToRefs(postStore);

  onMounted(async () => {
    await postStore.fetchUserPosts(username.value);
  });

  const sortedUserPosts = computed(() => {
    return [...userPosts.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });
</script>
