<!-- MediaViewer.vue -->
<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, defineProps } from "vue";
  import { useFileStore } from "@/store/fileStore";

  const props = defineProps({
    fileUuid: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "",
    },
  });

  const fileStore = useFileStore();
  const loading = ref(true);
  const error = ref(null);
  const mediaUrl = ref("");
  const isDownloading = ref(false);

  const isImage = computed(() => props.fileType?.startsWith("image/"));
  const isVideo = computed(() => props.fileType?.startsWith("video/"));

  const handleMediaError = (e) => {
    console.error("Media loading error:", e);
    error.value = "Failed to load media";
    loading.value = false;
  };

  const handleMediaLoad = () => {
    loading.value = false;
  };

  const loadMedia = async () => {
    if (isDownloading.value) return;

    try {
      isDownloading.value = true;
      loading.value = true;

      const blob = await fileStore.downloadFile(props.fileUuid);
      if (!blob) throw new Error("No blob received");

      // Correct Blob handling
      mediaUrl.value = URL.createObjectURL(blob);

      // For non-media files, set loading to false immediately
      if (!isImage.value || !isVideo.value) {
        loading.value = false;
      }
    } catch (err) {
      console.error("Error loading media:", err);
      error.value = err.message;
      loading.value = false;
    } finally {
      isDownloading.value = false;
    }
  };

  onMounted(() => {
    loadMedia();
  });

  onBeforeUnmount(() => {
    if (mediaUrl.value) {
      URL.revokeObjectURL(mediaUrl.value);
    }
  });
</script>

<template>
  <div class="relative w-full min-h-[200px] flex items-center justify-center">
    <div
      v-if="loading"
      class="flex flex-col items-center space-y-2"
    >
      <div
        class="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <span class="text-gray-500">Loading media...</span>
    </div>

    <div
      v-else-if="error"
      class="text-red-500 p-4"
    >
      {{ error }}
    </div>

    <template v-else>
      <img
        v-if="isImage"
        :src="mediaUrl"
        :alt="fileName"
        class="max-w-full max-h-[80vh] object-contain"
        @load="handleMediaLoad"
        @error="handleMediaError"
      />

      <video
        v-else-if="isVideo"
        controls
        class="max-w-full max-h-[80vh] object-contain"
        @loadeddata="handleMediaLoad"
        @error="handleMediaError"
      >
        <source
          :src="mediaUrl"
          :type="fileType"
        />
        Your browser does not support the video tag.
      </video>

      <div
        v-else
        class="text-gray-500"
      >
        Unsupported file format
      </div>
    </template>
  </div>
</template>
