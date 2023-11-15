import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/App.vue';
import SearchPage from '@/components/SearchPage.vue';

// Vue.use(Router);

const routes = [
    {
        path: '/', name: 'Home', component: Home
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


