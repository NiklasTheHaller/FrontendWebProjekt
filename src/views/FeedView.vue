<template>
  <div>
    <h1>Feed</h1>
    <p>Welcome to your feed!</p>
    <div v-if="posts.length">
      <h2>Posts:</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post">
          <h3>{{ post.title }}</h3>
          <p>{{ post.body }}</p>
          <p><em>By User ID: {{ post.userId }}</em></p> <!-- Displaying userId directly -->
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No posts available.</p>
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

<style scoped>
.post {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
