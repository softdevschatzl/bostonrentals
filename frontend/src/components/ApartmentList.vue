<template>
  <div class="apartments-section double-color-background">
    <div class="apartments-header">
      <h1>Find Rentals Near {{ location }}</h1>
    </div>
    <div class="apartments-wrapper">
      <ApartmentItem v-for="apartment in apartments" :key="apartment.id" :propertyData="apartment" />
    </div>
  </div>
</template>

<script>
import ApartmentItem from './ApartmentItem.vue';

export default {
  components: {
    ApartmentItem,
  },
  props: {
    apartments: Array,
    location: String,
  },
};
</script>

<style scoped>
  .double-color-background {
    height: 100%;

    background: linear-gradient(to bottom, #050833 15%, #161616 25%, #161616 75%);
  }

  .apartments-section {
    min-height: 70vh;
    width: 100%;
    background-color: #4b4b4b;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .apartments {
    background-color: rgb(255, 255, 255);
    height: 30vh;
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align: center;
  }
  .apartments:hover {
    transition: .3s ease-in-out;
    transform: scale(1.1);
  }
  .apartments-wrapper {
    margin-top: 7vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
  }
  .apartment-image {
    height: 100px;
  }

  .apartments-header {
    margin: 40px;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    top: 0;
  }

  @media only screen and (max-width: 768px) {
    h1 {
      font-size: 25px;
    }
  }
</style>
  