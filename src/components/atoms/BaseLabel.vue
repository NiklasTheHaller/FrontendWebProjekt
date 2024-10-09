<template>
	<label :for="htmlFor">{{ text }}</label>
</template>

<script>
export default {
	name: 'BaseLabel',
	props: {
		htmlFor: {
			// Renamed prop
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
label {
	color: #aaa;
	display: inline-block;
	margin: 25px 0 15px;
	font-size: 0.6em;
	text-transform: uppercase;
	letter-spacing: 1px;
	font-weight: bold;
}
</style>
