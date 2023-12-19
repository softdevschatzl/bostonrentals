<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import signIn from '../cognito';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const session = await signIn(this.username, this.password);
        // handles successful login, redirects/stores session.
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
}
</script>

<style scoped>
</style>