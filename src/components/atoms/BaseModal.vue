<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    customClass: {
      type: [String, Object, Array],
      default: "",
    },
  });

  const emit = defineEmits(["update:modelValue", "close"]);

  const closeModal = () => {
    emit("update:modelValue", false);
    emit("close");
  };
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      :class="[customClass, { 'is-open': props.modelValue }]"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-neutral-700 bg-opacity-75"
        @click="closeModal"
      ></div>

      <!-- Modal content -->
      <div
        class="relative bg-neutral-100 dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <button
          class="absolute top-4 right-4 text-neutral-500 hover:text-neutral-600"
          @click="closeModal"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="mb-4">
          <slot name="header"></slot>
        </div>

        <div class="mb-4">
          <slot name="body"></slot>
        </div>

        <div class="mt-6">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
