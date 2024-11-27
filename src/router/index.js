// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

// Import your views
const HomeView = () => import("../views/HomeView.vue");
const AboutView = () => import("../views/AboutView.vue");
const LoginView = () => import("../views/LoginView.vue");
const RegistrationView = () => import("../views/RegistrationView.vue");
const ProfileView = () => import("../views/ProfileView.vue");
const FeedView = () => import("../views/FeedView.vue");
const AdminDashboardView = () => import("../views/AdminDashboardView.vue");
const ImprintView = () => import("../views/ImprintView.vue");
const HelpView = () => import("../views/HelpView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Attempt to validate token or refresh if necessary
  await authStore.checkAuth();

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole || localStorage.getItem("userRole"); // Use localStorage as fallback

  // Check authentication requirements
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
    return;
  }

  // Check admin requirements
  if (to.meta.requiresAdmin && userRole !== "ADMIN") {
    next({ name: "home" });
    return;
  }

  next(); // Allow navigation
});


export default router;
