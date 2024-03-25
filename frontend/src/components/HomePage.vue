<template>
    <div>
      <SearchBar :searchCriteria="searchCriteria"/>
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
        }
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
            console.log("Full coords: ", coords);
            const response = await axios.post('/api/properties', coords);
            console.log("API Response For ApartmentItem: ", response.data);
            this.apartments = response.data; // Assuming this is an array.
          } catch (error) {
            console.error('Failed to fetch apartments:', error.message);
          } finally {
            this.loading = false;
          }
        }
      },
    },
  };
  </script>
  