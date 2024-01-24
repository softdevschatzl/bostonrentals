<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>

<style>
  html {
    height: 100%;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: #46465e;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

