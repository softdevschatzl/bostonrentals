<template>
  <div class="account-page">
    <div class="my-account" ref="my-account">
      <div class="container">
        <h1>My Account</h1>
        <div v-if="Object.keys(userAttributes).length > 0" class="account-info">
          <h2>Account Information</h2>
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
          <button @click="handleLogout">Logout</button>
          <button @click="redirectToCognitoUI">Change Password</button>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
      <div class="additional-info">
        <h2>Additional Information</h2>
        <div class="pre-approval-form">
          <label for="ethnicity">Ethnicity:</label>
          <input type="text" id="ethnicity" v-model="ethnicity">

          <label for="income">Income:</label>
          <input type="number" id="income" v-model="income">

          <label for="pets">Pets:</label>
          <input type="text" id="pets" v-model="pets">

          <label for="student">Student:</label>
          <input type="checkbox" id="student" v-model="isStudent">
        </div>
      </div>
    </div>
    <div class="saved-lists">
      <h2>Saved Lists</h2>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script>
import configureAWS from "../utils/aws-config.js";

export default {
  data() {
    return {
      userAttributes: []
    };
  },
  async created() {
    try {
      const userPool = await configureAWS();
      console.log("User pool:", userPool);
      this.fetchUserAttributes(userPool);
    } catch (error) {
      console.error("Error configuring AWS:", error);
    }
  },
  methods: {
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
    async fetchUserAttributes() {
      try {
        const response = await fetch("http://localhost:3000/api/user", {
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
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "GET",
        credentials: "include"
      });
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Failed to logout.");
      }
    }
  }
};
</script>

<style scoped>
.my-account {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background: black;
  border-radius: 5px;
  box-shadow: -10px -10px 20px #252525, 10px 10px 20px #505050;
  padding: 20px;
  max-width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  color: white;
}
h2 {
  margin-bottom: 20px;
  color: #333;
}

.account-info {
  background: #bbbbbb;
  border-radius: 10px;
  box-shadow: -5px -5px 10px #c9c9c9, 5px 5px 10px #999999;
  padding: 20px;
  margin-top: 20px;
}

.account-info ul {
  list-style-type: none;
  padding: 0;
}

.account-info li {
  background: #bbbbbb;
  border-radius: 10px;
  box-shadow: inset -5px -5px 10px #c9c9c9, inset 5px 5px 10px #999999;
  padding: 10px;
  margin-bottom: 10px;
}

.account-info li strong {
  color: #333;
}

.saved-lists {
  background: #bbbbbb;
  border-radius: 10px;
  box-shadow: -5px -5px 10px #c9c9c9, 5px 5px 10px #999999;
  padding: 20px;
  margin-top: 20px;
}

.additional-info {
  background: #bbbbbb;
  border-radius: 10px;
  box-shadow: -5px -5px 10px #c9c9c9, 5px 5px 10px #999999;
  padding: 20px;
  margin-top: 20px;
}

.pre-approval-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
