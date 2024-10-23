<template>
	<span class="font-semibold text-gray-800">{{ name }}</span>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
};
</script>
