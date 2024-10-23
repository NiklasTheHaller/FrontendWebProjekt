<template>
	<div v-if="src" class="mt-4">
		<img
			:src="src"
			alt="Post image"
			class="rounded-lg w-full h-auto object-cover" />
	</div>
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			required: true,
		},
	},
};
</script>
