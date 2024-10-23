<template>
  <input
      :id="id"
      :type="type"
      :value="modelValue"
  @input="$emit('update:modelValue', $event.target.value)"
  :placeholder="placeholder"
  class="base-input"
  />
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: [String, Number],
      default: '',
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
