<template>
  <div class="container mx-auto p-6">
    <div
      v-if="loading"
      class="text-center"
    >
      <p>Loading post...</p>
    </div>

    <div
      v-else-if="error"
      class="text-red-500 text-center"
    >
      {{ error }}
    </div>

    <div v-else-if="currentPost">
      <UserPost :post="currentPost" />
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { storeToRefs } from "pinia";
  import { usePostStore } from "@/store/postStore";
  import UserPost from "@/components/organisms/UserPost.vue";

  const route = useRoute();
  const postStore = usePostStore();
  const { currentPost, loading, error } = storeToRefs(postStore);

  onMounted(async () => {
    await postStore.fetchPostById(route.params.id);
  });
</script>
