<template>
  <article
    v-if="post && post.username"
    class="bg-white rounded-lg shadow-md p-6 max-w-2xl"
  >
    <!-- Header -->
    <header class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
        <img
          v-if="post.profilePicture"
          :src="post.profilePicture"
          class="w-full h-full object-cover"
          alt="Profile picture"
        />
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-lg">{{ post.username }}</h3>
        <time
          class="text-gray-500 text-sm"
          :datetime="post.createdAt"
        >
          {{ formatDate(post.createdAt) }}
        </time>
      </div>
    </header>

    <!-- Content -->
    <div class="space-y-4">
      <p class="text-gray-800 leading-relaxed">{{ post.content }}</p>

      <!-- Media -->
      <div
        v-if="post.file"
        class="relative w-full rounded-lg overflow-hidden bg-gray-50"
      >
        <div class="aspect-w-16 aspect-h-9">
          <MediaViewer
            :file-uuid="post.file.uuid"
            :file-name="post.file.fileName"
            :file-type="post.file.contentType"
            class="w-full h-full object-contain"
          />
        </div>
      </div>

      <!-- Interaction Buttons -->
      <div class="flex items-center space-x-4 pt-4 border-t">
        <BaseButton
          variant="ghost"
          class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
        >
          <i class="fas fa-heart"></i>
          <span>Like</span>
        </BaseButton>

        <BaseButton
          variant="ghost"
          class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
        >
          <i class="fas fa-comment"></i>
          <span>Comment</span>
        </BaseButton>
      </div>
    </div>
  </article>

  <!-- Loading State -->
  <div
    v-else
    class="bg-gray-50 rounded-lg p-6 animate-pulse"
  >
    <div class="flex space-x-4">
      <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/6"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, toRefs } from "vue";
  import MediaViewer from "../atoms/MediaViewer.vue";

  const props = defineProps({
    post: {
      type: Object,
      required: true,
      validator: (post) => {
        return (
          post &&
          typeof post.id === "string" &&
          typeof post.username === "string" &&
          typeof post.content === "string"
        );
      },
    },
  });

  const { post } = toRefs(props);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
</script>

<style scoped>
  .aspect-w-16 {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  }

  .aspect-w-16 > * {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
