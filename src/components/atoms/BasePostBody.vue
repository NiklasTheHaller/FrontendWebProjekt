<template>
	<p class="text-left text-gray-700">{{ body }}</p>
</template>

<script>
export default {
	props: {
		body: {
			type: String,
			required: true,
		},
	},
};
</script>
