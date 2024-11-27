<template>
  <div class="profile-view">
    <h1>Edit Profile</h1>

    <form id="profileForm" @submit.prevent="updateProfile">
      <!-- Salutation Dropdown -->
      <div class="form-group">
        <label for="salutation">Salutation:</label>
        <select v-model="salutation" id="salutation">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Other Salutation Textfield (shown only if 'Other' is selected) -->
      <div v-if="salutation === 'other'" class="form-group">
        <label for="otherSalutation">Please specify:</label>
        <input
            type="text"
            id="otherSalutation"
            v-model="otherSalutation"
            placeholder="Max 30 characters"
            maxlength="30"
            @focusout="validateOtherSalutation"
        />
        <div v-if="otherSalutationError" class="error-message">{{ otherSalutationError }}</div>
      </div>

      <!-- Username Input -->
      <FormInput
          id="username"
          labelText="Username"
          v-model="usernameValue"
          type="text"
          placeholder="Enter your username"
      />

      <!-- Email Input -->
      <FormInput
          id="email"
          labelText="Email"
          v-model="emailValue"
          type="email"
          placeholder="Enter your email"
      />

      <!-- Password Input -->
      <FormInput
          id="password"
          labelText="Password"
          v-model="passwordValue"
          type="password"
          placeholder="Enter your password"
      />

      <!-- Repeat Password Input -->
      <FormInput
          id="repeatPassword"
          labelText="Repeat Password"
          v-model="repeatPasswordValue"
          type="password"
          placeholder="Repeat your password"
      />

      <!-- Country Select Dropdown -->
      <div class="form-group">
        <label for="country">Country:</label>
        <select v-model="country" id="country">
          <option value="" disabled>Select your country</option>
          <option v-for="country in sortedCountries" :key="country" :value="country">{{ country }}</option>
        </select>
        <div v-if="countryError" class="error-message">{{ countryError }}</div>
      </div>

      <!-- Submit and Cancel Buttons -->
      <div class="button-group">
        <BaseButton class="base-button" type="submit">Update</BaseButton>
        <BaseButton class="base-button cancel-button" type="button" @click="resetForm">Cancel</BaseButton>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/authStore";
import { updateUserProfile } from "@/services/userService"; // Backend API call
import { fetchUserProfile } from "@/services/userService"; // Function to fetch user data if not available
import FormInput from "@/components/molecules/FormInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import { getNames } from 'country-list';

export default {
  name: "ProfileView",
  components: {
    FormInput,
    BaseButton,
  },
  data() {
    return {
      usernameValue: "",
      emailValue: "",
      passwordValue: "",
      repeatPasswordValue: "",
      salutation: "male", // Default to male
      otherSalutation: "", // For "other" salutation
      country: "Austria", // Default country
      countries: [],
      errorMessage: "",
      loading: false,  // Track loading state
      otherSalutationError: "",
      countryError: "",
    };
  },

  computed: {
    // Alphabetically sorted countries with DACH countries at the top
    sortedCountries() {
      const dachCountries = ["Germany", "Austria", "Switzerland"];
      const otherCountries = this.countries.filter(country => !dachCountries.includes(country.name));
      return [...dachCountries, ...otherCountries.map(country => country.name).sort()];
    },
  },

  async mounted() {
    this.fetchCountries(); // Fetch country list on mount

    const authStore = useAuthStore();
    if (authStore.user) {
      // Populate fields if user data exists in store
      this.usernameValue = authStore.user.username || "";
      this.emailValue = authStore.user.email || "";
      this.salutation = authStore.user.salutation || "male"; // Default to male if no salutation
      this.country = authStore.user.country || "Austria"; // Default to Austria
    } else {
      // Fetch user data from API if not available in store
      this.loading = true;
      try {
        const userProfile = await fetchUserProfile();
        this.usernameValue = userProfile.username || "";
        this.emailValue = userProfile.email || "";
        this.salutation = userProfile.salutation || "male"; // Default to male if no salutation
        this.country = userProfile.country || "Austria"; // Default to Austria
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.errorMessage = "Failed to load user profile.";
        console.error("Error loading user profile:", error);
      }
    }
  },

  methods: {
    // Fetch countries from country-list package
    fetchCountries() {
      const countryNames = getNames();
      this.countries = countryNames.map(name => ({ name }));
    },

    // Validate "other" salutation field
    validateOtherSalutation() {
      if (this.otherSalutation.length > 30) {
        this.otherSalutationError = "Salutation cannot be more than 30 characters.";
      } else {
        this.otherSalutationError = "";
      }
    },

    // Update profile with form data
    async updateProfile() {
      if (this.passwordValue !== this.repeatPasswordValue) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      const data = {
        username: this.usernameValue,
        email: this.emailValue,
        password: this.passwordValue,
        role: "USER", // Assuming role isn't changed
        salutation: this.salutation === 'other' ? this.otherSalutation : this.salutation,
        country: this.country || "",
      };

      try {
        console.log("Updating user profile with data:", data);
        await updateUserProfile(data);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update failed:", error);
        this.errorMessage = error.response?.data?.message || "Failed to update profile.";
      }
    },

    // Reset form to initial state
    resetForm() {
      const authStore = useAuthStore();
      this.usernameValue = authStore.user?.username || "";
      this.emailValue = authStore.user?.email || "";
      this.passwordValue = "";
      this.repeatPasswordValue = "";
      this.errorMessage = "";
    },
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

.error-message {
  color: red;
  font-size: 12px;
}
</style>
