<!-- NavBar.vue -->

<template>
    <nav>
      <div class="left">
        <div class="hamburger">
          <Hamburger />
        </div>
      </div>
      <div class="title">
          <img class="logo" src="../assets/AlexandersRentals_Logo1-01.png" />
      </div>
      <div class="right">
        <div class="user-sign">
          <SignIn />
        </div>
      </div>
    </nav>
</template>

<script>
  import Hamburger from './HamburgerMenu.vue'
  import SignIn from './SignIn.vue'

  export default {
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
    background-color: black;
    height: 10vh;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  h1 {
    color: #ffffff;
    display: flex;
    justify-content: center;
  }

  .logo {
    width: 75%;
    height: auto;
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33%;
    height: 100%;
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

/* Mobile */
@media only screen and (max-width: 768px) {
  .user-sign {
    margin-left: 24vw
  }
  .logo {
    width: 100%;
  }
}
 
/* Desktop styles */
@media only screen and (min-width: 768px) {
  nav {
    height: 12vh;
  }

  .user-sign {
    margin-left: 35vw;
  }

  .title h1 {
    font-size: 24px;
  }
}

@media only screen and (min-width: 1100px) {
  .logo {
    width: 60%;
  }
}
</style>
  