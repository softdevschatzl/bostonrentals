<!-- SignIn.vue -->

<template>
  <button @click="handleLogin" class="user-sign-in">Login</button>
</template>

<script>
export default {
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
    box-shadow: 5px 5px 10px #050833,
                -5px -5px 10px #305baa;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .user-sign-in:hover {
    opacity: 0.75;
    box-shadow: 2px 2px 5px #111ba8,
                -2px -2px 5px #4787ff;
  }
</style>