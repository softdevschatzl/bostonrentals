<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <h1>Rental Information</h1>
      <button class="close-btn" @click="close">X</button>
      <!-- Content of the listing info -->
      <div class="info-content">
        <div class="info-content-header">
          <button class="contact-btn">Contact Alex</button>
          <h2>{{ listing?.streetName }}</h2>
          <span>-</span>
          <p>{{ listing?.city }}, {{ listing?.state }}, {{ listing?.zipCode }}</p>
          <!-- Add more fields as needed -->
        </div>
        <p class="property-type" v-if="listing?.propertyType">{{ listing?.propertyType }}</p>
        <!-- Display listing details here -->
        <div class="image-container">
          <Carousel :images="listingImages"/>
        </div>
        <div class="info-container">
          <div class="info-container-1">
            <div class="info-container-2">
              <h2>Beds</h2>
              <p>{{ listing?.beds }}</p>
            </div>
            <div class="info-container-2">
              <h2>Baths</h2>
              <p>{{ listing?.baths }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.rent || listing?.fee">
            <div class="info-container-2">
              <h2>Rent</h2>
              <p>{{ listing?.price }}</p>
            </div>
            <div class="info-container-2">
              <h2>Fee</h2>
              <p>{{ fee }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.pet">
            <div class="info-container-2">
              <h2>Pet</h2>
              <p>{{ listing?.pet }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.laundry || listing?.parking">
            <div class="info-container-2">
                <h2>Laundry</h2>
                <p>{{ listing?.laundry }}</p>
            </div>
            <div class="info-container-2">
                <h2>Parking</h2>
                <p v-if="listing?.parking?.parkingAvailability">{{ listing?.parking.parkingAvailability }}</p>
                <p v-if="listing?.parking?.parkingNumber">No.{{ listing?.parking.parkingNumber }}</p>
                <p v-if="listing?.parking?.parkingPrice">Price: {{ listing?.parking.parkingPrice }}</p>
                <p v-if="listing?.parking?.parkingType">Type: {{ listing?.parking.parkingType }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from './ImageCarousel.vue';
import defaultImage from '../assets/no-image-found.jpg';

export default {
  components: {
    Carousel,
  },
  props: {
    listing: Object,
    visible: Boolean
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
  computed: {
    listingImages() {
      return this.listing.photos || defaultImage;
    },
    fee() { // FIX ME: i always return N/A.
      if (this.listing.fee && typeof this.listing.fee === 'object' && this.listing.fee['Cooperative Compentation']) {
        return '1 Month Fee';
      } else if (typeof this.listing.fee === 'number') {
        return this.feeMapping[this.listing.fee.toString()] || 'Unknown Fee';
      }
      return 'N/A';
    }
  },
  data() {
  return {
    feeMapping: {
      '0': '1 Month Fee', 
      '0.25': '75% Month Fee',
      '0.5': '50% Month Fee',
      '0.75': '25% Month Fee',
      '1': 'No Fee',
    }
  };
},
}
</script>

<style scoped>
h1 {
  color: #ffffff;
  margin-bottom: 15px;
}
h2 {
  font-size: 18px;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: #46465e;
  width: 85%;
  height: 75%;
  border-radius: 20px;
  box-shadow: 10px 10px 20px #bebebe,
              -10px -10px 20px #ffffff;
}
.listing-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #cecece;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: 80%;
  gap: 20px;
  box-shadow: inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff; /* Inset shadows for depth */
}
.info-content-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.info-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
}
.info-container-1 {
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 25px;
  width: auto;
  background: #b1b1b1;
  padding: 10px;
}
.info-container-2 {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: auto;
  padding: 5px;
  border: 1px solid black;
}
.info-container-2 h2 {
  text-decoration: underline;
}
.info-container-2 {
  box-shadow: 2px 2px 5px #bebebe, -2px -2px 5px #ffffff;
  border-radius: 10px;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  color: #ff0000;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
}
.contact-btn {
  background-color: #e0e0e0;
  color: #333;
  box-shadow: 2px 2px 5px #bebebe, -2px -2px 5px #ffffff; /* Consistent button style */
  border-radius: 15px;
  padding: 10px 15px;
  border: none;
}

.image-container {
  height: 35vh;
  width: 50vw;
}

/* Mobile */
@media only screen and (max-width: 768px) {
  h1 {
    font-size: 20px;
  }
  h2 {
    text-align: center;
    font-size: 14px;
  }
  .container {
    width: 100%;
    height: 90%;
    top: 5%;
    border-radius: 0;
  }

  .image-container {
    width: 90%;
    height: 50%;
  }
}
</style>
