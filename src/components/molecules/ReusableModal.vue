<template>
	<!-- Modal visible only when "isOpen" is true -->
	<ModalOverlay v-if="isOpen" @click.self="closeModal">
		<ModalContent>
			<!-- Slot for the modal content -->
			<slot></slot>
			<button
				class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:bg-red-700 transition"
				@click="closeModal">
				Close
			</button>
		</ModalContent>
	</ModalOverlay>
</template>

<script>
import ModalOverlay from '../atoms/ModalOverlay.vue';
import ModalContent from '../atoms/ModalContent.vue';

export default {
	name: 'ReusableModal',
	components: {
		ModalOverlay,
		ModalContent,
	},
	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
	},
	methods: {
		closeModal() {
			this.$emit('close');
		},
	},
};
</script>

<style scoped></style>
