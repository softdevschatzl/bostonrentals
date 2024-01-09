<template>
  <div class="search-section">
    <div class="search-header">
      <h1>Effortless Living Starts Here</h1>
      <p>Let us help you find your dream home.</p>
    </div>
    <div class="search-bar">
      <input class="search-input" type="text" placeholder="Search for rentals..." v-model="query" />
      <button class="search-button" @click="search">Search</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    search() {
      // Apparently I need to use a router to switch to a new page.
      if (this.query.trim()) {
        this.$router.push({ name: 'Search', query: { q: this.query } });
      }
    }
  }
}
</script>

<style scoped>
  h1 {
    color: #ffffff;
  }
  .search-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 70vh;
  }
  .search-section::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;  /* This ensures the pseudo-element is behind the content of .search-section */
    
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url('../assets/boston-skyline-night.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    /* filter: blur(2px) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25)); */
  }
  
  .search-input {
    padding: 10px;
    width: 50vw;
    border-radius: 20px;
    font-size: 24px;
  }
  .search-button {
    border-radius: 20px;
    width: 25%;
    font-size: 20px;
    background-color: #afc6d2;
    color: #252525;
    transition: .3s ease-in-out;
  }
  .search-button:hover {
    background-color: #788792;
  }
  .search-bar {
    margin: 50px;
    display: flex;
  }

  .search-header {
    margin: 50px;
    font-size: 2rem;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Mobile */
  @media only screen and (max-width: 768px) {
    .search-header {
      font-size: 1.2rem;
    }
    .search-button {
      padding: 10px;
      border: none;
      font-size: 16px;
    }
    .search-input {
      font-size: 18px;
    }
  }
</style>
  