<template>
  <!-- Search Filters -->
  <SearchFilters :searchCriteria="searchCriteria" @search="searchListings"/>
  <!-- Search Results -->
  <SearchResults :listings="listings"/>
</template>
  

<script>
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
          selected: false,
          address: '123 Maple Street',
          neighborhood: 'Seaport',
          unit: 'Unit A',
          rent: 1200,
          bed: '2',
          bath: '1.5',
        },
        {
          id: 2,
          selected: false,
          address: '456 Oak Avenue',
          neighborhood: 'Seaport',
          unit: 'Unit B',
          rent: 1500,
          bed: '3',
          bath: '2',
        },
        {
          id: 3,
          selected: false,
          address: '789 Pine Road',
          neighborhood: 'Seaport',
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

</style>
