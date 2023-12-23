/**
 * main.js
 * 
 * Main entry point of the application.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios';
import { getUserPool } from '../cognito';

axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);

const userPool = getUserPool();

app.config.globalProperties.$userPool = userPool;

app.use(router);

app.mount('#app')
