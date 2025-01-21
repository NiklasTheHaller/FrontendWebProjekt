<template>
  <div class="min-h-screen bg-neutral-200">
    <!-- Header -->
    <header class="bg-neutral-100 shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <router-link
            to="/"
            class="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="../src/assets/litterbox-icon.png"
              alt="Logo"
              class="h-8 w-8 mr-2"
            />
            <span class="text-xl font-bold text-primary-DEFAULT"
              >LitterBox</span
            >
          </router-link>

          <!-- Main Navigation -->
          <nav class="hidden md:flex space-x-4">
            <router-link
              v-for="item in mainNavItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-neutral-600 hover:text-primary-DEFAULT hover:bg-neutral-200 transition-colors"
              active-class="text-primary-DEFAULT bg-neutral-200"
            >
              {{ item.name }}
            </router-link>

            <!-- Admin Submenu -->
            <div class="relative">
              <!-- Admin Button -->
              <button
                  @click="showDropdown = !showDropdown"
                  class="px-3 py-2 rounded-md text-neutral-600 hover:text-primary-DEFAULT hover:bg-neutral-200 transition-colors"
              >
                Admin
              </button>

              <!-- Dropdown Menu -->
              <ul
                  v-if="showDropdown"
                  class="absolute bg-neutral-100 shadow-md rounded-lg mt-2 w-48 z-50"
              >
                <li>
                  <router-link
                      to="/admin"
                      class="block px-4 py-2 hover:bg-neutral-200 rounded-md"
                  >
                    Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link
                      to="/admin/resources"
                      class="block px-4 py-2 hover:bg-neutral-200 rounded-md"
                  >
                    Manage Resources
                  </router-link>
                </li>
                <li>
                  <router-link
                      to="/admin/users"
                      class="block px-4 py-2 hover:bg-neutral-200 rounded-md"
                  >
                    Manage Users
                  </router-link>
                </li>
              </ul>
            </div>
          </nav>


            <!-- Auth Navigation -->
          <div class="flex items-center space-x-4">
            <template v-if="!isLoggedIn">
              <router-link
                to="/login"
                class="px-4 py-2 rounded-md bg-primary-600 text-neutral-100 hover:bg-primary-700 transition duration-300 shadow-sm hover:shadow-md"
              >
                Login
              </router-link>
              <router-link
                to="/registration"
                class="px-4 py-2 rounded-md bg-secondary-600 text-neutral-100 hover:bg-secondary-700 transition duration-300 shadow-sm hover:shadow-md"
              >
                Register
              </router-link>
            </template>
            <a
              v-else
              href="#"
              @click.prevent="logout"
              class="px-4 py-2 rounded-md text-neutral-600 hover:text-primary-DEFAULT transition-colors"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-neutral-700 text-neutral-300 py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-neutral-400">
              A modern microblogging platform for sharing your thoughts.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <div class="space-y-2">
              <router-link
                v-for="item in footerNavItems"
                :key="item.path"
                :to="item.path"
                class="block text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <p class="text-neutral-400">
              Email: contact@litterbox.com<br />
              Follow us on social media
            </p>
          </div>
        </div>
        <div
          class="mt-8 pt-8 border-t border-neutral-600 text-center text-neutral-400"
        >
          <p>&copy; 2025 Litterbox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from "./store/authStore";
import { useRouter } from "vue-router";
import { ref, computed, watch } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const showDropdown = ref(false); // State for dropdown visibility
    const navItems = ref([]);

    const username = computed(() => authStore.identifier);

    const mainNavItems = () => {
      navItems.value = [
        { name: "Home", path: "/" },
        { name: "Feed", path: "/feed" },
        { name: "Create Post", path: "/create-post" },
        { name: "Profile", path: "/profile" },
        { name: "My Posts", path: `/users/${username.value}/posts` },
      ];
    };

    watch(() => authStore.identifier, mainNavItems, { immediate: true });

    const footerNavItems = [
      { name: "About", path: "/about" },
      { name: "Help", path: "/help" },
      { name: "Imprint", path: "/imprint" },
    ];

    const isLoggedIn = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(
        () =>
            authStore.userRole === "ADMIN" ||
            localStorage.getItem("userRole") === "ADMIN"
    );

    function logout() {
      authStore.logout();
      router.push("/login");
    }

    return {
      logout,
      isLoggedIn,
      isAdmin,
      mainNavItems: navItems,
      footerNavItems,
      showDropdown,
    };
  },
};
</script>


