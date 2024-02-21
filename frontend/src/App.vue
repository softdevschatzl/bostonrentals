<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      inactivityTimer: null,
    }
  },
  created() {
    this.resetInactivityTimer()
    window.addEventListener('mousemove', this.resetInactivityTimer);
    window.addEventListener('keypress', this.resetInactivityTimer);
  },
  beforeUnmount() {
    clearTimeout(this.inactivityTimer);
    window.removeEventListener('mousemove', this.resetInactivityTimer);
    window.removeEventListener('keypress', this.resetInactivityTimer);
  },
  methods: {
    resetInactivityTimer() {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        this.redirectToCognitoUI();
      }, 600000);
    },
    handleInactivity() {
      this.redirectToCognitoUI();
    },
    async redirectToCognitoUI() {
      try {
        const response = await fetch('http://localhost:3000/api/login');
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.url;
        } else {
          console.error('Login failed.');
        }
      } catch (error) {
        console.error('Login failed:', error.message);
      }
    },
  }
}
</script>

<style>
  html {
    height: 100%;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: rgb(69, 69, 69);
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

