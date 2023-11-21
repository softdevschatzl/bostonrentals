<template>
    <div class="search-container">
      <!-- Search Filters -->
      <div class="filters">
        <div class="info-group location-input">
          <input class="value" type="text" v-model="searchCriteria.streetName" placeholder="Street Name..." />
          <input class="value" type="text" v-model="searchCriteria.zipCode" placeholder="Zip Code..." />
          <input class="value" type="text" v-model="searchCriteria.citiesNeighborhoods" placeholder="Cities / Neighborhoods..." />
        </div>
        <div class="info-group values">
          <select v-model="searchCriteria.beds" class="value">
            <option value="" disabled> Select Beds</option>
            <option>Studio</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
          <select v-model="searchCriteria.baths" class="value">
            <option value="" disabled>Select Baths</option>
            <option>1</option>
            <option>1.5</option>
            <option>2</option>
            <option>2.5</option>
            <option>3</option>
            <option>3.5</option>
            <option>4</option>
          </select>
          <input class="value" type="text" v-model="searchCriteria.unit" placeholder="Unit" />
        </div>
        <div class="info-group">
          <div class="avail-dates">
            <Datepicker class="value" v-model="searchCriteria.startDate" placeholder="Start Date"></Datepicker> 
            <Datepicker class="value" v-model="searchCriteria.endDate" placeholder="End Date"></Datepicker>
          </div>
          <div class="min-max-rent">
            <input type="text" v-model="searchCriteria.minRent" placeholder="Min Rent" />
            <input type="text" v-model="searchCriteria.maxRent" placeholder="Max Rent" />
          </div>
        </div>
      </div>
      <div class="search-btn-container">
        <button class="search-btn" @click="searchListings">Search</button>
      </div>
    </div>
      <!-- Search Results -->
    <div class="listings">
      <div class="listing" v-for="listing in listings" :key="listing.id">
        <h3>{{ listing.address }}</h3>
        <p>Unit: {{ listing.unit }}</p>
        <p>Rent: ${{ listing.rent }}</p>
        <p>Beds: {{ listing.bed }}</p>
        <p>Baths: {{ listing.bath }}</p>
      </div>
    </div>
  </template>
  

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      searchCriteria: {
        streetName: '', // Street names, No Addresses!!!
        beds: '', // How many beds.
        baths: '', // How many baths.
        citiesNeighborhoods: '', // Specific cities/neighborhoods.
        minRent: '', // Minimum rent.
        maxRent: '', // Maximum rent.
        unit: '', // Not sure what this means ngl.
        startDate: null, // Available from.
        endDate: null, // Available to.
        pet: '', // Pet friendly, or not.
        status: '', // Whether it's on market or not.
        media: '', // Photos or virtual tours.
        // Add more criteria.
      },
      listings: [
        {
          id: 1,
          address: '123 Maple Street',
          unit: 'Unit A',
          rent: 1200,
          bed: '2',
          bath: '1.5',
        },
        {
          id: 2,
          address: '456 Oak Avenue',
          unit: 'Unit B',
          rent: 1500,
          bed: '3',
          bath: '2',
        },
        {
          id: 3,
          address: '789 Pine Road',
          unit: 'Unit C',
          rent: 1000,
          bed: '1',
          bath: '1',
        },
      ]
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

.info-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  margin: 0 15px 0 15px;
  width: 180px;
  height: 200px;
}

.search-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  background: #ECF0F3; /* Neumorphic background */
  border-radius: 25px;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  padding: 2rem;
  max-width: 1000px;
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

.min-max-rent {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.search-btn {
  max-width: 250px;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #668d5e;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #ebebeb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: #93ca88;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
.search-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.listings {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.listing {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 1rem;
  background: #ECF0F3;
  border-radius: 15px;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  transition: all 0.2s ease;
  max-width: 350px;
  min-width: 200px;
}

.listing:hover {
  background: #DFE0E2;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
</style>



