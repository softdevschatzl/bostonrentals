<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <div class="header">
        <button class="contact-btn">Contact Agent</button>
        <h1>Rental Information</h1>
        <button class="close-btn" @click="close">X</button>
        <div class="right"></div>
      </div>
      <div class="table-container">
        <table class="info-table">
          <!-- Header Row -->
          <tr class="info-header">
            <th colspan="2">{{ listing?.streetName }}, {{ listing?.city }}, {{ listing?.state }} {{ listing?.zip }}</th>
          </tr>
          <!-- Property Type -->
          <tr class="info-row" v-if="listing?.propertyType">
            <td>Property Type</td>
            <td>{{ listing?.propertyType }}</td>
          </tr>
          <!-- Beds and Baths -->
          <tr class="info-row">
            <td>Beds</td>
            <td>{{ listing?.beds }}</td>
          </tr>
          <tr class="info-row">
            <td>Baths</td>
            <td>{{ listing?.baths }}</td>
          </tr>
          <!-- Rent and Fee -->
          <tr class="info-row" v-if="listing?.rent || listing?.fee">
            <td>Rent</td>
            <td>{{ listing?.price }}/mo</td>
          </tr>
          <tr class="info-row" v-if="listing?.fee">
            <td>Fee</td>
            <td>{{ fee }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.squareFootage">
            <td>Square Footage</td>
            <td>{{ listing?.squareFootage }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.pet">
            <td>Pets</td>
            <td>{{ listing?.pet }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.laundry">
            <td>Laundry</td>
            <td>{{ listing?.laundry }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.parking || listing?.mlsParking">
            <td>Parking</td>
            <td>{{ parkingInfo }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.status">
            <td>Status</td>
            <td>{{ listing?.status }}</td>
          </tr>
          <!-- Additional Details -->
          <!-- ... Add more rows as needed -->
        </table>
      </div>
      <div class="image-container">
        <h2>Photos: ({{ listing.photos.length }})</h2>
        <Carousel :images="listingImages"/>
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
    },
    parkingInfo() {
      const isValidValue = value => value != null || value != 0 || value != false && !Array.isArray(value);
      if (this.listing.mlsParking) {
        // Handles MLS parking objects.
        return Object.entries(this.listing.mlsParking)
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => ({ key, value }));
      } else if (this.listing.parking) {
        // Handles YGL parking objects.
        return Object.entries(this.listings.parking) 
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => ({ key, value }));
      }
      return [];
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
.right {
  width: 10%;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #46465e;
  width: 85%;
  height: 75%;
  border-radius: 20px;
  box-shadow: 8px 8px 15px #a3a3a3, -8px -8px 15px #ffffff;
  padding: 20px;
  margin-top: 10vh;
}

h1 {
  color: #fff;
  margin-bottom: 20px;
}
h2 {
  color: #fff;
  margin-bottom: 10px;
}
th {
  text-decoration: underline;
}

.info-row {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.listing-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-container {
  width: 100%;
  overflow: auto;
  margin-bottom: 20px;
  border-radius: 5px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  background: #e0e0e0;
  box-shadow: 5px 5px 10px #a3a3a3, -5px -5px 10px #ffffff;
  border-radius: 10px;
}

.info-table th, .info-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.info-header th {
  text-align: center;
  font-size: 1.2em;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: transparent;
  color: #ff0000;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
}

.contact-btn {
  background-color: #e0e0e0;
  color: #333;
  box-shadow: 2px 2px 5px #bebebe, -2px -2px 5px #ffffff;
  border-radius: 15px;
  padding: 10px 15px;
  border: none;
}

.image-container {
  height: 50%;
  width: 80%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 768px) {
  .container {
    width: 100%;
    height: 90%;
    top: 5%;
    border-radius: 0;
  }

  .info-table th, .info-table td {
    padding: 5px;
  }

  .image-container {
    width: 90%;
    height: 50%;
  }
}
</style>
