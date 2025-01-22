<template>
  <article
      @click="handlePostClick"
      class="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
  >
    <!-- Media Preview -->
    <div
        v-if="post.file"
        class="aspect-square w-full relative"
    >
      <MediaViewer
          :file-uuid="post.file.uuid"
          :file-name="post.file.fileName"
          :file-type="post.file.contentType"
          class="w-full h-full object-cover"
      />
    </div>

    <!-- Text Preview -->
    <div
        v-else
        class="aspect-square w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4"
    >
      <p
          class="text-gray-600 dark:text-gray-300 text-sm line-clamp-4 text-center"
      >
        {{ post.content }}
      </p>
    </div>

    <!-- Post Info -->
    <div class="p-3">
      <div class="flex items-center justify-between">
        <!-- Username -->
        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
          {{ post.username }}
        </span>
        <!-- Created Date -->
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ formatDate(post.createdAt) }}
        </span>
      </div>

    </div>
  </article>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import MediaViewer from "../atoms/MediaViewer.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click-post"]);

const handlePostClick = () => {
  emit("click-post", props.post);
};

const formatDate = (date) => {
  if (!date) return "";
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  const formattedTime = new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} at ${formattedTime}`;
};

</script>
