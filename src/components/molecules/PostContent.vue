<template>
	<div>
		<BasePostTitle :title="title" />
		<BasePostBody :body="body" />
	</div>
</template>

<script>
import BasePostTitle from '../atoms/BasePostTitle.vue';
import BasePostBody from '../atoms/BasePostBody.vue';

export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
	},
	components: { BasePostTitle, BasePostBody },
};
</script>
