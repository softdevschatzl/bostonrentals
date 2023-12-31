<!-- SignIn.vue -->

<template>
  <button @click="handleLogin" class="user-sign-in">Login</button>
</template>

<script>
import { redirectToCognitoUI } from '../../cognito';

export default {
  methods: {
    handleLogin() {
      redirectToCognitoUI();
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
    box-shadow: 5px 5px 10px #1d3563,
                -5px -5px 10px #3d74ec;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .user-sign-in:hover {
    background: #dadada;
    box-shadow: 2px 2px 5px #496644,
                -2px -2px 5px #7dad74;
  }
</style>