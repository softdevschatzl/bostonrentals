<template>
  <div class="container">
    <h1>Cookie Policy</h1>
    <p>
      This website uses cookies to ensure you get the best experience on our website.
    </p>
    <p>
      By continuing to use this site, you consent to the use of cookies in accordance with our
      <a href="/privacy-policy">Privacy Policy</a>.
    </p>
  </div>
</template>

<script>
export default {
  name: "CookiePolicyPage",
};
</script>

<style scoped>
  h1 {
    margin-bottom: 5vh;
    text-decoration: underline;
  }
  p {
    margin-bottom: 3vh;
  }
  h2, h3 {
    margin-bottom: 2vh;
  }
  ul {
    margin-bottom: 2vh;
  }
  .container {
    border: 3px solid black;
    padding: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
