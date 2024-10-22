<template>
	<button class="text-blue-500 hover:underline">{{ label }}</button>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			required: true,
		},
	},
};
</script>
