<template>
  <div class="apartments-section double-color-background">
    <div class="apartments-header">
      <h1>Find Rentals Closest To {{ location }}</h1>
    </div>
    <!-- Check for loading state first -->
    <div class="search-animation" v-if="loading">
      <SearchingAnimation />
    </div>
    <!-- Then, check if we have apartments to display -->
    <div class="apartments-wrapper" v-else-if="Array.isArray(topThreeApartments) && topThreeApartments.length">
        <ApartmentItem 
          :style="{ animationDelay: `${index * 0.2}s` }"
          class="apartment-item"
          v-for="apartment in topThreeApartments" 
          :key="apartment.id" :propertyData="apartment" 
          @click="showApartmentDetails(apartment)" 
        />
    </div>
    <!-- Finally, show no listings message if not loading and no apartments -->
    <div class="no-listings-container" v-else>
      <div class="no-listings">
        <p>No listings found.</p>
      </div>
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
import SearchingAnimation from './SearchAnimation.vue';
import '../assets/css-animations/animation-sheet.css';

export default {
  components: {
    ApartmentItem,
    ListingInfo,
    SearchingAnimation,
  },
  data() {
    return {
      selectedApartment: null,
      showApartmentInfo: false,
      index: '',
    };
  },
  props: {
    apartments: Object,
    location: String,
    loading: Boolean,
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

    background: linear-gradient(to bottom, black 15%, rgb(20, 20, 20) 25%, rgb(40, 40, 40) 75%);
  }

  .apartments-section {
    min-height: 75vh;
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

  .no-listings-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .no-listings {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 100px;
    background: #afc6d2;
    text-align: center;
    border: 5px solid #7e7e7e;
  }

  .apartment-item {
    animation: slideInFromLeft 1s;
  }
  /** same for children */
  .apartment-item:nth-child(1) {
    animation-delay: 0.4s;
    animation: slideInFromLeft 1.1s;
  }
  .apartment-item:nth-child(2) {
    animation-delay: 0.8s;
    animation: slideInFromLeft 1.2s;
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
    .apartment-item {
      width: 25%;
    }
    .apartments {
      width: 50%;
    }
  }
</style>
