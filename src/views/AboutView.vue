<template>
	<div class="about">
		<h1>This is an about page</h1>
		<ErrorModal />
	</div>
</template>

<script>
import ErrorModal from '@/components/organisms/ErrorModal.vue';

export default {
	components: {
		ErrorModal,
	},
	data() {
		return {
			showModal: false, // Track modal visibility
		};
	},
	methods: {
		openModal() {
			// Function to open the modal
			this.showModal = true;
		},
		closeModal() {
			// Function to close the modal
			this.showModal = false;
		},
	},
};
</script>
