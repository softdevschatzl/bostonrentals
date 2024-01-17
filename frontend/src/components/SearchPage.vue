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
        min_bed: "", // How many beds.
        min_bath: "", // How many baths.
        city_neighborhood: "", // Specific cities/neighborhoods.
        state: 'MA', // State.
        zip: null, // Zip code.
        min_rent: null, // Minimum rent.
        max_rent: null, // Maximum rent.
        avail_from: null, // Available from.
        avail_to: null, // Available to.
        pet: "", // Pet friendly, or not.
        photo: "", // Photos or virtual tours.
        laundry: "", // Laundry in unit.
        parking: "", // Parking available.
        listing_fee: "", // no co-broke
        status: "", // Active, or not.
        square_footage_minimum: "", // Minimum square footage.
        // Add more criteria.
      },
      listings: []
    };
  },
  methods: {
    async searchListings(criteria) {
      try {
        const response = await axios.post('/properties', criteria);
          // params: {
          //   city: this.searchCriteria.cities, 
          //   address: this.searchCriteria.address,
          //   bedrooms: this.searchCriteria.bedrooms,
          //   bathrooms: this.searchCriteria.bathrooms,
          //   minRent: this.minRent,
          //   maxRent: this.maxRent,
          //   sqft: this.sqft,
          //   state: this.searchCriteria.state,
          //   zipCode: this.searchCriteria.zipCode,
          //   availFrom: this.searchCriteria.startDate,
          //   availTo: this.searchCriteria.endDate,
          //   limit: this.searchCriteria.limit,
          // }
        
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
