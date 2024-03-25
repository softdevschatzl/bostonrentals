<template>
  <div class="search-section">
    <div class="search-header">
      <h1>Effortless Living Starts Here</h1>
      <p>Let's take the hassle out of finding a home.</p>
    </div>
    <div class="search-bar">
      <div class="input">
        <div class="input-value">
          <VueMultiselect
            class="multiselect"
            v-model="localSearchCriteria.city_neighborhood"
            :options="allNeighborhoods"
            :multiple="true"
            :close-on-select="true"
            placeholder="City/Neighborhood..."
            label="name"
            track-by="name"
            @update:city_neighborhood="updateCityNeighborhood"
          />
        </div>
        <div class="input-value">
          <VueMultiselect
            class="multiselect"
            v-model="localSearchCriteria.beds"
            :options="bedMapping"
            :multiple="true"
            :close-on-select="true"
            placeholder="Beds..."
            label="name"
            track-by="name"
            @update:beds="updateBeds"
          />
        </div>
        <div class="input-value">
          <VueMultiselect
            class="multiselect"
            v-model="localSearchCriteria.baths"
            :options="bathMapping"
            :multiple="true"
            :close-on-select="true"
            placeholder="Baths..."
            label="name"
            track-by="name"
            @update:beds="updateBaths"
          />
        </div>
      </div>
      <button class="search-button" @click="search">Search</button>
    </div>
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect';
import '../../node_modules/vue-multiselect/dist/vue-multiselect.css';
import { allNeighborhoods, bedMapping, bathMapping } from '../utils/dataSets';

export default {
  data() {
    return {
      allNeighborhoods,
      bedMapping,
      bathMapping,
    }; 
  },
  components: {
    VueMultiselect,
  },
  props: {
    searchCriteria: {
      type: Object,
      required: true
    }
  },
  computed: {
    localSearchCriteria: {
      get() {
        return this.searchCriteria;
      },
      set() {
        this.$emit('update-criteria', this.searchCriteria);
      }
    }
  },
  methods: {
    search() {
      const criteriaForApi = this.prepareSearchCriteriaForApi();

      this.$router.push({ name: 'Search', query: { q: criteriaForApi } });
    },
    updateCityNeighborhood(newCityNeighborhood) {
      this.localSearchCriteria.city_neighborhood = newCityNeighborhood;
    },
    updateBeds(newBeds) {
      this.localSearchCriteria.beds = newBeds;
    },
    updateBaths(newBaths) {
      this.localSearchCriteria.baths = newBaths;
    },
    prepareSearchCriteriaForApi() {
      const apiCriteria = { ...this.searchCriteria };

      if (this.allNeighborhoods && apiCriteria.city_neighborhood in this.neighborhoodMapping) {
        apiCriteria.city_neighborhood = this.allNeighborhoods[apiCriteria.city_neighborhood];
      }
      if (this.bedMapping && apiCriteria.beds in this.bedMapping) {
        apiCriteria.beds = this.bedMapping[apiCriteria.beds];
      }
      if (this.bathMapping && apiCriteria.baths in this.bathMapping) {
        apiCriteria.baths = this.bathMapping[apiCriteria.baths];
      }
    }
  }
}
</script>

<style scoped>
  h1 {
    color: #ffffff;
    font-size: 40px;
  }
  p {
    font-size: 28px
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

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: auto;
    width: 100%;
  }
  .multiselect__tags {
    min-height: 0px;
  }
  .input-value {
    width: 20vw;
  }
  .multiselect {
    overflow: hidden;
  }
  
  .search-input {
    padding: 10px;
    width: 100%;
    border-radius: 20px;
    font-size: 24px;
  }
  .search-button {
    width: 25%;
    font-size: 16px;
    background-color: #afc6d2;
    border: 2px solid #fff;
    border-radius: 5px;
    color: #252525;
    transition: .3s ease-in-out;
    padding: 10px;
  }
  .search-button:hover {
    background-color: #788792;
  }
  .search-bar {
    padding-left: 5px;
    padding-right: 5px;
    margin: 50px;
    width: 75%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
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
    .search-input {
      font-size: 18px;
    }
  }
</style>
  