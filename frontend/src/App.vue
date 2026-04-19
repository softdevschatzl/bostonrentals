<template>
  <div>
    <NavBar/>
    <router-view />
  </div>
  <div
    v-if="showDiscontinuedNotice"
    class="discontinued-notice-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="discontinued-notice-title"
  >
    <div class="discontinued-notice-card">
      <p class="discontinued-notice-eyebrow">Portfolio Mirror</p>
      <h2 id="discontinued-notice-title">Backend Services Have Been Discontinued</h2>
      <p>
        This version of Alexander's Rentals is being hosted as a static portfolio project.
        Search, login, saved lists, email submission, and other backend-powered features
        are no longer active on this site. Please refer to my repository to view this code.
      </p>
      <button @click="dismissDiscontinuedNotice">Continue to Site</button>
    </div>
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
      showDiscontinuedNotice: false,
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
      this.$router.push('/login');
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
    dismissDiscontinuedNotice() {
      this.showDiscontinuedNotice = false;
      localStorage.setItem('bostonrentals-discontinued-notice-dismissed', 'true');
    },
  },
  created() {
    this.showDiscontinuedNotice =
      localStorage.getItem('bostonrentals-discontinued-notice-dismissed') !== 'true';
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

  .discontinued-notice-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.72);
  }

  .discontinued-notice-card {
    width: min(560px, 100%);
    padding: 32px 28px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    background: #111111;
    color: #f4f0e8;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }

  .discontinued-notice-eyebrow {
    margin-bottom: 12px;
    color: #d8ae69;
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .discontinued-notice-card h2 {
    margin-bottom: 16px;
    font-size: clamp(1.6rem, 3vw, 2rem);
    line-height: 1.15;
  }

  .discontinued-notice-card p {
    margin-bottom: 18px;
    line-height: 1.6;
  }

  .discontinued-notice-card button {
    border: 0;
    border-radius: 999px;
    padding: 12px 18px;
    background: #d8ae69;
    color: #111111;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .discontinued-notice-card button:hover {
    background: #e2bc82;
  }
</style>

