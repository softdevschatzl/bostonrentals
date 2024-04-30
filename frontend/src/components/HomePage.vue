<template>
    <div>
      <SearchBar :isLoggedIn="isLoggedIn"/>
      <ApartmentList :apartments="apartments" :location="location" :loading="loading" />
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
        loading: false,
        isLoggedIn: false,
        inactivityTimer: null,
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
          this.loading = true;
          try {
            const coords = calculateFullCoordinates(this.userCoords.latitude, this.userCoords.longitude);
            // console.log("Full coords: ", coords);
            const response = await axios.post('/api/properties', coords);
            // console.log("API Response For ApartmentItem: ", response.data);
            this.apartments = response.data; // Assuming this is an array.
          } catch (error) {
            console.error('Failed to fetch apartments:', error.message);
          } finally {
            this.loading = false;
          }
        }
      },

      //Login methods.
      resetInactivityTimer() {
        clearTimeout(this.inactivityTimer);
        if (this.isLoggedIn) {
          this.inactivityTimer = setTimeout(() => {
            this.redirectToCognitoUI();
          }, 600000);
        }
      },
      handleInactivity() {
        this.redirectToCognitoUI();
      },
      async redirectToCognitoUI() {
        try {
          const response = await fetch('/api/login');
          if (response.ok) {
            const data = await response.json();
            window.location.href = data.url;
          } else {
            console.error('Login failed.');
          }
        } catch (error) {
          console.error('Login failed:', error.message);
        }
      },
      async checkIfLoggedIn() {
        try {
          const response = await fetch('/api/user', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
          }
        } catch (error) {
          console.error('Error checking if logged in:', error);
        }
      },
    },
  };
  </script>
  