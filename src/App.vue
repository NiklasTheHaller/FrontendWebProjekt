<template>
  <div class="bg-light min-h-screen">
    <nav class="p-8">
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/"
        >Home</router-link
      >
      |
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/feed"
        >Feed</router-link
      >
      |
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/profile"
        >Profile</router-link
      >
      |
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/about"
        >About</router-link
      >
      |
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/help"
        >Help</router-link
      >
      |
      <router-link
        class="font-bold text-secondary"
        active-class="text-primary"
        to="/imprint"
        >Imprint</router-link
      >

      <!-- Show AdminDashboard only if the user is an admin -->
      <template v-if="isAdmin">
        |
        <router-link
          class="font-bold text-secondary"
          active-class="text-primary"
          to="/admin"
          >AdminDashboard</router-link
        >
      </template>

      <!-- Show Login and Registration only if the user is not logged in -->
      <template v-if="!isLoggedIn">
        |
        <router-link
          class="font-bold text-secondary"
          active-class="text-primary"
          to="/login"
          >Login</router-link
        >
        |
        <router-link
          class="font-bold text-secondary"
          active-class="text-primary"
          to="/registration"
          >Registration</router-link
        >
      </template>

      <!-- Show Logout if the user is logged in -->
      <template v-else>
        |
        <a
          href="#"
          @click.prevent="logout"
          class="font-bold text-secondary"
          :class="{ 'text-primary': isActive('/logout') }"
          >Logout</a
        >
      </template>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from "./store/authStore";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const selectedRole = ref("");

    const isLoggedIn = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(
      () => authStore.userRole || localStorage.getItem("userRole") === "ADMIN"
    );

    const authState = computed(() => ({
      isAuthenticated: authStore.isAuthenticated,
      userRole: authStore.userRole || localStorage.getItem("userRole"),
    }));

    async function changeRole() {
      if (selectedRole.value === "none") {
        await authStore.logout();
      } else if (selectedRole.value) {
        await authStore.switchRole(selectedRole.value); // This uses the mock if mockMode is true
        router.push("/"); // Redirect after switching roles
      }
    }

    function logout() {
      authStore.logout();
      selectedRole.value = "";
      router.push("/login");
    }

    function isActive(path) {
      return router.currentRoute.value.path === path;
    }

    return {
      changeRole,
      logout,
      isLoggedIn,
      isAdmin,
      selectedRole,
      authState,
      isActive,
    };
  },
};
</script>

<style scoped>
/* Remove the existing styles */
</style>
