<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">{{ username }}'s Posts</h1>

    <div
      v-if="loading"
      class="text-center"
    >
      <p>Loading posts...</p>
    </div>

    <div
      v-else-if="error"
      class="text-red-500 text-center"
    >
      {{ error }}
    </div>

    <div v-else>
      <div
        v-if="sortedUserPosts.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UserPostPreview
          v-for="post in sortedUserPosts"
          :key="post.id"
          :post="post"
          @click-post="openPostModal"
        />
      </div>

      <div
        v-else
        class="text-center text-gray-500"
      >
        <p>No posts available.</p>
      </div>

      <!-- Post Modal -->
      <PostModal
        v-if="selectedPost"
        v-model="showPostModal"
        :post="selectedPost"
        @post-deleted="handlePostDeleted"
      />
    </div>
  </div>
</template>

<script setup>
  import { onMounted, computed, ref } from "vue";
  import { useRoute } from "vue-router";
  import { storeToRefs } from "pinia";
  import { usePostStore } from "@/store/postStore";
  import UserPostPreview from "@/components/organisms/UserPostPreview.vue";
  import PostModal from "@/components/organisms/PostModal.vue";

  const route = useRoute();
  const username = computed(() => route.params.username);
  const postStore = usePostStore();

  const showPostModal = ref(false);
  const selectedPost = ref(null);

  const { userPosts, loading, error } = storeToRefs(postStore);

  const openPostModal = (post) => {
    selectedPost.value = post;
    showPostModal.value = true;
  };

  const handlePostDeleted = async (postId) => {
    try {
      await postStore.deletePost(postId);
      selectedPost.value = null;
      showPostModal.value = false;
      await postStore.fetchUserPosts(username.value);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  onMounted(async () => {
    await postStore.fetchUserPosts(username.value);
  });

  const sortedUserPosts = computed(() => {
    return [...userPosts.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });
</script>
