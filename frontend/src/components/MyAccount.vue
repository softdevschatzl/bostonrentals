<template>
  <div class="account-page">
    <div class="my-account" ref="my-account">
      <div class="top-row">
      <h1>My Account</h1>
        <div class="container">
          <div class="account-info acc-object" v-if="Object.keys(userAttributes).length > 0">
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
              <button class="btn-pass" @click="redirectToCognitoUI">Change Password</button>
            </div>
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
          <div class="additional-info acc-object">
            <div class="add-info-title">
              <h2>Additional Information</h2>
              <p>Optional form for pre-approval</p>
            </div>
            <div class="pre-approval-form">
              <label for="income">Income:</label>
              <input type="number" id="income" v-model="income">

              <label for="creditScore">Credit Score:</label>
              <input type="number" id="creditScore" v-model="creditScore">

              <label for="pets">Pets:</label>
              <input type="text" id="pets" v-model="pets">

              <div class="checkbox-group">
                <label for="student">Student:</label>
                <input class="checkbox" type="checkbox" id="student" v-model="isStudent">
              </div>

              <label for="employed">Apartment Preferences:</label>
              <input placeholder="Describe your dream apartment..." type="text" id="apartmentPreferences" v-model="apartmentPreferences">

              <div class="checkbox-group">
                <label for="broker">Are you aware that you would be working with a brokerage, there could be a fee for our service?</label>
                <input class="checkbox" type="checkbox" id="broker" v-model="isBroker">
              </div>
            </div>
            <div class="btn-row">
              <button class="submit-form" @click="submitForm">Submit</button>
            </div>
          </div>
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
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      userAttributes: [],
      income: '',
      creditScore: '',
      pets: '',
      isStudent: false,
      apartmentPreferences: '',
      isBroker: false
    };
  },
  validations: {
    income: { required, minValue: minValue(0) },
    creditScore: { required, minValue: minValue(300), maxValue: maxValue(850) },
    pets: { required, minLength: minLength(1), maxLength: maxLength(50) },
    isStudent: { required },
    apartmentPreferences: { required, minLength: minLength(1), maxLength: maxLength(500) },
    isBroker: { required }
  },
  async created() {
    try {
      const userPool = await configureAWS();
      // console.log("User pool:", userPool);
      this.fetchUserAttributes(userPool);
    } catch (error) {
      console.error("Error configuring AWS:", error);
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
        window.location.href = "/";
      } else {
        console.error("Failed to logout.");
      }
    },
    submitForm() {
      console.log("Submitting form...");
      // implement this to submit and save to DB.
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

.button-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Additional Information Styles */
.additional-info {
  background: #E0E5EC;
  border-radius: 20px;
  box-shadow: inset 5px 5px 10px #a7a7a7, inset -5px -5px 10px #ffffff;
  padding: 20px;
  margin-top: 20px;
  width: 300px;
}
.add-info-title {
  margin-bottom: 20px;
  text-align: center;
}

/* Form Styles */
.pre-approval-form {
  display: flex;
  flex-direction: column;
}

.pre-approval-form input[type='text'],
.pre-approval-form input[type='number'] {
  border: none;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  background: #E0E5EC;
  box-shadow: inset 2px 2px 5px #a7a7a7, inset -2px -2px 5px #ffffff;
}
.pre-approval-form input[type='checkbox'] {
  border: none;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  background: #E0E5EC;
}
.checkbox-group {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-top: 10px
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

</style>
