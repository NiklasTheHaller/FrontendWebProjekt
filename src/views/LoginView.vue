<!-- src/views/LoginView.vue -->
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-neutral-200 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full space-y-8 bg-neutral-100 p-8 rounded-lg shadow-lg"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-neutral-700">{{ header }}</h2>
      </div>
      <form
        @submit.prevent="handleLogin"
        class="mt-8 space-y-6"
      >
        <div class="space-y-4">
          <FormInput
            id="username"
            v-model="usernameValue"
            type="text"
            labelText="Username"
            placeholder="Enter your username"
          />
          <FormInput
            id="password"
            v-model="passwordValue"
            type="password"
            labelText="Password"
            placeholder="Enter your password"
          />
        </div>
        <BaseButton
          type="primary"
          @click="loginUser"
        >
          Sign in
        </BaseButton>
        <p
          v-if="errorMessage"
          class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
        >
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import FormInput from "@/components/molecules/FormInput.vue";
  import BaseButton from "@/components/atoms/BaseButton.vue";
  import { ref } from "vue";
  import { useAuthStore } from "@/store/authStore";
  import { useRouter } from "vue-router";

  export default {
    name: "LoginView",
    components: {
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
