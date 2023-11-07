<template>
  <div>
    <NavBar />
    <SearchBar />
    <ApartmentList :apartments="apartments" />
    <RentalTools />
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from './components/NavBar.vue'
import ApartmentList from './components/ApartmentList.vue'
import SearchBar from './components/SearchBar.vue'
import RentalTools from './components/RentalTools.vue'

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
      location: ''
    };
  },
  // Retrieving location from IP to show relevant listings on start.
  async mounted() {
    try {
      const response = await axios.get('/api/location');
      const locationData = response.data;
      this.location = `${locationData.city}, ${locationData.region}`;

      await this.fetchApartmentNearLocation(locationData.lat, locationData.lon);
    } catch (error) {
      console.error("Failed to fetch user location:", error.message);
    }
  },
  methods: {
    async fetchApartmentNearLocation(lat, lon) {
      try {
        const response = await axios.get('/api/apartments', {
          params: {
            latitude: lat,
            longitude: lon
          }
        });
        console.log("App.vue Coordinates: ", lat, lon);
        this.apartments = response.data; // I dont know what the API would return. Guessing it's an array.
      } catch (error) {
        console.error('Failed to fetch apartments.', error.message);
      }
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

