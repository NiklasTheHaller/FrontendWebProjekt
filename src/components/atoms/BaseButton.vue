<template>
  <button
    class="rounded-md py-2.5 px-4 text-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="buttonClass"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script>
  export default {
    name: "BaseButton",
    props: {
      variant: {
        type: String,
        default: "primary",
        validator: (value) =>
          ["primary", "secondary", "ghost", "outline"].includes(value),
      },
      onClick: {
        type: Function,
        default: () => {},
      },
    },
    computed: {
      buttonClass() {
        switch (this.variant) {
          case "ghost":
            return "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300";
          case "outline":
            return "border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300";
          case "secondary":
            return "bg-secondary-600 text-neutral-100 border border-secondary-700 hover:bg-secondary-700 shadow-sm hover:shadow-md";
          default:
            return "bg-primary-600 text-neutral-100 border border-primary-700 hover:bg-primary-700 shadow-sm hover:shadow-md";
        }
      },
    },
  };
</script>
