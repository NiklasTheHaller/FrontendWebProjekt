<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="handleModelUpdate"
    @close="handleClose"
    :customClass="[
      'post-modal',
      'flex items-center justify-center min-h-screen',
    ]"
  >
    <template #body>
      <div class="max-w-2xl w-full mx-auto p-4">
        <UserPost
          :post="props.post"
          @post-deleted="handlePostDeleted"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
  import { defineProps, defineEmits } from "vue";
  import UserPost from "./UserPost.vue";
  import BaseModal from "../atoms/BaseModal.vue";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(["update:modelValue", "post-deleted"]);

  const handleModelUpdate = (value) => {
    emit("update:modelValue", value);
  };

  const handleClose = () => {
    emit("update:modelValue", false);
  };

  const handlePostDeleted = (postId) => {
    emit("post-deleted", postId);
    emit("update:modelValue", false);
  };
</script>
