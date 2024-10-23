<template>
	<h2>{{ header }}</h2>
	<form id="registrationForm">
		<BaseLabel htmlFor="salutation" text="Salutation:" />
		<select
			v-model="salutationValue"
			id="salutation"
			name="salutation"
			required>
			<option value="male">Male</option>
			<option value="female">Female</option>
			<option value="other">Other</option>
		</select>

		<div v-if="salutationValue === 'other'" id="otherField">
			<FormInput
				id="other"
				labelText="Please specify:"
				v-model="otherFieldValue"
				type="text"
				name="other"
				required
				placeholder="Please specify" />
		</div>

		<!-- Username Field -->
		<FormInput
			id="username"
			labelText="Username:"
			v-model="usernameValue"
			type="text"
			name="username"
			:class="{ invalid: !isUsernameValid && usernameTouched }"
			required
			placeholder="Enter your username" />

		<p v-if="!isUsernameValid && usernameTouched" class="error-message">
			Please enter a valid username.
		</p>

		<FormInput
			id="email"
			labelText="Email:"
			v-model="emailValue"
			type="email"
			name="email"
			:class="{ invalid: !isEmailValid && emailTouched }"
			required
			placeholder="example@domain.com" />

		<p v-if="!isEmailValid && emailTouched" class="error-message">
			Please enter a valid email.
		</p>

		<FormInput
			id="password"
			labelText="Password:"
			v-model="passwordValue"
			type="password"
			name="password"
			:class="{ invalid: !isPasswordValid && passwordTouched }"
			required />

		<p v-if="!isPasswordValid && passwordTouched" class="error-message">
			Password must be at least 8 characters long and contain a number or
			special character.
		</p>

		<FormInput
			id="repeatPassword"
			labelText="Repeat Password:"
			v-model="repeatPasswordValue"
			type="password"
			name="repeatPassword"
			:class="{ invalid: !isRepeatPasswordValid && repeatPasswordTouched }"
			required />

		<p
			v-if="!isRepeatPasswordValid && repeatPasswordTouched"
			class="error-message">
			Passwords do not match.
		</p>

		<label for="country">Country:</label>
		<select v-model="countryValue" id="country" name="country" required>
			<option value="us">United States</option>
			<option value="ca">Canada</option>
			<option value="uk">United Kingdom</option>
			<option value="au">Australia</option>
			<option value="other">Other</option>
		</select>

		<BaseButton
			class="base-button"
			:disabled="!formIsValid"
			type="primary"
			v-on:click="registerUser">
			Register
		</BaseButton>
	</form>
</template>

<script>
import FormInput from '@/components/molecules/FormInput.vue';
import BaseLabel from '@/components/atoms/BaseLabel.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { ref, computed } from 'vue';
import axios from 'axios';

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
		const usernameValue = ref(''); // New username value
		const emailValue = ref('');
		const passwordValue = ref('');
		const repeatPasswordValue = ref('');
		const countryValue = ref('');
		const otherFieldActive = ref(false);
		const otherFieldValue = ref('');

		// Validation state
		const emailTouched = ref(false);
		const usernameTouched = ref(false); // New username touched
		const passwordTouched = ref(false);
		const repeatPasswordTouched = ref(false);

		// Username validation (non-empty and alphanumeric)
		const isUsernameValid = computed(() => {
			const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/; // Min 3, max 20 chars, alphanumeric
			return usernamePattern.test(usernameValue.value);
		});

		// Email validation
		const isEmailValid = computed(() => {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailPattern.test(emailValue.value);
		});

		// Password validation
		const isPasswordValid = computed(() => {
			const passwordPattern = /^(?=.*[0-9!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
			return passwordPattern.test(passwordValue.value);
		});

		// Repeat password validation
		const isRepeatPasswordValid = computed(() => {
			return passwordValue.value === repeatPasswordValue.value;
		});

		// Form validation
		const formIsValid = computed(() => {
			return (
				isUsernameValid.value && // Username validation
				isEmailValid.value &&
				isPasswordValid.value &&
				isRepeatPasswordValid.value
			);
		});

		// Register user
		const registerUser = async (event) => {
			event.preventDefault();

			// Mark fields as touched to show validation errors if necessary
			usernameTouched.value = true;
			emailTouched.value = true;
			passwordTouched.value = true;
			repeatPasswordTouched.value = true;

			if (!formIsValid.value) {
				return; // Don't proceed if form is not valid
			}

			const user = {
				salutation: salutationValue.value,
				username: usernameValue.value, // Include username
				email: emailValue.value,
				password: passwordValue.value,
				repeatPassword: repeatPasswordValue.value,
				country: countryValue.value,
				other: otherFieldValue.value,
			};

			console.log('Registration data:', JSON.stringify(user, null, 2));

			try {
				// Simulating an API call with axios
				const response = await axios.post(
					'https://example.com/api/register',
					user
				);
				console.log('Simulated server response:', response.data);
			} catch (error) {
				console.error('Simulated registration error:', error);
			}
		};

		return {
			header,
			salutationValue,
			usernameValue, // Return username value
			emailValue,
			passwordValue,
			repeatPasswordValue,
			countryValue,
			otherFieldActive,
			otherFieldValue,
			registerUser,
			isUsernameValid, // Return username validation
			isEmailValid,
			isPasswordValid,
			isRepeatPasswordValid,
			formIsValid,
			usernameTouched, // Return username touched state
			emailTouched,
			passwordTouched,
			repeatPasswordTouched,
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
.invalid {
	border-color: red;
}
.error-message {
	color: red;
	font-size: 12px;
}
</style>
