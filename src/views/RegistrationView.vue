<template>
  <form id="registrationForm" @submit.prevent="handleSubmit">
    <h2>Register</h2>

    <div class="form-group">
      <FormInput
          id="username"
          label-text="Username:"
          v-model="usernameValue"
          type="text"
          placeholder="Enter your username"
          :class="{'invalid': usernameError}"
      />
      <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
    </div>


    <div class="form-group">
      <FormInput
          id="email"
          label-text="Email:"
          v-model="emailValue"
          type="email"
          placeholder="example@domain.com"
      />
    </div>

    <div class="form-group">
      <FormInput
          id="password"
          label-text="Password:"
          v-model="passwordValue"
          type="password"
      />
    </div>

    <div class="form-group">
      <FormInput
          id="repeatPassword"
          label-text="Repeat Password:"
          v-model="repeatPasswordValue"
          type="password"
      />
    </div>

    <BaseButton
        class="base-button"
        type="submit">
      Register
    </BaseButton>
  </form>
</template>
<script>
import FormInput from "@/components/molecules/FormInput.vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import axios from "axios";
import bcrypt from "bcryptjs";
import * as Yup from "yup";

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
      usernameError: "",
    };
  },

  methods: {
    // Create Yup validation schema
    validateForm() {
      const schema = Yup.object().shape({
        username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/\d/, "Password must contain at least one digit")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character")
            .required("Password is required"),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords must match")
            .required("Repeat password is required"),
      });

      // Validate the form data
      try {
        schema.validateSync({
          username: this.usernameValue,
          email: this.emailValue,
          password: this.passwordValue,
          repeatPassword: this.repeatPasswordValue,
        }, { abortEarly: false });

        // Clear errors if validation passes
        this.usernameError = "";
        this.emailError = "";
        this.passwordError = "";
        this.repeatPasswordError = "";
        return true;
      } catch (error) {
        error.inner.forEach(err => {
          // Map the error to corresponding fields
          if (err.path === 'username') this.usernameError = err.message;
          if (err.path === 'email') this.emailError = err.message;
          if (err.path === 'password') this.passwordError = err.message;
          if (err.path === 'repeatPassword') this.repeatPasswordError = err.message;
        });
        return false;
      }
    },

    async handleSubmit() {

      // Hash the password before sending
      const passwordHash = await bcrypt.hash(this.passwordValue, 10);

      const data = {
        username: this.usernameValue,
        email: this.emailValue,
        passwordHash: passwordHash,
      };
      console.log(data)

      const response = await axios.post("/api/users", data);

      console.log(response);
    },
  },
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