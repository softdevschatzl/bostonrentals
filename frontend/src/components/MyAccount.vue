<template>
  <div class="my-account" ref="my-account">
    <h2>My Account</h2>
    <div class="account-details">
      <label>Name:</label>
      <span>{{ userName }}</span>

      <label>Email:</label>
      <span>{{ userEmail }}</span>

      <label>Phone Number:</label>
      <span>{{ phoneNumber }}</span>

      <label>Password:</label>
      <span>{{ encodedPassword }}</span>
      <button @click="changePassword">Change Password</button>

      <div class="saved-lists">
        <h3>Saved Lists</h3>
        <!--Display saved lists here.-->
      </div>

      <div class="more-info">
        <h3>More Info</h3>
        <!--Display more account info here.-->
      </div>
    </div>

  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  data() {
    return {
      userEmail: '',
      phoneNumber: '',
      encodedPassword: '******',
      userName: '',
      // Add more account data here
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        this.userEmail = user.attributes.email;
        this.userName = user.attributes.name;
        this.phoneNumber = user.attributes.phone_number;
        // Set encoded password length based on user's actual password length.
        this.encodedPassword = '*'.repeat(user.attributes.password.length);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    },
    changePassword() {
      // Handle this logic later.
    }
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>

<style scoped>
.my-account {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 10px 10px 20px #bebebe,
              -10px -10px 20px #ffffff;
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.account-info label {
  font-weight: bold;
  color: #333;
}

.account-info span, .account-info button {
  background-color: #fff;
  border: none;
  border-radius: 10px;
  box-shadow: inset 5px 5px 10px #bebebe,
              inset -5px -5px 10px #ffffff;
  padding: 10px 15px;
  color: #333;
}

button {
  background-color: #afc6d2;
  color: black;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
}

.saved-lists, .personal-info {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  padding: 20px;
}

h2, h3 {
  color: #333;
}
</style>
