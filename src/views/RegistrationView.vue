<template>
  <form id="registrationForm" @submit.prevent="handleSubmit">
    <h2>Register</h2>

    <!-- Salutation Dropdown -->
    <div class="form-group">
      <label for="salutation">Salutation:</label>
      <select v-model="salutation" id="salutation">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <!-- Other Salutation Textfield -->
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
    <div class="form-group">
      <FormInput
          id="username"
          label-text="Username:"
          v-model="usernameValue"
          type="text"
          placeholder="Enter your username"
          :class="{'invalid': usernameError}"
          @focusout="validateUsername"
      />
      <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
    </div>

    <!-- Email Input -->
    <div class="form-group">
      <FormInput
          id="email"
          label-text="Email:"
          v-model="emailValue"
          type="email"
          placeholder="example@domain.com"
          :class="{'invalid': emailError}"
          @focusout="validateEmail"
      />
      <div v-if="emailError" class="error-message">{{ emailError }}</div>
    </div>

    <!-- Password Input -->
    <div class="form-group">
      <FormInput
          id="password"
          label-text="Password:"
          v-model="passwordValue"
          type="password"
          :class="{'invalid': passwordError}"
          @focusout="validatePassword"
      />
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
    </div>

    <!-- Repeat Password Input -->
    <div class="form-group">
      <FormInput
          id="repeatPassword"
          label-text="Repeat Password:"
          v-model="repeatPasswordValue"
          type="password"
          :class="{'invalid': repeatPasswordError}"
          @focusout="validateRepeatPassword"
      />
      <div v-if="repeatPasswordError" class="error-message">{{ repeatPasswordError }}</div>
    </div>

    <!-- Country Select Dropdown -->
    <div class="form-group">
      <label for="country">Country:</label>
      <select v-model="country" id="country">
        <option value="" disabled>Select your country</option>
        <option v-for="country in sortedCountries" :key="country" :value="country">{{ country }}</option>
      </select>
      <div v-if="countryError" class="error-message">{{ countryError }}</div>
    </div>

    <!-- Submit Button -->
    <BaseButton
        class="base-button"
        type="submit"
        :disabled="!isFormValid">
      Register
    </BaseButton>
  </form>
</template>

<script>
import FormInput from "@/components/molecules/FormInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import axios from "axios";
import * as Yup from "yup";
import { getNames } from 'country-list'; // Import country-list package

export default {
  name: "RegistrationView",
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
      salutation: "male",
      country: "",
      countries: [],
      otherSalutation: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
      repeatPasswordError: "",
      otherSalutationError: "",
      countryError: "",
    };
  },

  computed: {
    // Alphabetically sorted countries with DACH countries at the top
    sortedCountries() {
      const dachCountries = ["Germany", "Austria", "Switzerland"];
      // Filter out DACH countries from the main list and sort the rest alphabetically
      const otherCountries = this.countries.filter(country => !dachCountries.includes(country.name));
      return [...dachCountries, ...otherCountries.map(country => country.name).sort()]; // DACH countries first, others sorted alphabetically
    },
    isFormValid() {
      return !(this.usernameError || this.emailError || this.passwordError || this.repeatPasswordError || this.otherSalutationError || this.countryError);
    }
  },

  methods: {
    // Fetch countries from country-list
    fetchCountries() {
      const countryNames = getNames(); // Get all country names
      this.countries = countryNames.map(name => ({name})); // Map to an array of objects with 'name' as the property
    },

    // Validate the username
    async validateUsername() {
      try {
        await Yup.string().min(3, "Username must be at least 3 characters").required("Username is required")
            .validate(this.usernameValue);
        this.usernameError = "";
      } catch (error) {
        this.usernameError = error.message;
      }
    },

    // Validate the email
    async validateEmail() {
      try {
        await Yup.string().email("Invalid email address").required("Email is required")
            .validate(this.emailValue);
        this.emailError = "";
      } catch (error) {
        this.emailError = error.message;
      }
    },

    // Validate the password
    async validatePassword() {
      try {
        await Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/\d/, "Password must contain at least one digit")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character")
            .required("Password is required")
            .validate(this.passwordValue);
        this.passwordError = "";
      } catch (error) {
        this.passwordError = error.message;
      }
    },

    // Validate repeat password
    async validateRepeatPassword() {
      try {
        if (this.repeatPasswordValue !== this.passwordValue) {
          this.repeatPasswordError = "Passwords must match";
        } else {
          this.repeatPasswordError = "";
        }
      } catch (error) {
        this.repeatPasswordError = error.message;
      }
    },

    // Validate the "other" salutation field
    async validateOtherSalutation() {
      if (this.otherSalutation.length > 30) {
        this.otherSalutationError = "Salutation cannot be more than 30 characters.";
      } else {
        this.otherSalutationError = "";
      }
    },

    // Validate country selection
    async validateCountry() {
      if (!this.country) {
        this.countryError = "Please select a country.";
      } else {
        this.countryError = "";
      }
    },

    // Handle form submission
    async handleSubmit() {
      // Validate each field before submission
      await this.validateUsername();
      await this.validateEmail();
      await this.validatePassword();
      await this.validateRepeatPassword();
      await this.validateOtherSalutation();
      await this.validateCountry();

      if (!this.isFormValid) {
        return;
      }

      const data = {
        username: this.usernameValue,
        email: this.emailValue,
        password: this.passwordValue,
        role: "USER",
        salutation: this.salutation,
        otherSalutation: this.salutation === 'other' ? this.otherSalutation : null,
        country: this.country,
      };

      try {
        const response = await axios.post("/api/users", data);
        console.log("Registration successful:", response);
      } catch (error) {
        console.error("Registration failed:", error);

        // Handle error for duplicate username or email
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("Username")) {
            this.usernameError = errorMessage;
          }
          if (errorMessage.includes("Email")) {
            this.emailError = errorMessage;
          }
        } else {
          this.usernameError = "An error occurred, please try again later.";
          this.emailError = "An error occurred, please try again later.";
        }
      }
    },
  },

  mounted() {
    this.fetchCountries(); // Fetch country list on component mount
  }
}
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
