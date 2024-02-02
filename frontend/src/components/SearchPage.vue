<!-- SearchPage.vue -->
<template>
  <!-- Search Filters -->
  <SearchFilters :searchCriteria="searchCriteria" @update-criteria="updateCriteria" @search="searchListings"/>
  <!-- Search Results -->
  <SearchResults :listings="listings"/>
</template>
  
<script>
import axios from 'axios';
import SearchFilters from './SearchFilters.vue';
import SearchResults from './SearchResults.vue';

export default {
  components: {
    SearchFilters,
    SearchResults,
  },
  data() {
    return {
      searchCriteria: {
        street_name: null, // Street names, No Addresses!!!
        min_bed: null, // How many beds.
        max_bed: null, // How many beds.
        beds: null, // How many beds.
        min_bath: null, // How many baths.
        max_bath: null, // How many baths.
        baths: null, // How many baths.
        city_neighborhood: null, // Specific cities/neighborhoods.
        state: 'MA', // State.
        zip: null, // Zip code.
        min_rent: null, // Minimum rent.
        max_rent: null, // Maximum rent.
        avail_from: null, // Available from.
        avail_to: null, // Available to.
        pet: null, // Pet friendly, or not.
        photo: null, // Photos or virtual tours.
        laundry: null, // Laundry in unit.
        parking: null, // Parking available.
        listing_fee: null, // no co-broke
        status: null, // Active, or not.
        square_footage_minimum: null, // Minimum square footage.
        tours: null, // Virtual tours, or not.
        // Add more criteria.
      },
      listings: []
    };
  },
  methods: {
    async searchListings(criteria) {
      try {
        const response = await axios.post('/properties', criteria);
        
        console.log('API Query: ', criteria);
        console.log('API Response: ', response.data.listings);

        this.listings = response.data.listings;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
    updateCriteria(newCriteria) {
      this.searchCriteria = { ...newCriteria };
    },
  },
  mounted() {
    // Perform an initial search when the component mounts
    this.searchListings();
  }
};
</script>

<style scoped>

</style>
