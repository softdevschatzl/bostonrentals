<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from './components/NavBar.vue'
import { sortApartments } from '@/utils/featuredApartmentAlgorithm';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      // TODO: Get API access to turn GeoData Coordinates 
      // into actual locations to feed the RentCastAPI.
      apartments: [
        { id: 23, selected: false, addressLine1: '654 Oak Blvd', city: 'San Francisco', state: 'CA', propertyType: 'House', bedrooms: 3, bathrooms: 2, rent: 3000 },
        { id: 24, selected: false, addressLine1: '987 Elm St', city: 'Los Angeles', state: 'CA', propertyType: 'Townhouse', bedrooms: 4, bathrooms: 3, rent: 2800 },
        { id: 25, selected: false, addressLine1: '123 Birch Lane', city: 'San Diego', state: 'CA', propertyType: 'Multi-Family', bedrooms: 5, bathrooms: 3.5, rent: 3500 }
      ],
      location: 'Alewife, MA',
      userCoords: null,
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
          const response = await axios.get('/api/apartments', {
            params: this.userCoords
          });
          this.apartments = response.data; // Assuming this is an array.
        } catch (error) {
          console.error('Failed to fetch apartments:', error.message);
        }
      }
    },
  },
  computed: {
    sortedApartments() {
      // Returns only sorted apartments to be featured.
      // Ensures userCoords are available, same as above.
      // Also limits featured apartments to three.
      if (this.userCoords && this.apartments.length > 0) {
        return sortApartments(this.apartments, this.userCoords).slice(0, 3);
      } 
      return [];
    }
  }
}
</script>

<style>
  html {
    height: 100%;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background: #050833;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

