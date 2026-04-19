<template>
  <div class="account-page">
    <div class="my-account" ref="my-account">
      <div class="top-row">
      <h1>My Account</h1>
        <div class="container">
          <div class="account-info acc-object">
            <h2 class="info-title">Account Information</h2>
            <!-- <ul>
              <li v-for="(value, key) in userAttributes" :key="key">
                <strong>{{ key }}:</strong> {{ value }}
              </li>
            </ul> -->
            <ul>
              <li>
                <strong>Name:</strong> {{ userAttributes.name }}
              </li>
              <li>
                <strong>Email:</strong> {{ userAttributes.email }}
                <span v-if="userAttributes.email_verified">&#10003;</span>
              </li>
              <li>
                <strong>Phone Number:</strong> {{ userAttributes.phone_number }}
              </li>
            </ul>
            <div class="btn-row">
              <button class="btn-logout" @click="handleLogout">Logout</button>
              <button class="btn-pass" @click="$router.push('/change-password')">Change Password</button>
            </div>
          </div>
          <div class="additional-info acc-object">
            <div class="add-info-title">
              <h2>Additional Information</h2>
              <p>Tips for contacting agents</p>
            </div>
            <div class="faq-section">
              <h2>FAQ</h2>
              <div class="faq-questions">
                <div class="faq-item">
                  <h3>How do I start gathering listings I'd like to be shown to an agent?</h3>
                  <p>For starters, after creating an account and verifying your email, you would need to create a saved list and start saving listings from the search page.</p>
                </div>
                <div class="faq-item">
                  <h3>How do I contact an agent?</h3>
                  <p>Once you have a list of listing(s) you'd like to be shown, you can contact an agent by clicking on the <strong style="text-decoration: underline;">Share List</strong> button on the list page. This will open up a form for you to fill out with related information regarding your rental journey and and agent will reach back out to you, either by phone or email, whichever you prefer!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="saved-lists">
      <SavedLists />
    </div>
  </div>
</template>

<script>
import SavedLists from "./SavedLists.vue";

export default {
  components: {
    SavedLists,
  },
  data() {
    return {
      userAttributes: [],
    };
  },
  async created() {
    this.fetchUserAttributes();
  },
  methods: {
    async redirectToCognitoUI() {
      this.$router.push('/change-password');
    },
    async fetchUserAttributes() {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user attributes.");
        }
        const data = await response.json();
        this.userAttributes = data.user;
      } catch (error) {
        console.error("Error fetching user attributes:", error);
        this.redirectToCognitoUI();
      }
    },
    async handleLogout() {
      // Make backend endpoint call to /api/logout and redirect user to home page.
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include"
      });
      if (response.ok) {
        this.$store.commit("SET_LOGIN_STATUS", false);
        window.location.href = "/";
      } else {
        console.error("Failed to logout.");
      }
    },
    checkLoginStatus() {
      fetch("/api/check-login-status", {
        method: "GET",
        credentials: "include"
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log('Login status response:', data);
          this.isUserLoggedIn = data.isLoggedIn;
        })
        .catch((error) => console.error("Error checking login status:", error));
    },
  },
  mounted() {
    // Check for jwt token to verify user session is active at all times
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.handleAuthorizationCode(code);
    } else {
      this.checkLoginStatus();
    }
  }
};
</script>

<style scoped>
/* General Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: black; /* Light background for neumorphic effect */
}

/* Account Page Styles */
.account-page {
  font-size: 16px;
  color: #333;
}

/* My Account Styles */
.my-account {
  background: #363636;
  border-radius: 20px;
  border: 4px solid #a7a7a7;
  padding: 40px;
  margin: 20px;
}

/* Top Row Styles */
.top-row h1 {
  color: #fff;
  margin-bottom: 40px;
  text-align: center;
}

/* Container Styles */
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.acc-object {
  box-shadow: inset 5px 5px 10px #a7a7a7, inset -5px -5px 10px #ffffff;
}

/* Account Information Styles */
.account-info {
  background: #E0E5EC;
  border-radius: 20px;
  border: 4px #a7a7a7;
  padding: 20px;
  margin-top: 20px;
  width: 300px;
}

.account-info ul {
  list-style-type: none;
  padding: 0;
}

.account-info li {
  padding: 10px;
  margin-bottom: 10px;
}

.btn-row {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* Additional Information Styles */
.additional-info {
  background: #E0E5EC;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  max-width: 750px;
}
.add-info-title {
  margin-bottom: 20px;
  text-align: center;
}

.faq-section {
  background: #E0E5EC;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.faq-section h2 {
  margin-bottom: 20px;
}
.faq-section h3 {
  margin-bottom: 20px;
  text-decoration: underline;
}

.faq-questions {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 40px;
}
.faq-item {
  width: 250px;
}

/* Button Styles */
.btn-logout, .btn-pass, .submit-form {
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin-top: 20px;
  background: #E0E5EC;
  box-shadow: 3px 3px 6px #a7a7a7, -3px -3px 6px #ffffff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover, .btn-pass:hover, .submit-form:hover {
  box-shadow: inset 3px 3px 6px #a7a7a7, inset -3px -3px 6px #ffffff;
}

/* Saved Lists Styles */
.saved-lists {
  background: #E0E5EC;
  border-radius: 20px;
  border: 4px solid #333333;
  padding: 20px;
  margin: 20px;
  text-align: center;
}

@media only screen and (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }
  .account-info, .additional-info {
    width: 90%;
  }
  .faq-questions {
    flex-direction: column;
  }
  .faq-item {
    width: 100%;
  }
  .btn-row {
    flex-direction: column;
  }
  .btn-logout, .btn-pass {
    margin-top: 10px;
  }
}

</style>
