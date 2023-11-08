<template>
  <div>
    <NavBar />
    <SearchBar />
    <ApartmentList :apartments="sortedApartments" :location="location" />
    <RentalTools />
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from './components/NavBar.vue'
import ApartmentList from './components/ApartmentList.vue'
import SearchBar from './components/SearchBar.vue'
import RentalTools from './components/RentalTools.vue'
import { sortApartments } from '@/utils/featuredApartmentAlgorithm';

export default {
  components: {
    NavBar,
    SearchBar,
    ApartmentList,
    RentalTools
  },
  data() {
    return {
      // TODO: Get API access to turn GeoData Coordinates 
      // into actual locations to feed the RentCastAPI.
      apartments: [],
      location: '',
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
          this.sortApartments(); // Call the sort method after fetching apartments.
        } catch (error) {
          console.error('Failed to fetch apartments:', error.message);
        }
      }
    },
    sortApartments() {
      // Use the sorting algorithm to sort apartments based on user location and relevant data.
      if (this.userCoords) {
        this.sortedApartments = sortApartments(this.apartments, this.userCoords);
      } else {
        this.sortedApartments = [];
      }
    },
  },
  computed: {
    sortedApartments() {
      // Returns only sorted apartments to be featured.
      // Ensures userCoords are available, same as above.
      // Also limits featured apartments to three.
      if (this.userCoords) {
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
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

