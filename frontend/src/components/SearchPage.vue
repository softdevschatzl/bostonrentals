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

import ImageOne from '@/assets/dummypics/image1.png';
import ImageTwo from '@/assets/dummypics/image2.jpeg';
import ImageThree from '@/assets/dummypics/image3.png';
import ImageFive from '@/assets/dummypics/image5.png';
import ImageSix from '@/assets/dummypics/image6.png';
import ImageSeven from '@/assets/dummypics/image7.png';

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
      listings: 
      [
        {
          id: 1,
          selected: false,
          image: '', // Replace with actual image path
          addressLine1: '123 Apple St',
          city: 'Springfield',
          state: 'IL',
          propertyType: 'Apartment',
          bedrooms: 2,
          bathrooms: 1,
          rent: 1200
        },
        // Repeat the structure for the rest of the listings
        { id: 2, selected: false, image: ImageOne, addressLine1: '456 Banana Ave', city: 'Lincoln', state: 'NE', propertyType: 'Condo', bedrooms: 3, bathrooms: 2, rent: 1500 },
        { id: 3, selected: false, image: ImageTwo, addressLine1: '789 Cherry Blvd', city: 'Madison', state: 'WI', propertyType: 'House', bedrooms: 4, bathrooms: 2.5, rent: 2000 },
        { id: 4, selected: false, image: '', addressLine1: '135 Orange Road', city: 'Austin', state: 'TX', propertyType: 'Townhouse', bedrooms: 3, bathrooms: 2, rent: 1800 },
        // ... additional listings ...
        { id: 20, selected: false, image: ImageThree, addressLine1: '246 Grape St', city: 'Denver', state: 'CO', propertyType: 'Multi-Family', bedrooms: 5, bathrooms: 3, rent: 2500 },
        { id: 21, selected: false, image: '', addressLine1: '789 Pine Rd', city: 'Seattle', state: 'WA', propertyType: 'Apartment', bedrooms: 2, bathrooms: 1, rent: 1300 },
        { id: 22, selected: false, image: '', addressLine1: '321 Maple Ave', city: 'Portland', state: 'OR', propertyType: 'Condo', bedrooms: 3, bathrooms: 2, rent: 1600 },
        { id: 23, selected: false, image: ImageFive, addressLine1: '654 Oak Blvd', city: 'San Francisco', state: 'CA', propertyType: 'House', bedrooms: 3, bathrooms: 2, rent: 3000 },
        { id: 24, selected: false, image: ImageSix, addressLine1: '987 Elm St', city: 'Los Angeles', state: 'CA', propertyType: 'Townhouse', bedrooms: 4, bathrooms: 3, rent: 2800 },
        { id: 25, selected: false, image: ImageSeven, addressLine1: '123 Birch Lane', city: 'San Diego', state: 'CA', propertyType: 'Multi-Family', bedrooms: 5, bathrooms: 3.5, rent: 3500 }
      ]
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
            // minRent: this.minRent,
            // maxRent: this.maxRent,
            // unit: this.unit,
            state: this.searchCriteria.state,
            zipCode: this.searchCriteria.zipCode,
            limit: this.searchCriteria.limit,
            propertyType: this.searchCriteria.propertyType,
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
