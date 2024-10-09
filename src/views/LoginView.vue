<template>
	<div class="login-view">
		<h1>{{ header }}</h1>

		<form id="loginForm">
			<!-- Using FormInput for Email -->
			<FormInput
				id="email"
				labelText="Email"
				v-model="emailValue"
				type="text" />

			<!-- Using FormInput for Password -->
			<FormInput
				id="password"
				labelText="Password"
				v-model="passwordValue"
				type="password" />

			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="rememberme" />
				<BaseLabel :htmlFor="'rememberme'" text="Remember me" />
				<!-- Updated prop -->
			</div>

			<!-- Using the BaseButton -->
			<BaseButton class="base-button" type="primary" @click="loginUser"
				>Sign in</BaseButton
			>
		</form>
	</div>
</template>

<script>
import { ref } from 'vue';
import FormInput from '../components/molecules/FormInput.vue';
import BaseButton from '../components/atoms/BaseButton.vue';
import BaseLabel from '../components/atoms/BaseLabel.vue'; // Ensure usage

export default {
	name: 'LoginView',
	components: {
		FormInput,
		BaseButton,
		BaseLabel, // Now used in the template
	},
	setup() {
		const header = ref('Login');
		const emailValue = ref('');
		const passwordValue = ref('');

		const dummyData = ref([
			{ email: 'jon@gmail.com', password: 'password', id: 1 },
			{ email: 'jack@gmail.com', password: 'hello123', id: 2 },
		]);

		const loginUser = (event) => {
			event.preventDefault();

			const user = dummyData.value.find(
				(user) =>
					user.email === emailValue.value &&
					user.password === passwordValue.value
			);

			if (user) {
				console.log('Login successful');
			} else {
				console.log('Incorrect Email or Password');
			}
		};

		return {
			header,
			emailValue,
			passwordValue,
			loginUser,
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
