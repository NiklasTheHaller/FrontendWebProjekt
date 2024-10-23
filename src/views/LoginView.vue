<template>
	<div class="login-view">
		<h1>{{ header }}</h1>

		<form id="loginForm" @submit.prevent="loginUser">
			<!-- Using FormInput for Email -->
			<FormInput
				id="email"
				labelText="Email"
				v-model="emailValue"
				type="email" />

			<!-- Using FormInput for Password -->
			<FormInput
				id="password"
				labelText="Password"
				v-model="passwordValue"
				type="password" />

			<div class="form-check">
				<input
					type="checkbox"
					class="form-check-input"
					id="rememberme"
					v-model="rememberMe" />

				<BaseLabel :htmlFor="'rememberme'" text="Remember me" />
			</div>

			<!-- Using the BaseButton -->
			<BaseButton class="base-button" type="submit"> Sign in </BaseButton>
			<p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
		</form>
	</div>
</template>

<script>
import { ref } from 'vue';
import FormInput from '../components/molecules/FormInput.vue';
import BaseButton from '../components/atoms/BaseButton.vue';
import BaseLabel from '../components/atoms/BaseLabel.vue'; // Ensure usage (new line)

export default {
	name: 'LoginView',
	components: {
		FormInput,
		BaseButton,
		BaseLabel,
	},
	setup() {
		const header = ref('Login');
		const emailValue = ref('');
		const passwordValue = ref('');
		const rememberMe = ref(false);
		const errorMessage = ref('');

		// Dummy data for login
		const dummyData = ref([
			{ email: 'jon@gmail.com', password: 'password', id: 1 },
			{ email: 'jack@gmail.com', password: 'hello123', id: 2 },
		]);

		// Login method using dummy data
		const loginUser = () => {
			const user = dummyData.value.find(
				(user) =>
					user.email === emailValue.value &&
					user.password === passwordValue.value
			);

			if (user) {
				console.log('Login successful');
				errorMessage.value = '';
				// Add logic for successful login (e.g., redirect, set auth token)
			} else {
				console.log('Incorrect Email or Password');
				errorMessage.value = 'Incorrect Email or Password';
			}
		};

		return {
			header,
			emailValue,
			passwordValue,
			loginUser,
			rememberMe,
			errorMessage,
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
