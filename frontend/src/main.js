/**
 * main.js
 * 
 * Main entry point of the application.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;

async function fetchCognitoConfig() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/cognito-config`);
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('Failed to fetch cognito configuration.', error);
        throw error;
    }
}

async function main() {
    try {
        const cognitoConfig = await fetchCognitoConfig();
        const app = createApp(App);
        app.config.globalProperties.$cognitoConfig = cognitoConfig;
        app.use(router).mount('#app')
    } catch (error) {
        console.error('Failed to initialize application.', error);
    }
}

main();
