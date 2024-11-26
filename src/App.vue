<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/feed">Feed</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/help">Help</router-link> |
    <router-link to="/imprint">Imprint</router-link>

    <!-- Show AdminDashboard only if the user is an admin -->
    <template v-if="isAdmin">
      |
      <router-link to="/admin">AdminDashboard</router-link>
    </template>

    <!-- Show Login and Registration only if the user is not logged in -->
    <template v-if="!isLoggedIn">
      |
      <router-link to="/login">Login</router-link> |
      <router-link to="/registration">Registration</router-link>
    </template>

    <!-- Show Logout if the user is logged in -->
    <template v-else>
      |
      <a href="#" @click.prevent="logout">Logout</a>
    </template>
  </nav>

  <!-- Role switcher buttons for testing -->
  <div class="role-switcher">
    <label for="role-select">Switch Role:</label>
    <select id="role-select" v-model="selectedRole" @change="changeRole">
      <option value="" disabled>Select a role</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="none">None</option>
    </select>
  </div>

  <div>
    <p>Authenticated: {{ authState.isAuthenticated }}</p>
    <p>Role: {{ authState.userRole }}</p>
  </div>

  <router-view />
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
    const isAdmin = computed(() => authStore.userRole === "admin");

    const authState = computed(() => ({
      isAuthenticated: authStore.isAuthenticated,
      userRole: authStore.userRole,
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

    return {
      changeRole,
      logout,
      isLoggedIn,
      isAdmin,
      selectedRole,
      authState,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.role-switcher {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
