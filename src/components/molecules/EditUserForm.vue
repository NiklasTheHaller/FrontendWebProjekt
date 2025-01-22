<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <h2 class="text-2xl font-semibold mb-4">Edit User Details</h2>

    <!-- Profile Picture -->
    <div class="form-group">
      <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
      <div class="mt-2 flex items-center space-x-4">
        <img
            v-if="previewImage || user.profilePictureSrc"
            :src="previewImage || user.profilePictureSrc"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full object-cover"
        />
        <img
            v-else
            :src="defaultProfilePic"
            alt="Default Profile Picture"
            class="w-24 h-24 rounded-full object-cover"
        />
        <input type="file" @change="handleFileChange" accept="image/*" class="block w-full text-sm" />
      </div>
      <p v-if="profilePictureError" class="text-red-500 text-sm">{{ profilePictureError }}</p>
    </div>

    <!-- Salutation -->
    <div class="form-group">
      <label for="salutation" class="block text-sm font-medium text-gray-700">Salutation</label>
      <select v-model="form.salutation" id="salutation" class="block w-full border px-4 py-2">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <!-- Other Salutation -->
    <div v-if="form.salutation === 'other'" class="form-group">
      <label for="otherSalutation" class="block text-sm font-medium text-gray-700">Other Salutation</label>
      <input
          type="text"
          id="otherSalutation"
          v-model="form.otherSalutation"
          placeholder="Specify salutation"
          class="block w-full border px-4 py-2"
      />
    </div>

    <!-- Username -->
    <div class="form-group">
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input
          type="text"
          id="username"
          v-model="form.username"
          class="block w-full border px-4 py-2"
          placeholder="Enter username"
      />
    </div>

    <!-- Email -->
    <div class="form-group">
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
          type="email"
          id="email"
          v-model="form.email"
          class="block w-full border px-4 py-2"
          placeholder="Enter email"
      />
    </div>

    <!-- Country -->
    <div class="form-group">
      <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
      <select v-model="form.country" id="country" class="block w-full border px-4 py-2">
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>

    <!-- Actions -->
    <div class="flex space-x-4">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      <button type="button" @click="$emit('cancel')" class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
    </div>

    <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
  </form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { defineProps, defineEmits } from "vue";

// Props and Emits
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  countries: {
    type: Array,
    required: true,
  },
  defaultProfilePic: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update-user", "cancel"]);

// Reactive state
const form = reactive({
  id: props.user.id, // Include the user ID
  username: props.user.username,
  email: props.user.email,
  salutation: props.user.salutation || "male",
  otherSalutation: props.user.otherSalutation || "",
  country: props.user.country || "",
});
const previewImage = ref(null);
const profilePictureError = ref("");
const formError = ref("");

// Handle file changes
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      profilePictureError.value = "Invalid file. Use JPEG or PNG under 5 MB.";
      return;
    }
    profilePictureError.value = "";
    previewImage.value = URL.createObjectURL(file);
  }
};

// Form submission
const submitForm = () => {
  if (form.password !== form.repeatPassword) {
    formError.value = "Passwords do not match.";
    return;
  }
  formError.value = "";
  emit("update-user", { ...form, profilePicture: previewImage.value }); // Emit updated user data with ID
};
</script>
