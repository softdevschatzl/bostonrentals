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
      // Redirect to Cognito Hosted UI.
      window.location.href = 'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com/login?client_id=6srn63ccr7im4tagroi8sjs4sv&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Falexandersrentals.com';
      // window.location.href = 'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com/login?client_id=6srn63ccr7im4tagroi8sjs4sv&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:8000/';
    },
    goToMyAccount() {
      this.$router.push('/my-account');
    },
    checkLoginStatus() {
      fetch('/api/check-login-status', {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        // console.log('Login status response:', data);
        this.isUserLoggedIn = data.isLoggedIn;
      })
      .catch(error => console.error('Error checking login status:', error));
    },
    async handleAuthorizationCode(code) {
      try {
        const formData = new URLSearchParams();
        formData.append('code', code);

        const response = await fetch('/api/token', {
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData,
          credentials: 'include'
        });
        
        if (response.ok) {
          // const data = await response.json();
          // console.log('Token response:', data);
          this.checkLoginStatus();
        } else {
          console.error('Token exchange failed.');
        }
      } catch (error) {
        console.error('Token exchange failed:', error.message);
      }
    },
    async refreshToken() {
      try {
        const response = await fetch('/api/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new ('Token refresh failed.');
        }

        // The access token has been refreshed successfully.
        this.checkLoginStatus();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Redirect to the login page to log back in.
        this.$router.push('/login');
      }
    }
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

  @media only screen and (max-width: 768px) {
    .user-sign-in {
      padding: 0.6rem 0.8rem;
      font-size: 0.75rem;
    }
  }
</style>