<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link to="/login">Login</router-link>
    |
    <router-link to="/registration">Registration</router-link>
    |
    <router-link to="/profile">Profile</router-link>
    |
    <router-link to="/feed">Feed</router-link>
    |
    <router-link to="/admin">AdminDashboard</router-link>
  </nav>

  <!-- Role switcher buttons for testing -->
  <div class="role-switcher">
    <label for="role-select">Switch Role:</label>
    <select id="role-select" @change="changeRole">
      <option value="" disabled selected>Select a role</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="none">None</option>
    </select>
  </div>

  <router-view/>
</template>

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
  z-index: 1000; /* Ensure buttons are above other content */
}

</style>
<script>
import {useAuthStore} from './store/authStore';

export default {
  setup() {
    const authStore = useAuthStore();

    function changeRole(event) {
      const selectedRole = event.target.value;
      if (selectedRole === 'none') {
        logout();
        return;
      }
      const dummyToken = 'dummy-token'; // Use a dummy token for testing
      if (selectedRole) {
        authStore.login(selectedRole, dummyToken);
      }
    }

    function logout() {
      authStore.logout();
    }

    return {changeRole, logout, authStore};
  },
};
</script>