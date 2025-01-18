<template>
  <label
    :for="htmlFor"
    class="block text-sm font-semibold text-neutral-700 mb-1"
  >
    {{ text }}
  </label>
</template>

<script>
  export default {
    name: "BaseLabel",
    props: {
      htmlFor: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style scoped></style>
