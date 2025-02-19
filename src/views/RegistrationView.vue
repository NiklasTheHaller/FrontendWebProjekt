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
        @submit.prevent="handleSubmit"
        class="mt-8 space-y-6"
      >
        <!-- Salutation -->
        <div class="space-y-4">
          <div class="form-group">
            <BaseLabel
              htmlFor="salutation"
              text="Salutation"
            />
            <BaseSelect
              v-model="salutation"
              id="salutation"
              :options="salutationOptions"
              placeholder="Select salutation"
              @blur="validateSalutation"
            />
          </div>

          <!-- Other Salutation -->
          <div
            v-if="salutation === 'other'"
            class="form-group"
          >
            <FormInput
              id="otherSalutation"
              label-text="Please specify"
              v-model="otherSalutation"
              type="text"
              placeholder="Max 30 characters"
              @blur="validateOtherSalutation"
            />
            <p
              v-if="otherSalutationError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ otherSalutationError }}
            </p>
          </div>

          <!-- Username -->
          <div class="form-group">
            <FormInput
              id="username"
              label-text="Username"
              v-model="usernameValue"
              type="text"
              placeholder="Enter your username"
              @blur="validateUsername"
            />
            <p
              v-if="usernameError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ usernameError }}
            </p>
          </div>

          <!-- Email -->
          <div class="form-group">
            <FormInput
              id="email"
              label-text="Email"
              v-model="emailValue"
              type="email"
              placeholder="example@domain.com"
              @blur="validateEmail"
            />
            <p
              v-if="emailError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ emailError }}
            </p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <FormInput
              id="password"
              label-text="Password"
              v-model="passwordValue"
              type="password"
              @blur="validatePassword"
            />
            <p
              v-if="passwordError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ passwordError }}
            </p>
          </div>

          <!-- Repeat Password -->
          <div class="form-group">
            <FormInput
              id="repeatPassword"
              label-text="Confirm Password"
              v-model="repeatPasswordValue"
              type="password"
              @blur="validateRepeatPassword"
            />
            <p
              v-if="repeatPasswordError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ repeatPasswordError }}
            </p>
          </div>

          <!-- Country -->
          <div class="form-group">
            <BaseLabel
              htmlFor="country"
              text="Country"
            />
            <SearchableSelect
              v-model="country"
              id="country"
              :options="formattedCountries"
              placeholder="Select your country"
              :error="countryError"
              @blur="validateCountry"
            />
            <p
              v-if="countryError"
              class="mt-2 text-sm text-error text-center bg-error/10 p-2 rounded"
            >
              {{ countryError }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <BaseButton
          type="primary"
          :disabled="!isFormValid"
        >
          Register
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script>
  import FormInput from "@/components/molecules/FormInput.vue";
  import BaseButton from "@/components/atoms/BaseButton.vue";
  import BaseSelect from "@/components/atoms/BaseSelect.vue";
  import SearchableSelect from "@/components/molecules/SearchableSelect.vue";
  import axios from "axios";
  import * as Yup from "yup";
  import { getNames, getCodes } from "country-list";
  import router from "@/router";
  import BaseLabel from "@/components/atoms/BaseLabel.vue";

  export default {
    name: "RegistrationView",
    components: {
      FormInput,
      BaseButton,
      BaseSelect,
      SearchableSelect,
      BaseLabel,
    },
    data() {
      return {
        header: "Registration",
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
        salutationOptions: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      };
    },

    computed: {
      formattedCountries() {
        const dachCountries = [
          { name: "Germany", code: "DE" },
          { name: "Austria", code: "AT" },
          { name: "Switzerland", code: "CH" },
        ];
        const otherCountries = this.countries
          .filter(
            (country) =>
              !dachCountries.map((c) => c.name).includes(country.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name));

        return [...dachCountries, ...otherCountries].map((country) => ({
          value: country.code,
          label: country.name,
        }));
      },
      isFormValid() {
        return !(
          this.usernameError ||
          this.emailError ||
          this.passwordError ||
          this.repeatPasswordError ||
          this.otherSalutationError ||
          this.countryError
        );
      },
    },

    methods: {
      fetchCountries() {
        const countries = [];
        const names = getNames();
        const codes = getCodes();

        for (let i = 0; i < names.length; i++) {
          countries.push({
            name: names[i],
            code: codes[i],
          });
        }
        this.countries = countries;
      },

      async validateUsername() {
        try {
          await Yup.string()
            .min(3, "Username must be at least 3 characters")
            .required("Username is required")
            .validate(this.usernameValue);
          this.usernameError = "";
        } catch (error) {
          this.usernameError = error.message;
        }
      },

      async validateEmail() {
        try {
          await Yup.string()
            .email("Invalid email address")
            .required("Email is required")
            .validate(this.emailValue);
          this.emailError = "";
        } catch (error) {
          this.emailError = error.message;
        }
      },

      async validatePassword() {
        try {
          await Yup.string()
            .min(12, "Password must be at least 12 characters")
            .matches(
              /[A-Z]/,
              "Password must contain at least one uppercase letter"
            )
            .matches(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .matches(/\d/, "Password must contain at least one digit")
            .matches(
              /[@$!%*?&]/,
              "Password must contain at least one special character"
            )
            .required("Password is required")
            .validate(this.passwordValue);
          this.passwordError = "";
        } catch (error) {
          this.passwordError = error.message;
        }
      },

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

      async validateOtherSalutation() {
        if (this.salutation === "other") {
          if (this.otherSalutation.length === 0) {
            this.otherSalutationError = "Please specify your salutation.";
          } else if (this.otherSalutation.length > 30) {
            this.otherSalutationError =
              "Salutation cannot be more than 30 characters.";
          } else {
            this.otherSalutationError = "";
          }
        } else {
          this.otherSalutationError = "";
        }
      },

      async validateCountry() {
        if (!this.country || this.country.trim() === "") {
          this.countryError = "Please select a country.";
        } else {
          this.countryError = "";
        }
      },

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
          username: this.usernameValue.trim(),
          email: this.emailValue.trim(),
          password: this.passwordValue,
          role: "USER",
          salutation:
            this.salutation === "other"
              ? this.otherSalutation.trim()
              : this.salutation.trim(),
          country: this.country,
        };

        try {
          const response = await axios.post(
            "http://localhost:8080/api/users",
            data
          );
          console.log("Registration successful:", response);
          await router.push("/login");
        } catch (error) {
          console.error("Registration failed:", error);

          if (error.response) {
            const message = error.response.data.message;

            if (message?.includes("Username")) {
              this.usernameError = message;
            } else if (message?.includes("Email")) {
              this.emailError = message;
            } else {
              // Handle other validation errors
              this.usernameError =
                "Registration failed. Please check your inputs.";
            }
          } else {
            this.usernameError = "Server error. Please try again later.";
          }
        }
      },
    },

    watch: {
      usernameValue() {
        this.validateUsername();
      },
      emailValue() {
        this.validateEmail();
      },
      passwordValue() {
        this.validatePassword();
      },
      repeatPasswordValue() {
        this.validateRepeatPassword();
      },
      otherSalutation() {
        this.validateOtherSalutation();
      },
      country() {
        this.validateCountry();
      },
      salutation() {
        this.validateOtherSalutation();
      },
    },

    mounted() {
      this.fetchCountries();
    },
  };
</script>

<style scoped></style>
