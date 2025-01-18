<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    class="w-full px-4 py-2 rounded-md border border-neutral-300 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors bg-neutral-100 placeholder-neutral-400"
  />
</template>

<script>
  export default {
    name: "BaseInput",
    props: {
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: "text",
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      placeholder: {
        type: [String, Number],
        default: "",
      },
    },
  };
</script>

<style scoped>
  .base-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
