import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./store/authStore";
import "./assets/css/global.css";
import "@/services/axios";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth check on app load
const authStore = useAuthStore();
authStore.checkAuth().catch((error) => {
  console.error("Initial auth check failed:", error);
  router.push("/");
});

app.mount("#app");
