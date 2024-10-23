<template>
	<img :src="src" alt="User avatar" class="w-10 h-10 rounded-full" />
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			default: 'https://via.placeholder.com/40',
		},
	},
};
</script>
