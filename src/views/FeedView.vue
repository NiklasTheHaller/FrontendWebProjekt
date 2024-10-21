<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Feed</h1>
    <p class="text-gray-600 mb-8 text-center">Welcome to your feed!</p>
    <div v-if="posts.length">
      <h2 class="text-2xl font-semibold mb-4">Posts:</h2>
      <ul class="space-y-4">
        <li v-for="post in posts" :key="post.id" class="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ post.title }}</h3>
          <p class="text-gray-700 mb-4">{{ post.body }}</p>
          <p class="text-sm text-gray-500"><em>By User ID: {{ post.userId }}</em></p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="text-center text-gray-500">No posts available.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export default defineComponent({
  name: 'FeedView',
  setup() {
    const authStore = useAuthStore();
    const posts = ref([]); // Reactive reference for posts

    // Check authentication state when this component is mounted
    onMounted(() => {
      authStore.checkAuth();
      fetchPosts();
    });

    const fetchPosts = async () => {
      try {
        // Use JSONPlaceholder API for posts
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        posts.value = response.data; // Assuming the API returns an array of posts
      } catch (error) {
        console.error('Failed to fetch posts, using sample data.', error);
        posts.value = []; // Optional: can keep sample posts as fallback if desired
      }
    };

    return { posts };
  },
});
</script>
