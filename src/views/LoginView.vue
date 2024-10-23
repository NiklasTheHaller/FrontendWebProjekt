<template>
  <div class="login-view">
    <h1>{{ header }}</h1>

    <form id="loginForm" @submit.prevent="loginUser">
      <!-- Using FormInput for Email -->
      <FormInput
          id="email"
          labelText="Email"
          v-model="emailValue"
          type="email"
          placeholder="Enter your email"
      />

      <!-- Using FormInput for Password -->
      <FormInput
          id="password"
          labelText="Password"
          v-model="passwordValue"
          type="password"
          placeholder="Enter your password"
      />

      <div class="form-check">
        <input
            type="checkbox"
            class="form-check-input"
            id="rememberme"
            v-model="rememberMe"
        />

        <BaseLabel :htmlFor="'rememberme'" text="Remember me" />
      </div>

      <!-- Using the BaseButton -->
      <BaseButton class="base-button" type="submit">Sign in</BaseButton>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import FormInput from '@/components/molecules/FormInput.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore'; // Import auth store
import { useUserStore } from '@/store/userStore'; // Import user store
import { useRouter } from 'vue-router';
import BaseLabel from "@/components/atoms/BaseLabel.vue";

export default {
  name: 'LoginView',
  components: {
    BaseLabel,
    FormInput,
    BaseButton,
  },
  setup() {
    const authStore = useAuthStore(); // Access the auth store
    const userStore = useUserStore(); // Access the user store
    const router = useRouter(); // Access the router

    const emailValue = ref('');
    const passwordValue = ref('');
    const rememberMe = ref(false); // Track the 'Remember me' checkbox state
    const errorMessage = ref('');

    // Login user function
    const loginUser = () => {
      errorMessage.value = ''; // Clear previous error messages

      // Check if emailValue is not empty
      if (!emailValue.value) {
        errorMessage.value = 'Email is required.';
        return;
      }

      // Check if passwordValue is not empty
      if (!passwordValue.value) {
        errorMessage.value = 'Password is required.';
        return;
      }

      // Check in userStore
      const userFromStore = userStore.getUserByEmail(emailValue.value);

      // Validate user
      if (userFromStore && userFromStore.password === passwordValue.value) {
        console.log('Login successful');
        errorMessage.value = '';

        // Call the login action to set userRole and token
        const token = 'dummyToken'; // Replace with actual token if available
        authStore.login(userFromStore.role, token);

        // Optionally handle rememberMe logic here (e.g., store token in local storage)

        // Redirect to feed page after login
        router.push('/feed');
      } else {
        console.log('Incorrect Email or Password');
        errorMessage.value = 'Incorrect Email or Password';
      }
    };

    return {
      emailValue,
      passwordValue,
      rememberMe,
      errorMessage,
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