<template>
    <div class="search-container">
      <!-- Search Filters -->
      <div class="filters">
        <input type="text" v-model="searchCriteria.streetName" placeholder="Street Name..." />
        <input type="text" v-model="searchCriteria.zipCode" placeholder="Zip Code..." />
        <select v-model="searchCriteria.beds">
          <option value="" disabled selected>Beds</option>
          <option>Studio</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        <select v-model="searchCriteria.baths">
          <option disabled value="">Baths</option>
          <option>1</option>
          <option>1.5</option>
          <option>2</option>
          <option>2.5</option>
          <option>3</option>
          <option>3.5</option>
          <option>4</option>
        </select>
        <button @click="searchListings">Search</button>
      </div>
      
      <!-- Search Results -->
      <div class="listings">
        <div class="listing" v-for="listing in listings" :key="listing.id">
          <h3>{{ listing.address }}</h3>
          <p>Unit: {{ listing.unit }}</p>
          <p>Rent: ${{ listing.rent }}</p>
          <p>Beds: {{ listing.bed }}</p>
          <p>Baths: {{ listing.bath }}</p>
          <p>Available: {{ listing.availDate }}</p>
        </div>
      </div>
    </div>
  </template>
  

<script>
export default {
  data() {
    return {
      searchCriteria: {
        streetName: '',
        // Other criteria
      },
      listings: []
    };
  },
  methods: {
    async searchListings() {
      // Make an API call using the search criteria
      // Update the listings with the response data
    }
  },
  mounted() {
    // Perform an initial search when the component mounts
    this.searchListings();
  }
};
</script>

<style scoped>
select {
  color: #aaa; /* Default color, similar to a placeholder */
}

select option {
  color: black; /* Color for options */
}

select option[value=""][disabled] {
  display: none; /* Hide the placeholder from the dropdown list */
}

select:not(:valid) {
  color: #aaa;
}

select:valid {
  color: black;
}

.search-container {
  background: #ECF0F3; /* Neumorphic background */
  border-radius: 25px;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters input,
.filters select {
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #ECF0F3;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #333;
}

.filters button {
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #ECF0F3;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filters button:hover {
  background: #DFE0E2;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}

.listings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.listing {
  padding: 1rem;
  background: #ECF0F3;
  border-radius: 15px;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  transition: all 0.2s ease;
}

.listing:hover {
  background: #DFE0E2;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
</style>



