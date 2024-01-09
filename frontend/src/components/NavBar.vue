<!-- NavBar.vue -->

<template>
    <nav>
      <div class="left">
        <div class="hamburger">
          <Hamburger />
        </div>
      </div>
      <div class="title">
        <img class="brand-image" src="../assets/logo-light.png" />
        <div class="desktop-h1">
          <h1>Alexander's Rentals</h1> <!-- This is for desktop. -->
        </div>
        <div class="mobile-h1"> <!-- This is for mobile. -->
          <h1>Alexander's</h1>
          <h1>Rentals</h1>
        </div>
      </div>
      <div class="right">
        <div class="user-sign">
          <SignIn />
        </div>
        <!-- <div class="house-image">
          <button class="new-listing-btn">
            Add A New Listing
          </button>
        </div> -->
      </div>
    </nav>
</template>

<script>
  import Hamburger from './HamburgerMenu.vue'
  import SignIn from './SignIn.vue'

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
      Hamburger,
      SignIn
    }
  }
</script>
  
<style scoped>
  nav {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: #46465e;
    height: 10vh;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  h1 {
    color: #ffffff;
    display: flex;
    justify-content: center;
    /* width: 100%; */
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33%;
    /* gap: 2px; */
  }
  .title h1 {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    padding: 0;
    white-space: pre-wrap;
    text-align: center;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 20px;
  }
  .brand-image {
    transform: scale(0.75);
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 33%;
  }

  .left {
    width: 33%;
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
    width: 100%;
    margin-right: 10px;
    display: flex;
    flex-wrap: nowrap;
    /* margin-left: 18vw; */
  }

  .hamburger {
    display: flex;
    justify-content: center;
    margin-left: 2vw;
  }

  /** iPhone 13 apparently */
@media only screen and (max-width: 400px) {
  .title {
    width: 160px;
    white-space: normal;
    word-break: break-all;
    margin-right: 5vw;
  }
  .title h1 {
    font-size: 16px;
  }
  .right {
    width: 100px;
  }

  .desktop-h1 {
    display: none;
  }

}

/* Mobile */
@media only screen and (max-width: 768px) {
  .desktop-h1 {
    display: none;
  }
  .mobile-h1 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-sign {
    margin-left: 24vw
  }
}
 
/* Desktop styles */
@media only screen and (min-width: 768px) {
  .user-sign {
    margin-left: 35vw;
  }

  .brand-image {
    transform: scale(1);
  }
  .title h1 {
    font-size: 24px;
  }
  .mobile-h1 {
    display: none;
  }
}
/** Larger desktop screens. */
/* @media only screen and (min-width: 1100px) {
  .user-sign {
    margin-left: 30vw;
  }
} */
</style>
  