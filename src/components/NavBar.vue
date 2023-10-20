<template>
    <nav>
      <div class="left">
        <div class="hamburger">
          <Hamburger />
        </div>
      </div>
      <div class="title">
        <img src="../assets/logo.png" />
        <h1>Boston Rentals</h1>
      </div>
      <div class="right">
        <div class="user-sign">
          <a class="user-sign-in" @click="signIn">Sign In</a>
          <span> / </span>
          <a class="user-sign-in" @click="signUp">Sign Up</a>
        </div>
        <div class="house-image">
          <button class="new-listing-btn">
            Add A New Listing
          </button>
        </div>
      </div>
    </nav>
</template>

<script>
  import Hamburger from './HamburgerMenu.vue'
  // import HomeImage from '../assets/icons8-house-100.png'

  export default {
    methods: {
      signUp() {
        // Implement sign-up functionality.
      },
      signIn() {
        // Implement sign-in functionality.
      }
    },
    components: {
      Hamburger
    }
  }
</script>
  
  <style scoped>
    nav {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: #668d5e;
        height: 10vh;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    h1 {
        color: #ffffff;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .title {
      display: flex;
      justify-content: space-between;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 75vw;
    }

    .left {
      width: 70vw;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      /* margin-left: 40px; */
    }

    .user-sign {
      color: #ffffff;
      width: 25%;
      display: flex;
      justify-content: space-evenly;
    }
    .user-sign-in:hover {
      color: #adadad;
      transition: .3s ease-in-out;
    }

    .hamburger {
      display: flex;
      justify-content: center;
      margin-left: 2vw;
    }

    .new-listing-btn {
      background-color: #adadad;
      padding: 15px;
      border: none;
      height: 100%;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin-right: -20vw;
      margin-left: 3vw;
    }
    .new-listing-btn:hover {
      background-color: #8b8b8b;
      transition: .2s ease-in-out;
      text-decoration: underline;
    }
  </style>
  