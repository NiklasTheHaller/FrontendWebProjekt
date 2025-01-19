<template>
  <span>{{ formattedTimestamp }}</span>
</template>

<script>
  export default {
    props: {
      timestamp: {
        type: String,
        required: true,
      },
    },
    computed: {
      formattedTimestamp() {
        // Parse the timestamp string into a Date object
        const date = new Date(this.timestamp);

        // Define options for formatting
        const options = { day: "numeric", month: "short", year: "numeric" };

        // Use Intl.DateTimeFormat for localization and formatting
        return new Intl.DateTimeFormat("en-US", options).format(date);
      },
    },
  };
</script>

<style scoped>
  /* Add any styles if necessary */
</style>
