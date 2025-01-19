<template>
  <div class="my-4">
    <p class="text-gray-800">{{ content }}</p>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";

  defineProps({
    content: {
      type: String,
      required: true,
    },
  });
</script>
