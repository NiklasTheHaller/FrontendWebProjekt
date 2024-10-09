<template>
	<h2>{{ header }}</h2>
	<form id="registrationForm">
		<BaseLabel for="salutation" text="Salutation:" />
		<select
			v-model="salutationValue"
			id="salutation"
			name="salutation"
			required>
			<option value="male">Male</option>
			<option value="female">Female</option>
			<option value="other">Other</option>
		</select>

		<div v-if="otherFieldActive" id="otherField">
			<label for="other">Please specify:</label>
			<input v-model="otherFieldValue" type="text" id="other" name="other" />
		</div>

		<FormInput
			id="email"
			labelText="Email:"
			v-model="emailValue"
			type="email"
			name="email"
			required
			placeholder="example@domain.com" />

		<FormInput
			id="password"
			labelText="Password:"
			v-model="passwordValue"
			type="password"
			name="password"
			required />

		<FormInput
			id="repeatPassword"
			labelText="Repeat Password:"
			v-model="repeatPasswordValue"
			type="password"
			name="repeatPassword"
			required />

		<label for="country">Country:</label>
		<select v-model="countryValue" id="country" name="country">
			<option value="us">United States</option>
			<option value="ca">Canada</option>
			<option value="uk">United Kingdom</option>
			<option value="au">Australia</option>
			<option value="other">Other</option>
			required
		</select>

		<BaseButton class="base-button" type="primary" v-on:click="registerUser"
			>Register</BaseButton
		>
	</form>
</template>

<script>
import FormInput from '@/components/molecules/FormInput.vue';
import BaseLabel from '@/components/atoms/BaseLabel.vue';
import { ref, watch } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
export default {
	name: 'RegistrationView',
	components: {
		BaseLabel,
		FormInput,
		BaseButton,
	},
	setup() {
		const header = ref('Registration');
		const salutationValue = ref('');
		const emailValue = ref('');
		const passwordValue = ref('');
		const repeatPasswordValue = ref('');
		const countryValue = ref('');
		const otherFieldActive = ref(false);
		const otherFieldValue = ref('');

		watch(salutationValue, (newValue) => {
			otherFieldActive.value = newValue === 'other';
		});

		const registerUser = (event) => {
			event.preventDefault();

			const user = {
				salutation: salutationValue.value,
				email: emailValue.value,
				password: passwordValue.value,
				repeatPassword: repeatPasswordValue.value,
				country: countryValue.value,
				other: otherFieldValue.value,
			};

			console.log(user);
		};

		return {
			header,
			emailValue,
			passwordValue,
			repeatPasswordValue,
			countryValue,
			otherFieldActive,
			otherFieldValue,
			registerUser,
		};
	},
};
</script>

<style scoped>
form {
	max-width: 420px;
	margin: 30px auto;
	background: white;
	text-align: left;
	padding: 40px;
	border-radius: 10px;
}
</style>
