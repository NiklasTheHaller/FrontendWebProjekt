<template>
  <div class="profile-view">
    <h1>Edit Profile</h1>

    <form id="profileForm" @submit.prevent="updateProfile">
      <!-- Username Input -->
      <FormInput
        id="username"
        labelText="Username"
        v-model="username"
        type="text"
        placeholder="Enter your username"
      />

      <!-- Email Input -->
      <FormInput
        id="email"
        labelText="Email"
        v-model="email"
        type="email"
        placeholder="Enter your email"
      />

      <!-- Password Input -->
      <FormInput
        id="password"
        labelText="Password"
        v-model="password"
        type="password"
        placeholder="Enter your password"
      />

      
     

      <!-- Submit and Cancel Buttons -->
      <div class="button-group">
        <BaseButton class="base-button" type="submit">Update</BaseButton>
        <BaseButton class="base-button cancel-button" type="button" @click="cancelUpdate">Cancel</BaseButton>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { updateUserProfile } from "@/services/userService"; // Backend API call
import FormInput from "@/components/molecules/FormInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";

export default {
  name: "ProfileView",
  components: {
    FormInput,
    BaseButton,
  },
  setup() {
    const authStore = useAuthStore(); // Access authenticated user data
    const user = ref({
      username: authStore.user?.username || "",
      email: authStore.user?.email || "",
      password: "",
    }); // Populate with current user data, add fallback values
    const errorMessage = ref("");

    // Ensure user data is populated correctly when the component is mounted
    onMounted(() => {
      console.log("Loaded user data:", user.value); // Log user data for debugging
    });

    // Update Profile API Call
    const updateProfile = async () => {
      try {
        console.log("Updating user profile with data:", user.value); // Log the data being sent
        const updatedUser = await updateUserProfile(user.value.id, {
          username: user.value.username.trim(),
          email: user.value.email.trim(),
          password: user.value.password,
          role: "USER", // Hardcoded role
        });
        authStore.setUser(updatedUser); // Update the auth store with the new data
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update failed:", error);
        errorMessage.value = error.response?.data?.message || "Failed to update profile.";
      }
    };

    // Reset form to original state
    const resetForm = () => {
      user.value = {
        username: authStore.user?.username || "",
        email: authStore.user?.email || "",
        password: "",
      };
      errorMessage.value = "";
    };

    return {
      user,
      errorMessage,
      updateProfile,
      resetForm,
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

button {
  margin-top: 20px;
}
</style>

