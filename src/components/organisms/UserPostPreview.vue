<template>
  <article
    @click="navigateToPost"
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
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ formatDate(post.createdAt) }}
        </span>
        <div class="flex items-center space-x-2">
          <i class="fas fa-heart text-pink-500"></i>
          <span class="text-sm">{{ likesCount }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
  import { defineProps, computed } from "vue";
  import { useRouter } from "vue-router";
  import MediaViewer from "../atoms/MediaViewer.vue";
  import { useLikeStore } from "@/store/likeStore";

  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  });

  const router = useRouter();
  const likeStore = useLikeStore();

  const likesCount = computed(
    () => likeStore.getLikesForPost(props.post.id).length
  );

  const navigateToPost = () => {
    router.push(`/post/${props.post.id}`);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };
</script>
