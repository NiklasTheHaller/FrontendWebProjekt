<template>
  <div class="profile-view max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

    <!-- Main Profile Form -->
    <form
      id="profileForm"
      @submit.prevent="updateProfile"
      class="form-container space-y-6"
    >
      <h2 class="text-2xl font-semibold mb-4">Profile Details</h2>

      <!-- Profile Picture -->
      <div class="form-group">
        <label
          for="profilePicture"
          class="block text-sm font-medium text-gray-700"
          >Profile Picture</label
        >
        <div class="profile-picture-container mt-2 flex items-center space-x-4">
          <div
            v-if="loading"
            class="spinner"
          ></div>
          <img
            v-else-if="profilePictureSrcComputed"
            :src="profilePictureSrcComputed"
            :alt="altText"
            class="profile-picture w-24 h-24 rounded-full object-cover"
          />
          <img
            v-else
            :src="defaultProfilePic"
            alt="Default Profile Picture"
            class="profile-picture w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            id="profilePicture"
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />

          <BaseButton
            class="base-button"
            type="button"
            @click="uploadProfilePicture"
          >
            Upload
          </BaseButton>
        </div>
        <p
          v-if="profilePictureError"
          class="error-message text-red-500 text-sm mt-2"
        >
          {{ profilePictureError }}
        </p>
      </div>

      <!-- Salutation -->
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
        />
      </div>

      <!-- Other Salutation (Conditional) -->
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
        />
        <p
          v-if="otherSalutationError"
          class="error-message text-red-500 text-sm mt-2"
        >
          {{ otherSalutationError }}
        </p>
      </div>

      <!-- Username -->
      <FormInput
        id="username"
        labelText="Username"
        v-model="usernameValue"
        type="text"
        placeholder="Enter your username"
      />

      <!-- Email -->
      <FormInput
        id="email"
        labelText="Email"
        v-model="emailValue"
        type="email"
        placeholder="Enter your email"
      />

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
        />
        <div
          v-if="countryError"
          class="error-message text-red-500 text-sm mt-2"
        >
          {{ countryError }}
        </div>
      </div>

      <!-- Buttons -->
      <div class="button-group flex space-x-4">
        <BaseButton
          class="base-button"
          type="submit"
          >Update Profile</BaseButton
        >
        <BaseButton
          class="base-button cancel-button"
          type="button"
          @click="resetForm"
        >
          Cancel
        </BaseButton>
      </div>

      <!-- Profile Error Message -->
      <p
        v-if="profileError"
        class="error-message text-red-500 text-sm mt-2"
      >
        {{ profileError }}
      </p>
    </form>

    <!-- Separate Password Change Form -->
    <form
      id="passwordForm"
      @submit.prevent="handlePasswordUpdate"
      class="form-container mt-8 space-y-6"
    >
      <h2 class="text-2xl font-semibold mb-4">Change Password</h2>
      <FormInput
        id="password"
        labelText="New Password"
        v-model="passwordValue"
        type="password"
        placeholder="Enter new password"
      />
      <FormInput
        id="repeatPassword"
        labelText="Repeat Password"
        v-model="repeatPasswordValue"
        type="password"
        placeholder="Repeat new password"
      />
      <div class="button-group flex space-x-4">
        <BaseButton
          class="base-button"
          type="submit"
          >Update Password</BaseButton
        >
      </div>
      <p
        v-if="passwordError"
        class="error-message text-red-500 text-sm mt-2"
      >
        {{ passwordError }}
      </p>
    </form>
  </div>
</template>

<script>
  import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
  import { useAuthStore } from "@/store/authStore";
  import { useUserStore} from "@/store/userStore";
  import FormInput from "@/components/molecules/FormInput.vue";
  import BaseButton from "@/components/atoms/BaseButton.vue";
  import SearchableSelect from "@/components/molecules/SearchableSelect.vue";
  import BaseLabel from "@/components/atoms/BaseLabel.vue";
  import BaseSelect from "@/components/atoms/BaseSelect.vue";
  import { getNames, getCodes } from "country-list";
  import { useProfilePicture } from "@/services/profilePictureService";
  import defaultProfilePic from "@/assets/img/cat-pfp.png"; // Ensure this path is correct
  import { useFileStore } from "@/store/fileStore";

  export default {
    name: "ProfileView",
    components: {
      FormInput,
      BaseButton,
      SearchableSelect,
      BaseLabel,
      BaseSelect,
    },
    setup() {
      const authStore = useAuthStore();
      const userStore = useUserStore();
      const fileStore = useFileStore();

      // Reactive form fields
      const usernameValue = ref("");
      const emailValue = ref("");
      const passwordValue = ref("");
      const repeatPasswordValue = ref("");
      const role = useAuthStore().userRole;
      const salutation = ref("");
      const otherSalutation = ref("");
      const otherSalutationError = ref("");
      const salutationOptions = ref([
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ]);
      const country = ref("");
      const countries = ref([]);
      const profileError = ref("");
      const passwordError = ref("");
      const countryError = ref("");
      const selectedFile = ref(null);
      const profilePictureData = ref(null);

      // Preview Image
      const previewImage = ref(null);

      // Error for profile picture fetching
      const profilePictureError = ref("");

      // Initialize profile picture using the composable
      const { profilePictureSrc, loading } =
        useProfilePicture(profilePictureData);

      // Computed property to decide which image to display
      const profilePictureSrcComputed = computed(() => {
        return previewImage.value
          ? previewImage.value
          : profilePictureSrc.value
          ? profilePictureSrc.value
          : defaultProfilePic;
      });

      // Dynamic alt text based on whether user has a custom profile picture
      const userHasCustomProfilePicture = computed(() => {
        return !!profilePictureData.value?.uuid;
      });

      const altText = computed(() =>
        userHasCustomProfilePicture.value
          ? "Your Profile Picture"
          : "Default Profile Picture"
      );

      // Watch previewImage to revoke the old object URL when a new one is set
      watch(previewImage, (newVal, oldVal) => {
        if (oldVal) {
          URL.revokeObjectURL(oldVal);
        }
      });

      // Clean up the object URLs when the component is unmounted
      onBeforeUnmount(() => {
        if (previewImage.value) {
          URL.revokeObjectURL(previewImage.value);
        }
        if (
          profilePictureSrc.value &&
          profilePictureSrc.value !== defaultProfilePic
        ) {
          URL.revokeObjectURL(profilePictureSrc.value);
        }
      });

      // Fetch countries from country-list package
      const fetchCountries = () => {
        const countryList = [];
        const names = getNames();
        const codes = getCodes();

        for (let i = 0; i < names.length; i++) {
          countryList.push({
            name: names[i],
            code: codes[i],
          });
        }
        countries.value = countryList;
      };

      // Fetch user data on component mount
      const fetchUserData = async () => {
        try {
          const username = authStore.identifier;
          await userStore.fetchUserByUsername(username);

          const userData = userStore.currentUser;
          if (userData) {
            usernameValue.value = userData.username || "";
            emailValue.value = userData.email || "";
            salutation.value = userData.salutation || "";
            country.value = userData.country || ""; // Use country code instead of name
            profilePictureData.value = userData.profilePicture?.uuid || null;

            if (salutation.value !== "male" && salutation.value !== "female") {
              salutation.value = "other";
              otherSalutation.value = userData.salutation;
            }
          }
        } catch (error) {
          profileError.value = "Failed to load user profile.";
          console.error("Error loading user profile:", error);
        }
      };

      onMounted(() => {
        fetchUserData();
        fetchCountries();
      });

      // Computed property for formatted countries
      const formattedCountries = computed(() => {
        const dachCountries = [
          { name: "Germany", code: "DE" },
          { name: "Austria", code: "AT" },
          { name: "Switzerland", code: "CH" },
        ];
        const otherCountries = countries.value
          .filter(
            (country) =>
              !dachCountries.map((c) => c.name).includes(country.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name));

        return [...dachCountries, ...otherCountries].map((country) => ({
          value: country.code,
          label: country.name,
        }));
      });

      // Handle file change for profile picture with validation
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const validTypes = ["image/jpeg", "image/png"];
          const maxSize = 5 * 1024 * 1024; // 5MB

          if (!validTypes.includes(file.type)) {
            profilePictureError.value =
              "Unsupported file type. Please upload a JPEG or PNG image.";
            return;
          }

          if (file.size > maxSize) {
            profilePictureError.value =
              "File size exceeds 5MB. Please upload a smaller image.";
            return;
          }

          // Clear previous errors
          profilePictureError.value = "";

          selectedFile.value = file;
          // Create a temporary URL for preview
          const objectURL = URL.createObjectURL(file);
          previewImage.value = objectURL;
        }
      };

      // Handle file upload for profile picture
      const uploadProfilePicture = async () => {
        if (!selectedFile.value) {
          profilePictureError.value = "Please select a file to upload.";
          return;
        }

        try {
          const fileResponse = await fileStore.uploadFile(selectedFile.value);
          profilePictureData.value = fileResponse.uuid;
          alert("Profile picture uploaded successfully!");
          profilePictureError.value = "";
        } catch (error) {
          profilePictureError.value = "Failed to upload profile picture.";
          console.error("File upload failed:", error);
        }
      };

      // Validate "other" salutation field
      const validateOtherSalutation = () => {
        if (otherSalutation.value.length > 30) {
          otherSalutationError.value =
            "Salutation cannot be more than 30 characters.";
        } else if (otherSalutation.value.trim() === "") {
          otherSalutationError.value = "Please specify your salutation.";
        } else {
          otherSalutationError.value = "";
        }
      };

      // Update profile without password
      const updateProfile = async () => {
        if (salutation.value === "other") {
          validateOtherSalutation();
          if (otherSalutationError.value) return;
        }

        // Validate username length
        if (usernameValue.value.length < 5 || usernameValue.value.length > 50) {
          profileError.value = "Username must be between 5 and 50 characters.";
          return;
        }

        // Validate email format (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue.value)) {
          profileError.value = "Please enter a valid email address.";
          return;
        }

        const data = {
          username: usernameValue.value,
          email: emailValue.value,
          role: role,
          salutation:
            salutation.value === "other"
              ? otherSalutation.value
              : salutation.value,
          country: country.value,
          fileId:
            profilePictureData.value || userStore.currentUser.profilePicture, // Changed from profilePicture to fileId
        };

        try {
          await userStore.updateUser(authStore.identifier, data);
          alert("Profile updated successfully!");

          console.log("Profile updated:", data);

          // Re-fetch user data to get the latest profile picture from the db
          await fetchUserData();

          // Optionally, reset the previewImage after successful upload
          selectedFile.value = null;
          profileError.value = "";
        } catch (error) {
          profileError.value = "Failed to update profile.";
          console.error("Profile update failed:", error);
        }
      };

      // **Updated Password Update Handler**
      const handlePasswordUpdate = async () => {
        // Validate password fields
        if (!passwordValue.value || !repeatPasswordValue.value) {
          passwordError.value = "Please fill in both password fields.";
          return;
        }

        if (passwordValue.value !== repeatPasswordValue.value) {
          passwordError.value = "Passwords do not match!";
          return;
        }

        // Password strength validation (example: minimum 8 characters)
        if (passwordValue.value.length < 12) {
          passwordError.value = "Password must be at least 12 characters long.";
          return;
        }

        // Prepare data by including existing user details plus the new password
        const data = {
          username: usernameValue.value,
          email: emailValue.value,
          role: role,
          salutation:
            salutation.value === "other"
              ? otherSalutation.value
              : salutation.value,
          country: country.value,
          fileId:
            profilePictureData.value || userStore.currentUser.profilePicture,
          password: passwordValue.value, // Include the new password
        };

        try {
          await userStore.updateUser(authStore.identifier, data);
          alert("Password updated successfully!");
          // Reset password fields
          passwordValue.value = "";
          repeatPasswordValue.value = "";
          passwordError.value = "";
        } catch (error) {
          passwordError.value = "Failed to update password.";
          console.error("Password update failed:", error);
        }
      };

      // Reset form to initial state
      const resetForm = () => {
        const userData = userStore.currentUser;

        usernameValue.value = userData?.username || "";
        emailValue.value = userData?.email || "";
        passwordValue.value = "";
        repeatPasswordValue.value = "";
        salutation.value = userData?.salutation || "male";
        country.value = userData?.country || "AT"; // Use country code
        profilePictureData.value = userData?.profilePicture || null;
        profileError.value = "";
        otherSalutation.value =
          salutation.value === "other" ? userData?.salutation || "" : "";
        otherSalutationError.value = "";

        // Reset previewImage if any
        if (previewImage.value) {
          URL.revokeObjectURL(previewImage.value);
          previewImage.value = null;
        }
        selectedFile.value = null;
        profilePictureError.value = "";
      };

      return {
        usernameValue,
        emailValue,
        passwordValue,
        repeatPasswordValue,
        salutation,
        otherSalutation,
        otherSalutationError,
        salutationOptions,
        country,
        countries,
        formattedCountries,
        profileError,
        passwordError,
        countryError,
        selectedFile,
        profilePictureSrcComputed,
        loading,
        profilePictureError,
        defaultProfilePic,
        handleFileChange,
        validateOtherSalutation,
        updateProfile,
        handlePasswordUpdate, // Updated handler
        resetForm,
        altText,
        uploadProfilePicture,
      };
    },
  };
</script>

<style scoped></style>
