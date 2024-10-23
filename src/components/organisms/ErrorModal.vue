<template>
	<div>
		<!-- Button to open the modal -->
		<BaseButton type="button" @click="openModal">Open Modal</BaseButton>

		<!-- Reusable Modal Component -->
		<ReusableModal :isOpen="showModal" @close="closeModal">
			<!-- Content inside the modal -->
			<h2 class="text-2xl font-bold text-gray-800">Error Occurred</h2>
			<p class="text-gray-600 mt-2">
				An unexpected error has occurred. Please try again later.
			</p>
		</ReusableModal>
	</div>
</template>

<script>
import ReusableModal from '../molecules/ReusableModal.vue';
import BaseButton from '../atoms/BaseButton.vue';

export default {
	components: {
		ReusableModal,
		BaseButton,
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

<style></style>
