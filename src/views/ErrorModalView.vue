<template>
	<ModalOverlay>
		<ModalContent>
			<!-- Modal content goes here -->
			<p>Error message</p>
			<button @click="closeModal">Close</button>
		</ModalContent>
	</ModalOverlay>
</template>

<script>
import ModalOverlay from './ModalOverlay.vue';
import ModalContent from './ModalContent.vue';

export default {
	components: {
		ModalOverlay,
		ModalContent,
	},
	methods: {
		closeModal() {
			// add close modal logic here
		},
	},
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
