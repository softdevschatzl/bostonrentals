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
        street_name: '', // Street names, No Addresses!!!
        beds: '', // How many beds.
        baths: '', // How many baths.
        city_neighborhood: '', // Specific cities/neighborhoods.
        state: 'MA', // State.
        zip: '', // Zip code.
        limit: 30, // Limits results for bandwidth purposes.
        min_rent: '', // Minimum rent.
        max_rent: '', // Maximum rent.
        avail_from: null, // Available from.
        avail_to: null, // Available to.
        pet: '', // Pet friendly, or not.
        photo: '', // Photos or virtual tours.
        laundry: '',
        parking: '',
        listing_fee: '', // no co-broke
        square_footage_minimum: '',
        // Add more criteria.
      },
      listings: []
    };
  },
  methods: {
    async searchListings() {
      try {
        const response = await axios.post('http://localhost:3000/properties', this.searchCriteria);
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
        
        console.log('API Query: ', this.searchCriteria);
        console.log('API Response: ', response.data.listings);

        this.listings = response.data.listings;
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
