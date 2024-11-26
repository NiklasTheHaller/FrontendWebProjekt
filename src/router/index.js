import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/store/authStore';

const AboutView = () => import('../views/AboutView.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegistrationView = () => import('../views/RegistrationViewTest.vue');
const ProfileView = () => import('../views/ProfileView.vue');
const FeedView = () => import('../views/FeedView.vue');
const AdminDashboardView = () => import('../views/AdminDashboardView.vue');
const ImprintView = () => import('../views/ImprintView.vue')
const HelpView = () => import('../views/HelpView.vue')

const routes = [
    {
        path: '/imprint',
        name: 'Imprint',
        component: ImprintView,
    },
    {
        path: '/help',
        name: 'Help',
        component: HelpView,
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/registration',
        name: 'registration',
        component: RegistrationView,
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: {requiresAuth: true},
    },
    {
        path: '/feed',
        name: 'feed',
        component: FeedView,
        meta: {requiresAuth: true},
    },
    {
        path: '/admin',
        name: 'admin-dashboard',
        component: AdminDashboardView,
        meta: {requiresAuth: true, requiresAdmin: true},
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Access the Pinia store for auth

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({name: 'login'});
    }
    // Check if the route requires admin access
    else if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
        next({name: 'home'});
    } else {
        next();
    }
});

export default router;
