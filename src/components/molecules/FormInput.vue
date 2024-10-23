<template>
	<div class="mb-6">
		<BaseLabel :htmlFor="id" :text="labelText" />
		<Input
			:id="id"
			:type="type"
			:value="modelValue"
			@update:modelValue="updateValue"
			:placeholder="placeholder"
			class="mt-1" />
	</div>
</template>

<script>
import BaseLabel from '@/components/atoms/BaseLabel.vue'; // Ensure correct path
import Input from '@/components/atoms/BaseInput.vue';

export default {
	name: 'FormInput',
	components: {
		BaseLabel,
		Input,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		labelText: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'text',
		},
		modelValue: {
			// This is for v-model binding
			type: [String, Number],
			default: '',
		},
		placeholder: {
			type: [String, Number],
			default: '',
		},
	},
	methods: {
		updateValue(value) {
			this.$emit('update:modelValue', value); // Emit value changes to parent
		},
	},
};
</script>

<style scoped>
.form-input {
	margin-bottom: 1.5rem;
}
</style>
