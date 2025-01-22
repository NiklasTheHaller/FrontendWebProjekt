<template>
  <div v-if="error" class="text-center text-red-500">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="!users.length" class="text-center text-gray-500">
    <p>No users available.</p>
  </div>
  <div v-else>
    <table class="min-w-full border border-gray-200">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left">Username</th>
        <th class="px-4 py-2 text-left">Email</th>
        <th class="px-4 py-2 text-left">Role</th>
        <th class="px-4 py-2 text-center">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
        <td class="px-4 py-2">{{ user.username }}</td>
        <td class="px-4 py-2">{{ user.email }}</td>
        <td class="px-4 py-2">{{ user.role }}</td>
        <td class="px-4 py-2 text-center space-x-2">
          <button
              @click="editUser(user)"
              class="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
              @click="lockUser(user.id)"
              :class="{
                'bg-orange-500': !user.locked,
                'bg-gray-400': user.locked,
              }"
              class="px-2 py-1 text-white rounded"
          >
            {{ user.locked ? "Locked" : "Lock" }}
          </button>
          <button
              @click="confirmDelete(user)"
              class="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    error: String,
    lockUser: Function,
    deleteUser: Function,
    editUser: Function,
  },
  methods: {
    confirmDelete(user) {
      if (confirm(`Are you sure you want to delete ${user.username}?`)) {
        this.deleteUser(user.id);
      }
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
