<template>
  <h2>{{ header }}</h2>
  <form id="registrationForm" @submit.prevent="registerUser">
    <BaseLabel htmlFor="salutation" text="Salutation:"/>
    <select
        v-model="salutationValue"
        id="salutation"
        name="salutation"
        required>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>

    <div v-if="salutationValue === 'other'" id="otherField">
      <FormInput
          id="other"
          labelText="Please specify:"
          v-model="otherFieldValue"
          type="text"
          name="other"
          required
          placeholder="Please specify"/>
    </div>

    <!-- Username Field -->
    <FormInput
        id="username"
        labelText="Username:"
        v-model="usernameValue"
        @input="logFieldValue('username', usernameValue)"
        type="text"
        name="username"
        :class="{ invalid: !isUsernameValid && usernameTouched }"
        required
        placeholder="Enter your username"/>

    <p v-if="!isUsernameValid && usernameTouched" class="error-message">
      Please enter a valid username.
    </p>

    <FormInput
        id="email"
        labelText="Email:"
        v-model="emailValue"
        @input="logFieldValue('email', emailValue)"
        type="email"
        name="email"
        :class="{ invalid: !isEmailValid && emailTouched }"
        required
        placeholder="example@domain.com"/>

    <p v-if="!isEmailValid && emailTouched" class="error-message">
      Please enter a valid email.
    </p>

    <FormInput
        id="password"
        labelText="Password:"
        v-model="passwordValue"
        @input="logFieldValue('password', passwordValue)"
        type="password"
        name="password"
        :class="{ invalid: !isPasswordValid && passwordTouched }"
        required/>

    <p v-if="!isPasswordValid && passwordTouched" class="error-message">
      Password must be at least 8 characters long and contain a number or
      special character.
    </p>

    <FormInput
        id="repeatPassword"
        labelText="Repeat Password:"
        v-model="repeatPasswordValue"
        type="password"
        name="repeatPassword"
        :class="{ invalid: !isRepeatPasswordValid && repeatPasswordTouched }"
        required/>

    <p
        v-if="!isRepeatPasswordValid && repeatPasswordTouched"
        class="error-message">
      Passwords do not match.
    </p>

    <label for="country">Country:</label>
    <select v-model="countryValue" id="country" name="country" required>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
      <option value="au">Australia</option>
      <option value="other">Other</option>
    </select>

    <BaseButton
        class="base-button"
        :disabled="!formIsValid"
        type="submit">
      Register
    </BaseButton>
  </form>
</template>

<script>
import FormInput from '@/components/molecules/FormInput.vue';
import BaseLabel from '@/components/atoms/BaseLabel.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { computed, ref } from 'vue';
import { useUserStore } from "@/store/userStore";

export default {
  name: 'RegistrationView',
  components: {
    BaseLabel,
    FormInput,
    BaseButton,
  },
  setup() {
    const userStore = useUserStore();

    const header = ref('Registration');
    const salutationValue = ref('');
    const usernameValue = ref('');
    const emailValue = ref('');
    const passwordValue = ref('');
    const repeatPasswordValue = ref('');
    const countryValue = ref('');
    const otherFieldValue = ref('');

    // Validation state
    const emailTouched = ref(false);
    const usernameTouched = ref(false);
    const passwordTouched = ref(false);
    const repeatPasswordTouched = ref(false);

    // Validation checks
    const isUsernameValid = computed(() => {
      const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
      return usernamePattern.test(usernameValue.value);
    });

    const isEmailValid = computed(() => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(emailValue.value);
    });

    const isPasswordValid = computed(() => {
      const passwordPattern = /^(?=.*[0-9!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      return passwordPattern.test(passwordValue.value);
    });

    const isRepeatPasswordValid = computed(() => {
      return passwordValue.value === repeatPasswordValue.value;
    });

    const formIsValid = computed(() => {
      return (
          isUsernameValid.value &&
          isEmailValid.value &&
          isPasswordValid.value &&
          isRepeatPasswordValid.value
      );
    });

    // Log field values
    const logFieldValue = (field, value) => {
      console.log(`${field}: ${value}`);
    };

    // Register user
    const registerUser = async () => {
      // Mark fields as touched to show validation errors if necessary
      usernameTouched.value = true;
      emailTouched.value = true;
      passwordTouched.value = true;
      repeatPasswordTouched.value = true;

      if (!formIsValid.value) {
        return; // Don't proceed if form is not valid
      }

      // Prepare user data for registration
      const user = {
        email: emailValue.value,
        password: passwordValue.value,
        role: 'user', // Default role for new users
        salutation: salutationValue.value,
        username: usernameValue.value,
        country: countryValue.value,
      };

      console.log('Registration data:', JSON.stringify(user, null, 2));

      // Add user to the user store
      userStore.addUser(user.email, user.password, user.role, user.salutation, user.username, user.country);
      console.log('User added to user store:', JSON.stringify(userStore.users, null, 2));

      // Optionally reset the form fields
      resetForm();
    };

    const resetForm = () => {
      salutationValue.value = '';
      usernameValue.value = '';
      emailValue.value = '';
      passwordValue.value = '';
      repeatPasswordValue.value = '';
      countryValue.value = '';
      otherFieldValue.value = '';
      // Reset validation states
      usernameTouched.value = false;
      emailTouched.value = false;
      passwordTouched.value = false;
      repeatPasswordTouched.value = false;
    };

    return {
      header,
      salutationValue,
      usernameValue,
      emailValue,
      passwordValue,
      repeatPasswordValue,
      countryValue,
      otherFieldValue,
      isUsernameValid,
      isEmailValid,
      isPasswordValid,
      isRepeatPasswordValid,
      formIsValid,
      registerUser,
      logFieldValue,
      usernameTouched,
      emailTouched,
      passwordTouched,
      repeatPasswordTouched,
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

.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
