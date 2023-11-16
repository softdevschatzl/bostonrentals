import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import SearchPage from '@/components/SearchPage.vue';

// Vue.use(Router);

const routes = [
    {
        path: '/', name: 'Home', component: HomePage
    },
    {
        path: '/search', name: 'Search', component: SearchPage 
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;


