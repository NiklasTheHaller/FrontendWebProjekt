<template>
  <div class="flex items-center space-x-4">
    <BaseAvatar :src="avatarSrc" />
    <BaseUsername :name="username" />
  </div>
</template>

<script>
  import BaseAvatar from "../atoms/BaseAvatar.vue";
  import BaseUsername from "../atoms/BaseUsername.vue";

  export default {
    props: {
      avatarSrc: {
        type: String,
        default: null,
      },
      username: {
        type: String,
        required: true,
      },
    },
    components: { BaseAvatar, BaseUsername },
  };
</script>
