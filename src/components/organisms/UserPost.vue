<template>
  <article
    v-if="post && post.username"
    class="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/85 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out hover:scale-[1.01] p-6 max-w-2xl"
  >
    <!-- Header -->
    <header class="flex items-center space-x-4 mb-4">
      <div
        class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-100/50 dark:ring-gray-700/50"
      >
        <img
          :src="profilePictureSrc"
          class="w-full h-full object-cover transition-opacity duration-200"
          alt="Profile picture"
          :class="{ 'opacity-50': loading }"
        />
      </div>
      <div class="flex-1">
        <div class="flex items-center">
          <h3
            class="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {{ post.username }}
          </h3>
          <span class="text-gray-500 dark:text-gray-400 text-sm mx-2">·</span>
          <time
            class="text-gray-500 dark:text-gray-400 text-sm hover:underline cursor-pointer"
            :datetime="post.createdAt"
          >
            {{ formatDate(post.createdAt) }}
          </time>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          @{{ post.username.toLowerCase() }}
        </p>
      </div>
    </header>

    <div class="space-y-4">
      <!-- Text Content -->
      <p class="text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">
        {{ post.content }}
      </p>

      <!-- Media -->
      <div
        v-if="post.file"
        class="relative w-full aspect-[4/5] max-h-[600px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/50 shadow-sm"
      >
        <div class="media-container">
          <MediaViewer
            :file-uuid="post.file.uuid"
            :file-name="post.file.fileName"
            :file-type="post.file.contentType"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Interaction Buttons -->
      <div class="flex items-center justify-between pt-4">
        <div class="flex items-center space-x-8">
          <BaseButton
            type="primary"
            @click="handleLikeClick"
            class="group flex items-center space-x-2 transition-colors"
            :class="{
              'text-pink-600 dark:text-pink-500': isLiked,
              'text-gray-500 dark:text-gray-400': !isLiked,
            }"
          >
            <i
              class="fas fa-heart text-xl group-hover:scale-110 transition-transform duration-200"
              :class="{ 'text-pink-600': isLiked }"
            ></i>
            <span class="text-sm font-medium">
              {{ likesCount }} {{ likesCount === 1 ? "Like" : "Likes" }}
            </span>
          </BaseButton>

          <BaseButton
            variant="outline"
            class="group flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <i
              class="fas fa-comment text-xl group-hover:scale-110 transition-transform duration-200"
            ></i>
            <span class="text-sm font-medium">Comment</span>
          </BaseButton>

          <BaseButton
            variant="outline"
            class="group flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <i
              class="fas fa-share text-xl group-hover:scale-110 transition-transform duration-200"
            ></i>
          </BaseButton>
        </div>
      </div>
    </div>
  </article>

  <!-- Loading State -->
  <div
    v-else
    class="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/85 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 animate-pulse"
  >
    <div class="flex space-x-4">
      <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/6"></div>
      </div>
    </div>
    <div class="mt-4 space-y-3">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2"></div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, toRefs, onMounted, computed } from "vue";
  import MediaViewer from "../atoms/MediaViewer.vue";
  import { useProfilePicture } from "@/services/profilePictureService";
  import { useLikeStore } from "@/store/likeStore";
  import { useAuthStore } from "@/store/authStore";

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
  const { profilePictureSrc, loading } = useProfilePicture(
    post.value.profilePicture
  );

  const likeStore = useLikeStore();
  const authStore = useAuthStore();

  onMounted(async () => {
    await likeStore.fetchLikesForPost(post.value.id);
  });

  const handleLikeClick = async () => {
    await likeStore.toggleLike(post.value.id);
  };

  const isLiked = computed(() =>
    likeStore.isPostLikedByUser(post.value.id, authStore.currentUser?.id)
  );

  const likesCount = computed(
    () => likeStore.getLikesForPost(post.value.id).length
  );

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
  .media-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .media-container :deep(img),
  .media-container :deep(video) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Keep existing hover transitions */
  .hover\:scale-110:hover {
    transform: scale(1.1);
  }
</style>
