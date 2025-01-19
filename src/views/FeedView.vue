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

    <div v-else>
      <div v-if="posts.length">
        <ul class="space-y-4">
          <li
            v-for="post in posts"
            :key="post.id"
          >
            <UserPost :post="post" />
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-center text-gray-500">No posts available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { storeToRefs } from "pinia";
  import { usePostStore } from "../store/postStore";
  import UserPost from "../components/organisms/UserPost.vue";

  const postStore = usePostStore();

  onMounted(() => {
    postStore.fetchPosts();
  });

  const { posts, loading, error } = storeToRefs(postStore);
</script>
