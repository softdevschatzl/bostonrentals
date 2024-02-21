<template>
  <div class="my-account" ref="my-account">
    <h1>My Account</h1>
    <div v-if="userAttributes.length > 0" class="account-info">
      <h2>Account Information</h2>
      <ul>
        <li v-for="(value, key) in userAttributes" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading...</p>
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
        this.userAttributes = data.attributes;
      } catch (error) {
        console.error("Error fetching user attributes:", error);
        // this.redirectToCognitoUI();
      }
    },
  }
};
</script>

<style scoped>

</style>
