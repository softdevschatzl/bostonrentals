<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <div class="header">
        <button class="save">Save to List</button>
        <h1>Rental Information</h1>
        <div class="right"></div>
        <!-- Credits: Cyril Lamotte on Codepen.
        https://codepen.io/cyril-lamotte/pen/bGVxjOr -->
        <button type="button" class="btn-close" @click="close">
          <span class="icon-cross"></span>
          <span class="visually-hidden">Close</span>
        </button>
        <div v-if="isMobile" class="right"></div>
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
          <tr class="info-row" v-if="listing?.features?.length">
            <td class="key">Features</td>
            <td class="value">{{ listing.features.join(', ') }}</td>
          </tr>
          <tr class="info-row" v-if="listing && listing.mlsFeatures && handleFeatures.length">
            <td class="key">Other Features</td>
            <td class="value">
              <ul>
                <div v-for="(featureCategory, index) in handleFeatures" :key="index">
                  <strong style="text-decoration: underline;">{{ featureCategory.category }}</strong>: {{ featureCategory.features }}
                </div>
              </ul>
            </td>
          </tr>
          <tr class="info-row" v-if="listing?.unitDescription">
            <td class="key">Description</td>
            <td class="value">{{ listing?.unitDescription }}</td>
          </tr>
          <tr class="info-row" v-if="listing?.virtualTours?.length">
            <td class="key">Virtual Tours</td>
            <td class="value">
              <a v-for="(tour, index) in listing.virtualTours" 
                :key="index" 
                :href="tour" 
                target="_blank"
                rel="noopener noreferrer">
                Tour {{ index + 1 }}, 
              </a>
            </td>
          </tr>
          <!-- Additional Details -->
          <!-- ... Add more rows as needed -->
        </table>
      </div>
      <div class="image-container">
        <h2>Photos: ({{ listing.photos.length }})</h2>
        <h4>(Click to view photos)</h4>
        <Carousel :images="listingImages" />
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from './ImageCarousel.vue';
import defaultImage from '../assets/no-image-found.jpg';
import { statusMapping, squareFootageMapping, feeResultsMapping, parkingResultsKeyMapping, parkingResultsValueMapping } from '../utils/dataSets';

export default {
  data() {
    return {
      enlarged: false,
    }
  },
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
      } else if (typeof this.listing.fee === 'number' || typeof this.listing.fee === 'string') {
        return feeResultsMapping[this.listing.fee.toString()] || 'Unknown Fee';
      }
      return '1 Month Fee';
    },
    status() {
      return statusMapping[this.listing?.status] || this.listing.status;
    },
    squareFoot() {
      return squareFootageMapping[this.listing?.squareFootage] || this.listing.squareFootage;
    },
    // Handles all parking info objects.
    parkingInfo() {
      const isValidValue = value => value != null && value != 0 && value != false && !Array.isArray(value);
      let parkingData =[];

      const remapKey = key => {
        if (parkingResultsKeyMapping && key in parkingResultsKeyMapping) {
          return parkingResultsKeyMapping[key];
        }
        return key;
      }
      const remapValue = value => {
        if (parkingResultsValueMapping && value in parkingResultsValueMapping) {
          return parkingResultsValueMapping[value];
        }
        return value;
      }

      if (this.listing.mlsParking) {
        // Handles MLS parking objects.
        parkingData = Object.entries(this.listing.mlsParking)
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => `${key}: ${value}`);
      } else if (this.listing.parking) {
        // Handles YGL parking objects.
        parkingData = Object.entries(this.listing.parking) 
                      .filter(([, value]) => isValidValue(value))
                      .map(([key, value]) => `${remapKey(key)}: ${remapValue(value)}`);
      }
      return parkingData.length > 0 ? parkingData.join(', '): "No Parking Covered";
    },
    // Handles mslFeatures object in the listings prop.
    handleFeatures() {
      let featuresList = [];

      const mlsFeatures = this.listing?.mlsFeatures;
      if (mlsFeatures && typeof mlsFeatures === 'object') {
        Object.entries(mlsFeatures).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            featuresList.push({
              category: key,
              features: value.join(', '),
            });
          }
        });
      }

      return featuresList;
    },
    isMobile() {
      return window.innerWidth <= 768;
    }
  },
}
</script>

<style scoped lang="scss">
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
  background-color: rgb(40, 40, 40);
  width: 85%;
  height: 75%;
  border-radius: 20px;
  border: 3px solid white;
  padding: 20px;
  margin-top: 10vh;
}

h1 {
  color: #fff;
  margin-bottom: 20px;
  // margin-left: 10%;
  text-align: center;
}
h2 {
  color: #fff;
}
h4 {
  color: #fff;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
}
th {
  text-decoration: underline;
}

.info-row {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.right {
  width: 10%;
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
  // box-shadow: 5px 5px 10px #a3a3a3, -5px -5px 10px #ffffff;
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

// Display a cross with CSS only.
//
// Cool close button.
//
// Credits: Cyril Lamotte on Codepen.
// https://codepen.io/cyril-lamotte/pen/bGVxjOr
//
// $size  : px or em
// $color : color
// $thickness : px
@mixin cross($size: 20px, $color: currentColor, $thickness: 1px) {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: $size;
  height: $size;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: calc(($size - $thickness) / 2);
    left: 0;
    right: 0;
    height: $thickness;
    background: $color;
    border-radius: $thickness;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }

  span {
    display: block;
  }

}
.btn-close {
  position: absolute;
  top: 3.5px;
  right: 15px;
  margin: 0;
  border: 0;
  padding: 0;
  background: #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 150ms;
  
  .icon-cross {
    @include cross(30px, #afc6d2, 6px);   
  }
  
  &:hover,
  &:focus {
    transform: rotateZ(90deg);
    background: #444444;
  }

}
// For screen readers.
.visually-hidden {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden;
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
.contact-btn:hover, .save:hover {
  opacity: 0.75;
    box-shadow: 2px 2px 5px #3b3b50,
                -2px -2px 5px #5c5c7c;
}

.image-container {
  height: 100%;
  width: 80%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

/* Mobile */
@media only screen and (max-width: 768px) {
  h1 {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
  }
  .container {
    width: 100%;
    height: 75%;
    border-radius: 0;
  }

  .info-table th, .info-table td {
    padding: 5px;
  }

  .image-container {
    width: 90%;
    height: 40%;
  }
  .right {
    width: 15%;
  }
  .table-container {
    height: 40%;
  }
  .btn-close, .save {
    scale: 0.8;
  }
  .save {
    font-size: 12px;
    width: 30%;
  }
}
</style>
