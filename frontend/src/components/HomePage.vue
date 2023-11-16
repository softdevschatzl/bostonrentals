<template>
    <div>
      <SearchBar />
      <ApartmentList :apartments="sortedApartments" :location="location" />
      <RentalTools />
    </div>
  </template>
  
  <script>
  import SearchBar from './SearchBar.vue';
  import ApartmentList from './ApartmentList.vue';
  import RentalTools from './RentalTools.vue';
  
  export default {
    components: {
      SearchBar,
      ApartmentList,
      RentalTools,
    }
  };
  </script>
  