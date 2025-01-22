  <template>
    <form @submit.prevent="submitForm" class="space-y-6">
      <h2 class="text-2xl font-semibold mb-4">Edit User Details</h2>

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
          <!-- File Input -->
          <BaseInput
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="block w-full text-sm"
           id=""/>

          <!-- Upload Button -->
          <BaseButton
              type="button"
              :disabled="!selectedFile"
              @click="uploadProfilePicture"
          >
            Upload
          </BaseButton>
        </div>
        <p v-if="profilePictureError" class="text-red-500 text-sm">{{ profilePictureError }}</p>
      </div>

      <!-- Username -->
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <BaseInput
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
        <BaseInput
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
        <SearchableSelect
            v-model="form.country"
            id="country"
            :options="formattedCountries"
            placeholder="Select your country"
        />
        <p v-if="countryError" class="text-red-500 text-sm">{{ countryError }}</p>
      </div>

      <!-- Salutation -->
      <div class="form-group">
        <label for="salutation" class="block text-sm font-medium text-gray-700">Salutation</label>
        <BaseSelect
            v-model="form.salutation"
            id="salutation"
            :options="salutationOptions"
            placeholder="Select salutation"
        />
      </div>

      <!-- Other Salutation -->
      <div v-if="form.salutation === 'other'" class="form-group">
        <BaseInput
            type="text"
            id="otherSalutation"
            v-model="form.otherSalutation"
            class="block w-full border px-4 py-2"
            placeholder="Specify salutation"
        />
        <p v-if="otherSalutationError" class="text-red-500 text-sm">{{ otherSalutationError }}</p>
      </div>

      <!-- Role -->
      <div class="form-group">
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <BaseSelect
            v-model="form.role"
            id="role"
            :options="roleOptions"
            placeholder="Select role"
        />
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
  import {computed, defineEmits, defineProps, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
  import SearchableSelect from "@/components/molecules/SearchableSelect.vue";
  import BaseInput from "@/components/atoms/BaseInput.vue";
  import BaseSelect from "@/components/atoms/BaseSelect.vue";
  import {getCodes, getNames} from "country-list";
  import BaseButton from "@/components/atoms/BaseButton.vue";
  import fileStore from "@/services/fileService";
  import {useProfilePicture} from "@/services/profilePictureService";
  import defaultProfilePic from "@/assets/img/cat-pfp.png";

  const profilePictureData = ref(null);

  // Preview Image
  const previewImage = ref(null);

  // Error for profile picture fetching
  const profilePictureError = ref("");

  // Initialize profile picture using the composable
  const { profilePictureSrc, loading } =
      useProfilePicture(profilePictureData);

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

  // Computed property to decide which image to display
  const profilePictureSrcComputed = computed(() => {
    return previewImage.value
        ? previewImage.value
        : profilePictureSrc.value
            ? profilePictureSrc.value
            : defaultProfilePic;
  });

  // Options for Salutation and Role
  const salutationOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  const roleOptions = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
  ];

  // Props and Emits
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
    defaultProfilePic: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(["update-user", "cancel"]);

  // Reactive State
  const form = reactive({
    id: props.user.id,
    username: props.user.username,
    email: props.user.email,
    role: props.user.role || "USER",
    salutation: props.user.salutation || "male",
    otherSalutation: props.user.otherSalutation || "",
    country: props.user.country || "",
  });
  const formError = ref("");
  const countryError = ref("");
  const otherSalutationError = ref("");
  const countries = ref([]);
  const selectedFile = ref(null);

  // Computed Property for Country List
  const formattedCountries = computed(() => {
    const dachCountries = [
      { name: "Germany", code: "DE" },
      { name: "Austria", code: "AT" },
      { name: "Switzerland", code: "CH" },
    ];
    const otherCountries = countries.value
        .filter((country) => !dachCountries.some((d) => d.name === country.name))
        .sort((a, b) => a.name.localeCompare(b.name));
    return [...dachCountries, ...otherCountries].map((c) => ({ value: c.code, label: c.name }));
  });

  // Fetch Countries
  const fetchCountries = () => {
    const countryList = [];
    const names = getNames();
    const codes = getCodes();
    for (let i = 0; i < names.length; i++) {
      countryList.push({ name: names[i], code: codes[i] });
    }
    countries.value = countryList;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5 MB

      if (!validTypes.includes(file.type)) {
        profilePictureError.value = "Unsupported file type. Please upload a JPEG or PNG image.";
        return;
      }

      if (file.size > maxSize) {
        profilePictureError.value = "File size exceeds 5MB. Please upload a smaller image.";
        return;
      }

      // Clear previous errors
      profilePictureError.value = "";
      selectedFile.value = file;
      previewImage.value = URL.createObjectURL(file);
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile.value) {
      profilePictureError.value = "Please select a file to upload.";
      return;
    }

    try {
      const fileResponse = await fileStore.uploadFile(selectedFile.value); // Replace with actual API call
      if (fileResponse.uuid) {
        profilePictureData.value = fileResponse.uuid; // Use file ID
        alert("Profile picture uploaded successfully!");
        profilePictureError.value = "";
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      profilePictureError.value = "Failed to upload profile picture.";
      console.error("File upload failed:", error);
    }
  };

  // Submit Form
  const submitForm = () => {
    if (!form.country) {
      countryError.value = "Please select a country.";
      return;
    }
    if (form.salutation === "other" && !form.otherSalutation.trim()) {
      otherSalutationError.value = "Please specify a salutation.";
      return;
    }

    otherSalutationError.value = "";
    countryError.value = "";

    emit("update-user", {
      ...form,
      fileId: profilePictureData.value // Use uploaded file ID
    });
  };


  onMounted(fetchCountries);
  </script>
