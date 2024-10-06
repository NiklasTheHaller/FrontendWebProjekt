<template>
	<h1>{{ header }}</h1>
	<div>
		<label for="email">Email: </label>
		<input v-model="emailValue" type="text" name="email" id="password" />
	</div>

	<div>
		<label for="password">Password: </label>
		<input v-model="passwordValue" type="text" name="password" id="password" />
	</div>

	<div>
		<input type="checkbox" class="form-check-input" id="rememberme" />
		<label class="form-check-label" for="exampleCheck1">Remember me</label>
	</div>

	<button v-on:click="loginUser" id="submit" type="submit">Sign in</button>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'LoginView',
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
			console.log('Button Clicked');

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
	components: {},
};
</script>
