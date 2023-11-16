<template>
    <nav>
      <div class="left">
        <div class="hamburger">
          <Hamburger />
        </div>
      </div>
      <div class="title">
        <img src="../assets/logo.png" />
        <h1>Boston<br>Rentals</h1>
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
      justify-content: space-between;
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
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
  .title h1 {
    display: flex;
    flex-direction: column;
    margin: 0;
    white-space: pre-wrap;
    text-align: center;
    word-break: break-all;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 50%;
  }

  .left {
    width: 70vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* margin-left: 40px; */
  }
  .left, .right {
    flex: 1;
  }

  .user-sign {
    color: #ffffff;
    width: 25%;
    display: flex;
    gap: 1vw;
    flex-wrap: nowrap;
  }
  .user-sign-in {
    padding: 0;
    margin-left: 5px;
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

  /* .new-listing-btn {
    background-color: #adadad;
    padding: 15px;
    border: none;
    width: 12vw;
    height: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin-right: -20vw;
    margin-left: 3vw;
  }
  .new-listing-btn:hover {
    background-color: #8b8b8b;
    transition: .2s ease-in-out;
    text-decoration: underline;
  } */

  .new-listing-btn {
    display: flex;
    align-items: flex-end;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    margin: 0.2rem;
    border-radius: 15px;
    background: #ECF0F3;
    box-shadow: 5px 5px 10px #496644,
                -5px -5px 10px #7dad74;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    /* Background-color: #668d5e */
  }

  .new-listing-btn:hover {
    background: #dadada;
    box-shadow: 2px 2px 5px #496644,
                -2px -2px 5px #7dad74;
  }
</style>
  