<!-- SignIn.vue -->

<template>
  <button v-if="!isUserLoggedIn" @click="handleLogin" class="user-sign-in">Login</button>
  <button v-else @click="goToMyAccount" class="user-sign-in">My Account</button>
</template>

<script>

export default {
  data() {
    return {
      isUserLoggedIn: false
    }
  },
  methods: {
    async handleLogin() {
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
    goToMyAccount() {
      this.$router.push('/my-account');
    },
    checkLoginStatus() {
      fetch('http://localhost:3000/api/check-login-status', {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        console.log('Login status response:', data);
        this.isUserLoggedIn = data.isLoggedIn;
      })
      .catch(error => console.error('Error checking login status:', error));
    },
    async handleAuthorizationCode(code) {
      try {
        const response = await fetch('http://localhost:3000/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code }),
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Token response:', data);
          this.checkLoginStatus();
        } else {
          console.error('Token exchange failed.');
        }
      } catch (error) {
        console.error('Token exchange failed:', error.message);
      }
    },
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      this.handleAuthorizationCode(code);
    }
  }
}
</script>

<style scoped>
  .user-sign-in {
    display: flex;
    align-items: flex-end;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    margin: 0.2rem;
    border-radius: 15px;
    background: #ECF0F3;
    box-shadow: 3px 3px 10px #313142,
                -3px -3px 10px #727299;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .user-sign-in:hover {
    opacity: 0.75;
    box-shadow: 2px 2px 5px #3b3b50,
                -2px -2px 5px #5c5c7c;
  }
</style>