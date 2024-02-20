<template>
  <div class="my-account" ref="my-account">
    <h1>My Account</h1>
    <div class="account-info">
      <p>Username: {{ username }}</p>
      <p>Email: {{ email }}</p>
      <!-- Add more account information here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "JohnDoe",
      email: "johndoe@example.com",
      // Add more account data here
    };
  },
};
</script>

<style scoped>
.my-account {
  /* Add your styles here */
}

.account-info {
  /* Add your styles here */
}
</style>
