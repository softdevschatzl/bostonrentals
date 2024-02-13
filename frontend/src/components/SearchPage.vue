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
import { calculateCompletenessScore } from '@/utils/featuredApartmentAlgorithm';

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
        features: null, // Laundry in unit.
        parking: null, // Parking available.
        listing_fee: null, // no co-broke
        status: null, // Active, or not.
        square_footage_maximum: null, // Maximum square footage.
        square_footage_minimum: null, // Minimum square footage.
        tours: null, // Virtual tours, or not.
        laundry: null,
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

        // Calculate the score of each listing.
        const scoredListings = response.data.listings.map(listing => ({
          ...listing,
          score: calculateCompletenessScore(listing),
        }));

        // Sort listings by their scores.
        scoredListings.sort((a, b) => b.score - a.score);

        this.listings = scoredListings;
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    },
    updateCriteria(newCriteria) {
      this.searchCriteria = { ...newCriteria };
    },
    resetSearchCriteria() {
      this.searchCriteria = {
        street_name: null,
        min_bed: null,
        max_bed: null,
        beds: null,
        min_bath: null,
        max_bath: null,
        baths: null,
        city_neighborhood: null,
        state: 'MA',
        zip: null,
        min_rent: null,
        max_rent: null,
        avail_from: null,
        avail_to: null,
        pet: null,
        photo: null,
        features: null,
        parking: null,
        listing_fee: null,
        status: null,
        square_footage_minimum: null,
        tours: null,
        laundry: null,
      };
    }
  },
  mounted() {
    // Perform an initial search when the component mounts
    this.searchListings();
  }
};
</script>

<style scoped>

</style>
