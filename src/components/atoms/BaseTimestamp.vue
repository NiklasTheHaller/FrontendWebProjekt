<template>
	<span class="text-sm text-gray-500">{{ timestamp }}</span>
</template>

<script>
export default {
	props: {
		timestamp: {
			type: String,
			required: true,
		},
	},
};
</script>
