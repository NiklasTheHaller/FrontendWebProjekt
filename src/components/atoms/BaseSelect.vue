<template>
  <select
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-2 rounded-md border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors bg-neutral-100"
  >
    <option
      value=""
      disabled
      selected
    >
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script>
  export default {
    name: "BaseSelect",
    props: {
      id: {
        type: String,
        required: true,
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      placeholder: {
        type: String,
        default: "Select an option",
      },
      options: {
        type: Array,
        required: true,
      },
    },
  };
</script>
