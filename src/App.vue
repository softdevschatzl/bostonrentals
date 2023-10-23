<template>
  <div>
    <NavBar />
    <SearchBar />
    <ApartmentList :apartments="apartments" />
    <RentalTools />
  </div>
</template>

<script>
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
      apartments: [
      {
        id: 1,
        name: "Luxury Downtown Apartment",
        address: "123 Main St, Cityville",
        bedrooms: 2,
        bathrooms: 2,
        price: 2500,
        sqft: 1200,
        imageUrl: require("@/assets/stockapartmentphoto1.jpg"),
      },
      {
        id: 2,
        name: "Cozy Suburban Flat",
        address: "456 Elm St, Townsburg",
        bedrooms: 1,
        bathrooms: 1,
        price: 1500,
        sqft: 800,
        imageUrl: require("@/assets/stockapartmentphoto2.jpg"),
      },
      ] // Gain apartments.com API information.
    };
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

