<template>
  <div class="apartments-section double-color-background">
    <div class="apartments-header">
      <h1>Find Rentals Closest To {{ location }}</h1>
    </div>
    <div class="apartments-wrapper">
      <ApartmentItem 
        v-for="apartment in topThreeApartments" 
        :key="apartment.id" :propertyData="apartment" 
        @click="showApartmentDetails(apartment)" 
      />
    </div>
    <ListingInfo 
      :listing="selectedApartment" 
      :visible="showApartmentInfo" 
      @close="showApartmentInfo = false" 
    />
  </div>
</template>

<script>
import ApartmentItem from './ApartmentItem.vue';
import ListingInfo from './ListingInfo.vue';
// import sortApartments from '@/utils/featuredApartmentAlgorithm';
import { calculateCompletenessScore } from '@/utils/featuredApartmentAlgorithm';

export default {
  components: {
    ApartmentItem,
    ListingInfo,
  },
  data() {
    return {
      selectedApartment: null,
      showApartmentInfo: false,
    };
  },
  props: {
    apartments: Object,
    location: String,
  },
  // Use this until you get featuredApartmentAlgorithm working.
  computed: {
    topThreeApartments() {
      if (this.apartments && this.apartments.listings && this.apartments.listings.length > 0) {
        // Calculate the score of each apartment.
        const scoredApartments = this.apartments.listings.map(apartment => ({
          ...apartment,
          score: calculateCompletenessScore(apartment),
        }));
        // Sort apartments by their scores.
        scoredApartments.sort((a, b) => b.score - a.score);
        // Return top three apartments.
        return scoredApartments.slice(0, 3);
      }
      return [];
    }
  },
  methods: {
    showApartmentDetails(apartment) {
      this.selectedApartment = apartment;
      this.showApartmentInfo = true;
      console.log("Selected apartment: ", this.selectedApartment)
    },
  }
};
</script>

<style scoped>
  .double-color-background {
    height: 100%;

    background: linear-gradient(to bottom, #46465e 15%, #161616 25%, #161616 75%);
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
    text-align: center;
    top: 0;
  }

  @media only screen and (max-width: 768px) {
    h1 {
      font-size: 25px;
    }
    .apartments-wrapper {
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .apartments {
      width: 65%;
    }
  }
</style>
  