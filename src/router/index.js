// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

// Import views with explicit chunk names for better error handling
const HomeView = () =>
  import(/* webpackChunkName: "home" */ "../views/HomeView.vue");
const AboutView = () =>
  import(/* webpackChunkName: "about" */ "../views/AboutView.vue");
const LoginView = () =>
  import(/* webpackChunkName: "login" */ "../views/LoginView.vue");
const RegistrationView = () =>
  import(
    /* webpackChunkName: "registration" */ "../views/RegistrationView.vue"
  );
const ProfileView = () =>
  import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue");
const FeedView = () =>
  import(/* webpackChunkName: "feed" */ "../views/FeedView.vue");
const CreatePostView = () =>
  import(/* webpackChunkName: "login" */ "../views/CreatePostView.vue");
const AdminDashboardView = () =>
  import(/* webpackChunkName: "admin" */ "../views/AdminDashboardView.vue");
const ImprintView = () =>
  import(/* webpackChunkName: "imprint" */ "../views/ImprintView.vue");
const HelpView = () =>
  import(/* webpackChunkName: "help" */ "../views/HelpView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    // Add error handling for component loading
    props: true,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/registration",
    name: "registration",
    component: RegistrationView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/feed",
    name: "feed",
    component: FeedView,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePostView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/imprint",
    name: "imprint",
    component: ImprintView,
  },
  {
    path: "/help",
    name: "help",
    component: HelpView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Add global error handler for navigation failures
router.onError((error) => {
  console.error("Router error:", error);
  // Redirect to home page or error page if needed
  router.push({ name: "home" });
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for auth check if route requires authentication
  if (to.meta.requiresAuth) {
    // Only check auth if we're not already authenticated
    if (!authStore.isAuthenticated) {
      const isAuthenticated = await authStore.checkAuth();
      if (!isAuthenticated) {
        next({ name: "login" });
        return;
      }
    }
  }

  const userRole = authStore.userRole;

  if (to.meta.requiresAdmin && userRole !== "ADMIN") {
    next({ name: "home" });
    return;
  }

  next();
});

export default router;
