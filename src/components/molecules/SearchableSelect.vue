<template>
  <div class="space-y-2">
    <!-- Search Input -->
    <BaseInput
      :id="`${id}-search`"
      v-model="searchTerm"
      :placeholder="searchPlaceholder"
      class="mb-2"
    />

    <!-- Filtered Select -->
    <BaseSelect
      :id="id"
      :modelValue="modelValue"
      :options="filteredOptions"
      :placeholder="placeholder"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script>
  import BaseInput from "../atoms/BaseInput.vue";

  import BaseSelect from "../atoms/BaseSelect.vue";

  export default {
    name: "SearchableSelect",
    components: {
      BaseInput,
      BaseSelect,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      options: {
        type: Array,
        required: true,
      },
      placeholder: {
        type: String,
        default: "Select an option",
      },
      searchPlaceholder: {
        type: String,
        default: "Search...",
      },
    },
    data() {
      return {
        searchTerm: "",
      };
    },
    computed: {
      filteredOptions() {
        if (!this.searchTerm) return this.options;
        const term = this.searchTerm.toLowerCase();
        return this.options.filter((option) =>
          option.label.toLowerCase().includes(term)
        );
      },
    },
  };
</script>

<style scoped>
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
</style>
