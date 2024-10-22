<template>
	<input
		:value="value"
		:placeholder="placeholder"
		@input="updateValue"
		type="text"
		class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300" />
</template>

<script>
export default {
	name: 'BaseInput',
	props: {
		value: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	methods: {
		updateValue(event) {
			this.$emit('input', event.target.value);
		},
	},
};
</script>

<style scoped></style>
