import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import SearchPage from '@/components/SearchPage.vue';
import AboutPage from '@/components/AboutPage.vue';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage.vue';
import CookiePolicyPage from '@/components/CookiePolicyPage.vue';
import TermsOfServicePage from '@/components/TermsOfServicePage.vue';
import MyAccount from '@/components/MyAccount.vue';

// Vue.use(Router);

const routes = [
    {
        path: '/', name: 'Home', component: HomePage
    },
    {
        path: '/search', name: 'Search', component: SearchPage 
    },
    {
        path: '/about', name: 'About', component: AboutPage
    },
    {
        path: '/privacy-policy', name: 'PrivacyPolicy', component: PrivacyPolicyPage
    },
    {
        path: '/cookie-policy', name: 'CookiePolicy', component: CookiePolicyPage
    },
    {
        path: '/terms-of-service', name: 'TermsOfService', component: TermsOfServicePage
    },
    {
        path: '/my-account', name: 'MyAccount', component: MyAccount
    },
    {
        path: '/login', name: 'Login', 
        beforeEnter() {
            const cognitoClientId = this.$cognitoConfig.cognitoClientId;
            const cognitoDomain = this.$cognitoConfig.cognitoDomain;
            const redirectUri = this.$cognitoConfig.redirectUri;

            if (!cognitoClientId || !cognitoDomain) {
                console.error('Cognito configuration is missing.');
                return;
            }

            window.location.href = `${cognitoDomain}/login?response_type=code&client_id=${cognitoClientId}&redirect_uri=${redirectUri}`;
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;


