<template>
  <Teleport to="body">
    <div
      v-if="props.modelValue || props.show"
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Modal -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="handleClose"
            class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <i class="fas fa-times text-xl"></i>
          </button>

          <!-- Header -->
          <div class="mb-4">
            <slot name="header"></slot>
          </div>

          <!-- Body -->
          <div class="mb-6">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div class="mt-4 flex justify-end gap-2">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:modelValue", "close"]);

  const handleClose = () => {
    emit("update:modelValue", false);
    emit("close");
  };
</script>

<style scoped>
  .fixed {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
