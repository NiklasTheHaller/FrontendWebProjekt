<template>
  <div class="mb-6">
    <!-- BaseLabel for displaying the label -->
    <BaseLabel :htmlFor="id" :text="labelText" />

    <!-- Input component that uses v-model properly -->
    <Input
        :id="id"
        :type="type"
        v-model="internalValue"
        :placeholder="placeholder"
        class="mt-1" />
  </div>
</template>

<script>
import BaseLabel from '@/components/atoms/BaseLabel.vue';
import Input from '@/components/atoms/BaseInput.vue';

export default {
  name: 'FormInput',
  components: {
    BaseLabel,
    Input,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    labelText: {
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
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        console.log('Internal value set:', value);  // Log the internal value
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>
