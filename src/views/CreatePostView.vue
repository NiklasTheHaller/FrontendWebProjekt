<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Create New Post</h1>

    <form
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div>
        <label class="block mb-2">Content</label>
        <textarea
          v-model="content"
          class="w-full p-2 border rounded-lg min-h-[150px]"
          required
        ></textarea>
      </div>

      <div>
        <label class="block mb-2">Upload Media (Optional)</label>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*,video/*"
          class="w-full p-2 border rounded-lg"
        />

        <!-- Media Preview -->
        <div
          v-if="previewUrl"
          class="mt-4 relative"
        >
          <!-- Image Preview -->
          <img
            v-if="isImage"
            :src="previewUrl"
            alt="Preview"
            class="max-h-64 rounded-lg object-contain"
          />

          <!-- Video Preview -->
          <video
            v-else-if="isVideo"
            :src="previewUrl"
            controls
            class="max-h-64 w-full rounded-lg"
          ></video>

          <button
            @click="removeFile"
            type="button"
            class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </div>

      <div
        v-if="error"
        class="text-red-500"
      >
        {{ error }}
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
        :disabled="loading"
      >
        {{ loading ? "Creating..." : "Create Post" }}
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted } from "vue";
  import { useRouter } from "vue-router";
  import { postService } from "@/services/postService";
  import { fileService } from "@/services/fileService";

  const router = useRouter();
  const content = ref("");
  const selectedFile = ref(null);
  const loading = ref(false);
  const error = ref("");
  const previewUrl = ref("");

  const isImage = computed(() => selectedFile.value?.type.startsWith("image/"));

  const isVideo = computed(() => selectedFile.value?.type.startsWith("video/"));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedFile.value = file;
      previewUrl.value = URL.createObjectURL(file);
    }
  };

  const removeFile = () => {
    selectedFile.value = null;
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = "";
    }
  };

  onUnmounted(() => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
  });

  const handleSubmit = async () => {
    loading.value = true;
    error.value = "";

    try {
      let fileId = null;

      if (selectedFile.value) {
        const fileResponse = await fileService.uploadFile(selectedFile.value);
        fileId = fileResponse.uuid;
      }

      await postService.createPost({
        content: content.value,
        fileId: fileId,
      });

      router.push("/");
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
</script>
