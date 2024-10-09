<template>
	<div class="form-input">
		<BaseLabel :htmlFor="id" :text="labelText" />
		<!-- Updated prop -->
		<Input
			:id="id"
			:type="type"
			v-model="inputValue"
			:placeholder="placeholder" />
	</div>
</template>

<script>
import BaseLabel from '@/components/atoms/BaseLabel.vue'; // Ensure correct path
import Input from '@/components/atoms/BaseInput.vue';

export default {
	name: 'FormInput',
	components: {
		BaseLabel, // Updated component name
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
			type: [String, Number],
			default: '',
		},
		placeholder: {
			type: String,
			Number,
			default: '',
		},
	},
	data() {
		return {
			inputValue: this.modelValue,
		};
	},
	watch: {
		inputValue(newValue) {
			this.$emit('update:modelValue', newValue);
		},
	},
};
</script>

<style scoped>
.form-input {
	margin-bottom: 24px;
}
</style>
