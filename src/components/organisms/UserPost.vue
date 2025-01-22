<template>
  <article
    v-if="post && post.username"
    class="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/85 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out hover:scale-[1.01] p-6 max-w-2xl"
  >
    <!-- Header -->
    <header class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
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
      </div>
    </header>

    <div class="space-y-4">
      <!-- Edit Mode -->
      <div
        v-if="isEditing"
        class="space-y-4"
      >
        <textarea
          v-model="editedContent"
          class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="4"
        ></textarea>
        <div class="flex space-x-2">
          <BaseButton
            @click="saveEdit"
            type="primary"
            >Save</BaseButton
          >
          <BaseButton
            @click="cancelEdit"
            variant="outline"
            >Cancel</BaseButton
          >
        </div>
      </div>

      <!-- Regular Content View -->
      <template v-else>
        <p class="text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">
          {{ post.content }}
        </p>

        <!-- Media -->
        <div
          v-if="post.file"
          class="relative w-full aspect-[4/5] max-h-[600px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/50 shadow-sm"
        >
          <div class="media-container flex-shrink-0">
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
          </div>

          <!-- Moved Actions Button -->
          <div
            v-if="isOwnPost"
            class="relative"
          >
            <BaseButton
              @click="showActions = !showActions"
              variant="secondary"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <i class="fas fa-ellipsis-v">Actions</i>
            </BaseButton>

            <div
              v-if="showActions"
              class="absolute right-0 bottom-full mb-2 w-48 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200"
            >
              <div class="py-1">
                <button
                  @click="startEdit"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <i class="fas fa-edit mr-2"></i> Edit Post
                </button>
                <button
                  @click="confirmDelete"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                >
                  <i class="fas fa-trash-alt mr-2"></i> Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteConfirm"
      @close="showDeleteConfirm = false"
    >
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          Delete Post
        </h3>
      </template>
      <template #body>
        <p class="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <BaseButton
            @click="showDeleteConfirm = false"
            variant="outline"
            >Cancel</BaseButton
          >
          <BaseButton
            @click="deletePost"
            type="danger"
            >Delete</BaseButton
          >
        </div>
      </template>
    </BaseModal>
  </article>
</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    toRefs,
    onMounted,
    computed,
    ref,
  } from "vue";
  import MediaViewer from "../atoms/MediaViewer.vue";
  import BaseButton from "../atoms/BaseButton.vue";
  import { useProfilePicture } from "@/services/profilePictureService";
  import { useLikeStore } from "@/store/likeStore";
  import { useAuthStore } from "@/store/authStore";
  import { usePostStore } from "@/store/postStore";
  import BaseModal from "../atoms/BaseModal.vue";
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
  const postStore = usePostStore();

  // State for edit and delete functionality
  const showActions = ref(false);
  const isEditing = ref(false);
  const editedContent = ref("");
  const showDeleteConfirm = ref(false);

  // Check if current user owns the post or the user is an admin
  const isOwnPost = computed(() => {
    const currentUser = authStore.username; // Current user's username
    const postUsername = post.value.username; // Post's username
    const userRole = authStore.userRole; // User's role (e.g., 'admin', 'user')

    const isAdmin = userRole === "ADMIN"; // Determine if the user is an admin
    console.log("Current User:", currentUser);
    console.log("Post Username:", postUsername);
    console.log("User Role:", userRole);
    console.log("Is Admin:", isAdmin);
    console.log("Is Own Post:", currentUser === postUsername || isAdmin);

    return currentUser === postUsername || isAdmin;
  });

  // Edit functions
  const startEdit = () => {
    editedContent.value = post.value.content;
    isEditing.value = true;
    showActions.value = false;
  };

  const saveEdit = async () => {
    try {
      await postStore.updatePost(post.value.id, {
        content: editedContent.value,
      });
      post.value.content = editedContent.value;
      isEditing.value = false;
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const cancelEdit = () => {
    isEditing.value = false;
    editedContent.value = "";
  };

  // Delete functions
  const confirmDelete = () => {
    showDeleteConfirm.value = true;
    showActions.value = false;
  };

  const emit = defineEmits(["post-deleted"]);

  const deletePost = async () => {
    try {
      await postStore.deletePost(post.value.id);
      emit("post-deleted", post.value.id);
      showDeleteConfirm.value = false;
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // Existing functionality
  onMounted(async () => {
    await likeStore.fetchLikesForPost(post.value.id);
  });

  const handleLikeClick = async () => {
    console.log("Post ID in handleLikeClick:", post.value.id); // Log post ID
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
