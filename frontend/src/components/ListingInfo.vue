<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <div class="header">
        <button class="contact-btn">Contact Agent</button>
        <h1>Rental Information</h1>
        <button class="save">Save to List</button>
        <button class="close-btn" @click="close">X</button>
      </div>
      <div class="table-container">
        <table class="info-table">
          <!-- Header Row -->
          <tr class="info-header">
            <th colspan="2">{{ listing?.streetName }}, {{ listing?.city }}, {{ listing?.state }} {{ listing?.zip }}</th>
          </tr>
          <!-- Property Type -->
          <tr class="info-row" v-if="listing?.propertyType">
            <td class="key">Property Type</td>
            <td class="value">{{ listing?.propertyType }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.availableDate">
            <td class="key">Date Available</td>
            <td class="value">{{ listing?.availableDate }}</td>
          </tr>
          <!-- Beds and Baths -->
          <tr class="info-row">
            <td class="key">Beds</td>
            <td class="value">{{ listing?.beds }}</td>
          </tr>
          <tr class="info-row">
            <td class="key">Baths</td>
            <td class="value">{{ listing?.baths }}</td>
          </tr>
          <!-- Rent and Fee -->
          <tr class="info-row" v-if="listing?.rent || listing?.fee">
            <td class="key">Rent</td>
            <td class="value">${{ listing?.price }}/mo</td>
          </tr>
          <tr class="info-row" v-if="listing?.fee">
            <td class="key">Fee</td>
            <td class="value">{{ fee }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.squareFootage">
            <td class="key">Square Footage</td>
            <td class="value">{{ squareFoot }} sqft</td>
          </tr>
          <tr class="info-row" v-if="listing?.pet">
            <td class="key">Pets</td>
            <td class="value">{{ listing?.pet }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.laundry">
            <td class="key">Laundry</td>
            <td class="value">{{ listing?.laundry }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.parking || listing?.mlsParking">
            <td class="key">Parking</td>
            <td class="value">{{ parkingInfo }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.status">
            <td class="key">Status</td>
            <td class="value">{{ status }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.rentIncludes?.length">
            <td class="key">Rent Includes</td>
            <td class="value">{{ listing.rentIncludes.join(', ') }}</td>
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
import { statusMapping, squareFootageMapping } from '../utils/dataSets';

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
    status() {
      return statusMapping[this.listing?.status] || this.listing.status;
    },
    squareFoot() {
      return squareFootageMapping[this.listing?.squareFootage] || this.listing.squareFootage;
    },
    parkingInfo() {
      const isValidValue = value => value != null && value != 0 && value != false && !Array.isArray(value);
      let parkingData =[];
      if (this.listing.mlsParking) {
        // Handles MLS parking objects.
        parkingData = Object.entries(this.listing.mlsParking)
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => `${key}: ${value}`);
      } else if (this.listing.parking) {
        // Handles YGL parking objects.
        parkingData = Object.entries(this.listing.parking) 
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => `${key}: ${value}`);
      }
      return parkingData.length > 0 ? parkingData.join(', '): "No Parking Covered";
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
  position: relative;
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
  order: 2;
  color: #fff;
  margin-bottom: 20px;
  margin-left: 10%;
  text-align: center;
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
  padding: 5px;
  width: 100%;
  border-collapse: collapse;
  background: #e0e0e0;
  box-shadow: 5px 5px 10px #a3a3a3, -5px -5px 10px #ffffff;
}

.info-table th, .info-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #9b9b9b;
}

.info-header th {
  text-align: center;
  font-size: 1.2em;
}

.key {
  font-weight: bold;
  width: auto;
  border-right: 1px solid #9b9b9b;
}
.value {
  color: #333;
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

.contact-btn, .save {
  background-color: #e0e0e0;
  color: #333;
  box-shadow: 3px 3px 10px #313142,
                -3px -3px 10px #727299;
  border-radius: 15px;
  padding: 10px 15px;
  border: none;
}
.save {
  order: 3;
  margin-right: 10%;
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
