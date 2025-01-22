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
          @edit-user="openEditModal"
          ></UserTable>
    </div>

    <!-- Edit User Modal -->
    <BaseModal
        v-model="isEditModalVisible"
        :customClass="['flex items-center justify-center min-h-screen']"
    >
      <template #body>
        <EditUserForm
            :user="selectedUser"
            @update-user="handleUserUpdate"
        />
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAllUserStore } from "@/store/allUserStore";
import UserTable from "@/components/molecules/UserTable.vue";
import BaseModal from "@/components/atoms/BaseModal.vue";
import EditUserForm from "@/components/molecules/EditUserForm.vue";

const userStore = useAllUserStore();

// Reactive state
const { users, loading, error } = storeToRefs(userStore);
const searchQuery = ref("");
const isEditModalVisible = ref(false);
const selectedUser = ref(null);

// Fetch users on mount
onMounted(async () => {
  await userStore.fetchAllUsers();
});

// Filtered users for the table
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return [...users.value].filter((user) =>
      user.username.toLowerCase().includes(query)
  );
});

// Open modal with selected user
const openEditModal = (user) => {
  selectedUser.value = { ...user }; // Shallow copy to avoid mutations
  isEditModalVisible.value = true;
};

const handleUserUpdate = async (updatedUser) => {
  try {
    console.log("Updated User Data:", updatedUser);

    // Pass the updated user data to the store's editUser method
    await userStore.editUser(updatedUser);

    // Close the modal after successful update
    isEditModalVisible.value = false;
  } catch (error) {
    console.error("Failed to update user:", error);
  }
};

</script>
