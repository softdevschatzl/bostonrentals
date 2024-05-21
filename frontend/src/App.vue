<template>
  <div>
    <NavBar/>
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
      isLoggedIn: false,
    }
  },
  methods: {
    async redirectToCognitoUI() {
      try {
        const response = await fetch('/api/login');
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
    async checkIfLoggedIn() {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      } catch (error) {
        console.error('Error checking if logged in:', error);
      }
    },
  },
  created() {
    this.$store.dispatch('checkIfLoggedIn');
  },
  watch: {
    '$route': function() {
      this.$store.dispatch('checkIfLoggedIn');
    }
  }
}
</script>

<style>
  html {
    height: 100%;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: black;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

