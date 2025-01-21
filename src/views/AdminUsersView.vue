<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Manage Users</h1>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
          v-model="searchQuery"
          type="text"
          class="border px-4 py-2 w-full"
          placeholder="Search users by username..."
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500">
      <p>Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- No Users State -->
    <div v-else-if="!filteredUsers.length">
      <p class="text-center text-gray-500">No users found.</p>
    </div>

    <!-- User Table -->
    <div v-else>
      <UserTable
          :users="filteredUsers"
          :lockUser="userStore.lockUser"
          :deleteUser="userStore.deleteUser"
          :editUser="userStore.editUser"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAllUserStore } from "@/store/allUserStore";
import UserTable from "@/components/molecules/UserTable.vue";

const userStore = useAllUserStore();

// Extract reactive properties from the store
const { users, loading, error } = storeToRefs(userStore);

// State for the search query
const searchQuery = ref("");

// Fetch all users when the component mounts
onMounted(async () => {
  await userStore.fetchAllUsers(); // Ensure data is fetched on mount
});

// Compute sorted users for display
const sortedUsers = computed(() => {
  if (!users.value) return []; // Fallback for undefined state
  return [...users.value].sort(
      (a, b) => a.username.localeCompare(b.username) // Sort alphabetically by username
  );
});

// Filter users based on the search query
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedUsers.value.filter((user) =>
      user.username.toLowerCase().includes(query)
  );
});
</script>


