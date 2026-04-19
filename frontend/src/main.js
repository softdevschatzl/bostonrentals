/**
 * main.js
 * 
 * Main entry point of the application.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios';
import store from './store';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

const app = createApp(App)
            .use(store)
            .use(router);

app.mount('#app');
