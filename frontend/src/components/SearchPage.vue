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
        laundry: '',
        parking: '',
        fee: '', // no co-broke
        // Add more criteria.
      },
      // listings: [
      //   {
      //     id: 1,
      //     selected: false,
      //     address: '123 Maple Street',
      //     neighborhood: 'Seaport',
      //     unit: 'Unit A',
      //     rent: 1200,
      //     bed: '2',
      //     bath: '1.5',
      //   },
      //   {
      //     id: 2,
      //     selected: false,
      //     address: '456 Oak Avenue',
      //     neighborhood: 'Seaport',
      //     unit: 'Unit B',
      //     rent: 1500,
      //     bed: '3',
      //     bath: '2',
      //   },
      //   {
      //     id: 3,
      //     selected: false,
      //     address: '789 Pine Road',
      //     neighborhood: 'Seaport',
      //     unit: 'Unit C',
      //     rent: 1000,
      //     bed: '1',
      //     bath: '1',
      //   },
      // ]
    };
  },
  methods: {
    async searchListings() {
      try {
        const response = await axios.get('http://localhost:3000/properties', {
          params: {
            city: this.citiesNeighborhoods, 
            address: this.address,
            bedrooms: this.beds,
            bathrooms: this.baths,
            minRent: this.minRent,
            maxRent: this.maxRent,
            unit: this.unit,
            state: 'Massachusetts',
            zipCode: this.zipCode,
            limit: 5,
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
    this.searchListings();
  }
};
</script>

<style scoped>

</style>
