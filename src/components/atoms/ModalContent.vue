<template>
	<div class="modal">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'ModalContent',
};
</script>

<style scoped>
.modal {
	background: white;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	text-align: center;
}

button {
	margin-top: 10px;
}
</style>
