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
        selected: false,
        address: '', // Street names, No Addresses!!!
        bedrooms: '', // How many beds.
        bathrooms: '', // How many baths.
        cities: '', // Specific cities/neighborhoods.
        state: 'MA', // State.
        zipCode: '', // Zip code.
        propertyType: '',
        limit: 20, // Apartment, condo, house, etc.
        minRent: '', // Minimum rent.
        maxRent: '', // Maximum rent.
        unit: '', // Not sure what this means ngl.
        startDate: null, // Available from.
        endDate: null, // Available to.
        pet: '', // Pet friendly, or not.
        status: '', // Whether it's on market or not.
        media: '', // Photos or virtual tours.
        laundry: '',
        parking: '',
        fee: '', // no co-broke
        // Add more criteria.
      },
      listings: []
    };
  },
  methods: {
    async searchListings() {
      try {
        const response = await axios.get('http://localhost:3000/properties', {
          params: {
            city: this.searchCriteria.cities, 
            address: this.searchCriteria.address,
            bedrooms: this.searchCriteria.bedrooms,
            bathrooms: this.searchCriteria.bathrooms,
            minRent: this.minRent,
            maxRent: this.maxRent,
            sqft: this.sqft,
            state: this.searchCriteria.state,
            zipCode: this.searchCriteria.zipCode,
            availFrom: this.searchCriteria.startDate,
            availTo: this.searchCriteria.endDate,
            limit: this.searchCriteria.limit,
          }
        });
        console.log('API Response: ', response.data);

        this.listings = response.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
    updateCriteria(newCriteria) {
      this.searchCriteria = newCriteria;
    },
  },
  mounted() {
    // Perform an initial search when the component mounts
    // this.searchListings();
  }
};
</script>

<style scoped>

</style>
