<template>
  <div class="search-section">
    <div class="search-header">
      <h1>Effortless Living Starts Here</h1>
      <p>Let's take the hassle out of finding a home.</p>
    </div>
    <div class="search-bar">
      <div class="search-bar-input">
        <input class="search-input" type="text" placeholder="Search for cities/neighborhoods..." v-model="query" @input="validateNeighborhood" />
        <button class="search-button" @click="search">Search</button>
      </div>
      <p class="error-message" v-if="queryError">{{ queryError }}</p>
    </div>
  </div>
</template>

<script>
import { allNeighborhoods } from '@/utils/dataSets.js';


export default {
  data() {
    return {
      query: '',
      queryError: '',
    };
  },
  methods: {
    validateNeighborhood() {
      if (this.query) {
        if (/^[a-zA-Z\s]+$/.test(this.query)) {
          this.queryError = '';
        } else {
          this.queryError = 'Please enter a valid neighborhood.';
        }
      }
    },
    search() {
      this.validateNeighborhood();
      if (this.queryError) return;

      const lowerCaseQuery = this.query.trim().toLowerCase();

      // console.log('Lowercase Query:', lowerCaseQuery);

      // const lowerCaseNeighborhoods = allNeighborhoods.map(neighborhood => neighborhood.name);
      // console.log('Lowercase Neighborhoods:', lowerCaseNeighborhoods);

      const neighborhoodMatch = allNeighborhoods.find(neighborhood =>  neighborhood.name.toLowerCase().includes(lowerCaseQuery));

      if (neighborhoodMatch) {
        const apiQuery = neighborhoodMatch.name;
        this.$router.push({ name: 'Search', query: { q: apiQuery } });
      } else {
        this.queryError = 'City or Neighborhood not found.';
        console.error('Neighborhood not found.');
      }
    }
  }
}
</script>

<style scoped>
  h1 {
    color: #ffffff;
    font-size: 3rem;
  }
  p {
    font-size: 1.8rem;
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
    flex-direction: column;
  }

  .search-bar-input {
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

  .error-message {
    color: red;
    font-size: 1.4rem;
    margin: 0.2rem 0;
  }

  /* Mobile */
  @media only screen and (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
    }
    p {
      font-size: 1.5rem;
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
  