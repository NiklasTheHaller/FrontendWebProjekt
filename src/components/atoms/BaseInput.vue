<template>
	<input
		:value="value"
		:placeholder="placeholder"
		@input="updateValue"
		type="text" />
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

<style scoped>
input {
	width: 100%;
	padding: 10px 6px;
	box-sizing: border-box;
	border: none;
	border-radius: 5px;
	border-bottom: 1px solid #ddd;
	color: #555;
	font-size: 16px;
	margin-bottom: 16px;
	transition: border-color 0.3s ease;
	display: block;
}

.form-input:focus {
	border-color: #007bff;
	outline: none;
}
</style>
