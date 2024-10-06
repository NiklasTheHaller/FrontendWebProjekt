<template>
	<h2>{{ header }}</h2>
	<form id="registrationForm">
		<label for="salutation">Salutation:</label>
		<select v-model="salutationValue" id="salutation" name="salutation">
			<option value="male">Male</option>
			<option value="female">Female</option>
			<option value="other">Other</option>
		</select>

		<div v-if="otherFieldActive" id="otherField">
			<label for="other">Please specify:</label>
			<input v-model="otherFieldValue" type="text" id="other" name="other" />
		</div>

		<label for="email">Email:</label>
		<input v-model="emailValue" type="email" id="email" name="email" required />

		<label for="password">Password:</label>
		<input
			v-model="passwordValue"
			type="password"
			id="password"
			name="password"
			required />

		<label for="repeatPassword">Repeat Password:</label>
		<input
			v-model="repeatPasswordValue"
			type="password"
			id="repeatPassword"
			name="repeatPassword"
			required />

		<label for="country">Country:</label>
		<select v-model="countryValue" id="country" name="country">
			<option value="us">United States</option>
			<option value="ca">Canada</option>
			<option value="uk">United Kingdom</option>
			<option value="au">Australia</option>
			<option value="other">Other</option>
		</select>

		<button v-on:click="registerUser" type="submit">Register</button>
	</form>
</template>

<script>
import { ref, watch } from 'vue';
export default {
	name: 'RegistrationView',
	setup() {
		const header = ref('Registration');
		const salutationValue = ref('');
		const emailValue = ref('');
		const passwordValue = ref('');
		const repeatPasswordValue = ref('');
		const countryValue = ref('');
		const otherFieldActive = ref(false);

		/*
		const toggleOtherField = () => {
			if (salutationValue.value === 'other') {
				otherFieldActive.value = true;
			} else {
				otherFieldActive.value = false;
			}
		};

        */

		watch(salutationValue, (newValue) => {
			otherFieldActive.value = newValue === 'other';
		});

		const registerUser = (event) => {
			event.preventDefault();
		};

		return {
			header,
			emailValue,
			passwordValue,
			repeatPasswordValue,
			countryValue,
			// toggleOtherField,
			otherFieldActive,
			registerUser,
		};
	},
};
</script>
