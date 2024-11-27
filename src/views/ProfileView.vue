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

      <!-- Role Input -->
      <FormInput
        id="role"
        labelText="Role"
        v-model="role"
        type="text"
        placeholder="Enter your role"
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
import { ref } from "vue";
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
    const user = ref({ ...authStore.user }); // Populate with current user data
    const errorMessage = ref("");

    // Update Profile API Call
    const updateProfile = async () => {
      try {
        // Call the backend API
        const updatedUser = await updateUserProfile(user.value);
        // Update the auth store with the new data
        authStore.setUser(updatedUser);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update failed:", error);
        errorMessage.value = error.message || "Failed to update profile.";
      }
    };

    // Reset form to original state
    const resetForm = () => {
      user.value = { ...authStore.user };
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

  

</style>

