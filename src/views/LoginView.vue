<!-- src/views/LoginView.vue -->
<template>
  <div class="login-view">
    <h1>{{ header }}</h1>
    <!-- Now 'header' is defined -->

    <form id="loginForm" @submit.prevent="loginUser">
      <!-- Using FormInput for Username -->
      <FormInput
        id="username"
        labelText="Username"
        v-model="usernameValue"
        type="text"
        placeholder="Enter your username"
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
import FormInput from "@/components/molecules/FormInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";
import BaseLabel from "@/components/atoms/BaseLabel.vue";

export default {
  name: "LoginView",
  components: {
    BaseLabel,
    FormInput,
    BaseButton,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const header = ref("Login"); // Define 'header'
    const usernameValue = ref(""); // Changed from 'usernameOrEmailValue'
    const passwordValue = ref("");
    const rememberMe = ref(false);
    const errorMessage = ref("");

    const loginUser = async () => {
      errorMessage.value = "";

      if (!usernameValue.value || !passwordValue.value) {
        errorMessage.value = "Username and password are required.";
        return;
      }

      const success = await authStore.login(
        usernameValue.value, // Pass 'username'
        passwordValue.value
      );
      if (success) {
        router.push("/feed");
      } else {
        errorMessage.value = "Invalid username or password";
      }
    };

    return {
      header, // Return 'header'
      usernameValue,
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
