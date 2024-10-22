<template>
	<div class="bg-white shadow-md rounded-lg p-6 border border-gray-200">
		<UserInfo :avatarSrc="post.avatarSrc" :username="post.username" />
		<PostContent :title="post.title" :body="post.body" />
		<!-- Conditionally render the image if it exists -->
		<BaseImage v-if="post.imageSrc" :src="post.imageSrc" />
		<PostFooter :timestamp="post.timestamp" />
	</div>
</template>

<script>
import UserInfo from '../molecules/UserInfo.vue';
import PostContent from '../molecules/PostContent.vue';
import PostFooter from '../molecules/PostFooter.vue';
import BaseImage from '../atoms/BaseImage.vue';

export default {
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	components: { UserInfo, PostContent, BaseImage, PostFooter },
};
</script>
