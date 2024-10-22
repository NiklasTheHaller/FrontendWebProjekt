<template>
	<div class="container mx-auto p-6">
		<h1 class="text-3xl font-bold mb-6 text-center">Feed</h1>
		<p class="text-gray-600 mb-8 text-center">Welcome to your feed!</p>
		<div v-if="posts.length">
			<ul class="space-y-4">
				<li v-for="post in posts" :key="post.id">
					<UserPost :post="post" />
				</li>
			</ul>
		</div>
		<div v-else>
			<p class="text-center text-gray-500">No posts available.</p>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import UserPost from '../components/organisms/UserPost.vue';

export default {
	components: { UserPost },
	setup() {
		const posts = ref([]);

		const fetchPosts = async () => {
			try {
				const response = await axios.get(
					'https://jsonplaceholder.typicode.com/posts'
				);
				posts.value = response.data.map((post) => ({
					...post,
					username: `User ${post.userId}`, // Placeholder username
					avatarSrc: 'https://via.placeholder.com/40', // Placeholder avatar
					imageSrc:
						post.id % 2 === 0 ? 'https://via.placeholder.com/600x400' : null, // Randomly add images to some posts
					timestamp: '2h ago', // Placeholder timestamp
				}));
			} catch (error) {
				posts.value = [];
			}
		};

		onMounted(fetchPosts);

		return { posts };
	},
};
</script>
