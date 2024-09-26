<!-- SearchPage.vue -->
<template>
  <!-- Search Filters -->
  <SearchFilters :searchCriteria="searchCriteria" @update-criteria="updateCriteria" @search="searchListings"/>
  <!-- Search Results -->
  <SearchResults :listings="listings" :loading="loading" />
</template>
  
<script>
import axios from 'axios';
import SearchFilters from './SearchFilters.vue';
import SearchResults from './SearchResults.vue';
import { calculateCompletenessScore } from '@/utils/featuredApartmentAlgorithm';
import { allNeighborhoods } from '../utils/dataSets.js';

export default {
  components: {
    SearchFilters,
    SearchResults,
  },
  data() {

    const queryNeighborhood = this.$route.query.q;
    let cityNeighborhood;

    if (queryNeighborhood) {
      const neighborhoodMatch = allNeighborhoods.find(neighborhood => neighborhood.name === queryNeighborhood);
      cityNeighborhood = neighborhoodMatch ? [neighborhoodMatch] : [];
    } else {
      cityNeighborhood = [];
    }

    return {
      searchCriteria: {
        street_name: null, // Street names, No Addresses!!!
        min_bed: null, // How many beds.
        max_bed: null, // How many beds.
        beds: null, // How many beds.
        min_bath: null, // How many baths.
        max_bath: null, // How many baths.
        baths: null, // How many baths.
        city_neighborhood: cityNeighborhood, // Specific cities/neighborhoods.
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
      listings: [],
      loading: false,
    };
  },
  methods: {
    async searchListings(originalCriteria) {
      try {
        this.loading = true;
        this.listings = [];
        // Clone the original criteria to avoid mutating the original object
        let criteria = { ...originalCriteria };

        // Transform city_neighborhood array into a comma-separated string
        if (criteria.city_neighborhood && criteria.city_neighborhood.length > 0) {
          criteria.city_neighborhood = criteria.city_neighborhood.map(item => item.apiValue).join(',');
        } else {
          criteria.city_neighborhood = null; // Send null if the array is empty
        }

        // Transform beds array into a comma-separated string
        if (criteria.beds && criteria.beds.length > 0) {
          criteria.beds = criteria.beds.map(item => item.apiValue).join(',');
        } else {
          criteria.beds = null; // Send null if the array is empty
        }

        // Tranform baths array into a comma-separated string
        if (criteria.baths && criteria.baths.length > 0) {
          criteria.baths = criteria.baths.map(item => item.apiValue).join(',');
        } else {
          criteria.baths = null; // Send null if the array is empty
        }

        // Transform laundry array into a comma-separated string
        if (criteria.laundry && criteria.laundry.length > 0) {
          criteria.laundry = criteria.laundry.map(item => item.apiValue).join(',');
        } else {
          criteria.laundry = null; // Send null if the array is empty
        }

        // Transform fee array into a comma-separated string
        if (criteria.listing_fee && criteria.listing_fee.length > 0) {
          criteria.listing_fee = criteria.listing_fee.map(item => item.apiValue).join(',');
        } else {
          criteria.listing_fee = null; // Send null if the array is empty
        }

        // Transform pets array into a comma-separated string
        if (criteria.pet && criteria.pet.length > 0) {
          criteria.pet = criteria.pet.map(item => item.apiValue).join(',');
        } else {
          criteria.pet = null; // Send null if the array is empty
        }

        // Transform parking array into a comma-separated string
        if (criteria.parking && criteria.parking.length > 0) {
          criteria.parking = criteria.parking.map(item => item.apiValue).join(',');
        } else {
          criteria.parking = null; // Send null if the array is empty
        }

        // Transform photo array into a comma-separated string
        if (criteria.photo && criteria.photo.length > 0) {
          criteria.photo = criteria.photo.map(item => item.apiValue).join(',');
        } else {
          criteria.photo = null; // Send null if the array is empty
        }

        // Transform tours array into a comma-separated string
        if (criteria.tours && criteria.tours.length > 0) {
          criteria.tours = criteria.tours.map(item => item.apiValue).join(',');
        } else {
          criteria.tours = null; // Send null if the array is empty
        }

        // console.log('API Query: ', criteria);
        // API call with preprocessed criteria
        const response = await axios.post('/api/properties', criteria);

        // Calculate the score of each listing.
        const scoredListings = response.data.listings.map(listing => ({
          ...listing,
          score: calculateCompletenessScore(listing),
        }));

        // Sort listings by their scores.
        scoredListings.sort((a, b) => b.score - a.score);

        // Update your component's listings data with the sorted, scored listings
        this.listings = scoredListings;
        // console.log('Scored Listings:', scoredListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        this.loading = false;
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
