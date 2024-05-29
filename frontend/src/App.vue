<template>
  <div>
    <NavBar/>
    <router-view />
  </div>
  <div v-if = "showSessionExpiredMessage" class="session-expired">
    <p>Your session has expired. Please log in again.</p>
    <button @click="onLoginButtonClick">Log In</button>
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
      timeoutId: null,
      showSessionExpiredMessage: false,
    }
  },
  methods: {
    // Starts an inactivity timer for user sessions.
    startTimer() {
      // what is 20 minutes in milliseconds?
      // 20 minutes * 60 seconds * 1000 milliseconds
      // 1200000 milliseconds
      // thanks
      // https://www.w3schools.com/jsref/met_win_settimeout.asp
      this.timeoutId = setTimeout(this.logout, 1200000);
    },
    resetTimer() {
      clearTimeout(this.timeoutId);
      this.startTimer();
    },
    async logout() {
      try {
        // Make a request to the lgout endpoint.
        const response = await fetch('/api/logout', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error ('Logout request failed.');
        }

        // Update the logged-in state in the Vuex store.
        this.$store.commit('SET_LOGIN_STATUS', false);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
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
    onLoginButtonClick() {
      this.redirectToCognitoUI();
    },
  },
  created() {
    this.$store.dispatch('checkIfLoggedIn');
    this.startTimer();
  },
  watch: {
    '$route': function() {
      this.$store.dispatch('checkIfLoggedIn');
      this.resetTimer();
    }
  },
  mounted() {
    // Reset the inactivity timer whenever the user interacts with the page.
    window.addEventListener('click', this.resetTimer);
    window.addEventListener('mousemove', this.resetTimer);
    window.addEventListener('keypress', this.resetTimer);
    window.addEventListener('scroll', this.resetTimer);
    window.addEventListener('mousedown', this.resetTimer);
  },
  beforeUnmount() {
    window.removeEventListener('click', this.resetTimer);
    window.removeEventListener('mousemove', this.resetTimer);
    window.removeEventListener('keypress', this.resetTimer);
    window.removeEventListener('scroll', this.resetTimer);
    window.removeEventListener('mousedown', this.resetTimer);
  },
};
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

