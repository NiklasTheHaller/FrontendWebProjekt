<template>
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'ModalOverlay',
};
</script>

<style scoped></style>
