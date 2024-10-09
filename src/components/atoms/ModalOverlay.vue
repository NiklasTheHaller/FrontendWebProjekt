<template>
	<div class="modal-overlay">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'ModalOverlay',
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
