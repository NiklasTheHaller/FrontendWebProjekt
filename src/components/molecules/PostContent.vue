<template>
  <div class="space-y-4">
    <TextContent :content="content" />

    <div
      v-if="file"
      class="relative w-full aspect-[4/5] max-h-[600px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/50 shadow-sm"
    >
      <MediaViewer
        :file-uuid="file.uuid"
        :file-name="file.fileName"
        :file-type="file.contentType"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";
  import TextContent from "../atoms/TextContent.vue";
  import MediaViewer from "../atoms/MediaViewer.vue";

  defineProps({
    content: {
      type: String,
      required: true,
    },
    file: {
      type: Object,
      default: null,
    },
  });
</script>
