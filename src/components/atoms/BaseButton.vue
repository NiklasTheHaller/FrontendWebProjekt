<template>
	<button class="button" :class="type" @click="onClick">
		<slot />
	</button>
</template>

<script>
export default {
	name: 'BaseButton',
	props: {
		type: {
			type: String,
			default: 'primary', // primary, secondary, etc.
		},
		onClick: {
			type: Function,
			default: () => {},
		},
	},
};
</script>

<style scoped>
.base-button {
	padding: 10px 20px;
	background-color: #007bff;
	border: none;
	border-radius: 5px;
	color: #fff;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.base-button:hover {
	background-color: #0056b3;
}

.base-button:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
</style>
