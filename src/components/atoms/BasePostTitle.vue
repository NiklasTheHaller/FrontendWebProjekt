<template>
	<h3 class="text-xl text-left font-semibold text-gray-800">{{ title }}</h3>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
	},
};
</script>
