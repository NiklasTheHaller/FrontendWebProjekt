<template>
  <div>
    <h1>Feed</h1>
    <p>Welcome to your feed!</p>
    <div v-if="posts.length">
      <h2>Posts:</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <p><em>By {{ post.author }} on {{ post.created_at }}</em></p>
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

    // Sample posts data
    const samplePosts = [
      {
        id: 1,
        title: 'First Post',
        content: 'This is the content of the first post.',
        author: 'User1',
        created_at: '2024-10-01',
      },
      {
        id: 2,
        title: 'Second Post',
        content: 'This is the content of the second post.',
        author: 'User2',
        created_at: '2024-10-05',
      },
      {
        id: 3,
        title: 'Third Post',
        content: 'This is the content of the third post.',
        author: 'User3',
        created_at: '2024-10-08',
      },
    ];

    // Check authentication state when this component is mounted
    onMounted(() => {
      authStore.checkAuth();
      fetchPosts();
    });

    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts'); // Replace with your API endpoint
        posts.value = response.data; // Assuming your API returns an array of posts
      } catch (error) {
        console.error('Failed to fetch posts, using sample data.', error);
        posts.value = samplePosts; // Fallback to sample data
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
