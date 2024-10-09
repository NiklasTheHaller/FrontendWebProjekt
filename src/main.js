import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import {useAuthStore} from './store/authStore'; // Import the auth store

const app = createApp(App);

// Initialize Pinia and Router
app.use(createPinia());
app.use(router);

// Call checkAuth to restore auth state on app load
const authStore = useAuthStore();
authStore.checkAuth();

// Mount the app
app.mount('#app');
