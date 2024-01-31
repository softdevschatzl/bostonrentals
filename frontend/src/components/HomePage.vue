<template>
    <div>
      <SearchBar />
      <ApartmentList :apartments="apartments" :location="location" />
      <RentalTools />
      <FooterPage />
    </div>
  </template>
  
  <script>
  import SearchBar from './SearchBar.vue';
  import ApartmentList from './ApartmentList.vue';
  import RentalTools from './RentalTools.vue';
  import FooterPage from './FooterPage.vue';
  import axios from 'axios';
  import { calculateFullCoordinates } from '@/utils/featuredApartmentAlgorithm';
  
  export default {
    components: {
      SearchBar,
      ApartmentList,
      RentalTools,
      FooterPage,
    },
    data() {
      return {
        apartments: {},
        location: '',
        userCoords: { latitude: null, longitude: null },
      };
    },
    async mounted() {
      await this.fetchUserLocation();
    },
    methods: {
      // Retrieving location from IP to show relevant listings on start.
      async fetchUserLocation() {
        try {
          const response = await axios.get('/api/location');
          this.userCoords = { latitude: response.data.lat, longitude: response.data.lon };
          this.location = `${response.data.city}, ${response.data.region}`;
          await this.fetchApartments();
        } catch (error) {
          console.error("Failed to fetch user location:", error.message);
        }
      },

      // Using user location to fetch nearby relevant properties.
      async fetchApartments() {
        if (this.userCoords) {
          try {
            const coords = calculateFullCoordinates(this.userCoords.latitude, this.userCoords.longitude, 20);
            console.log("Full coords: ", coords);
            const response = await axios.post('/properties', coords);
            this.apartments = response.data; // Assuming this is an array.
          } catch (error) {
            console.error('Failed to fetch apartments:', error.message);
          }
        }
      },
    },
    // computed: {
    //   sortedApartments() {
    //     // Returns only sorted apartments to be featured.
    //     // Ensures userCoords are available, same as above.
    //     // Also limits featured apartments to three.
    //     if (this.userCoords && this.apartments.length > 0) {
    //       return sortApartments(this.apartments, this.userCoords).slice(0, 3);
    //     } 
    //     return [];
    //   }
    // }
  };
  </script>
  