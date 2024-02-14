<!-- SearchFilters.vue  -->
<template>
  <div class="search-container">
    <!-- Search Filters -->
    <div class="filters">
      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
      <div class="top">
        <div class="info-group location-input">
          <button class="toggle-btn" data-group="locationInput" @click="toggleGroup('locationInput')">Location Filters </button>
          <div v-show="openGroups.locationInput" class="location-input-group"> <!-- v-show="openGroups.locationInput" -->
            <input class="value" type="text" v-model="localSearchCriteria.street_name" placeholder="Street Name..." />
            <input class="value" type="text" v-model="localSearchCriteria.zip" placeholder="Zip Code..." />
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.city_neighborhood"
                :options="allNeighborhoods"
                :multiple="true"
                :close-on-select="true"
                placeholder="City/Neighborhood..."
                label="name"
                track-by="name"
                @update:city_neighborhood="updateCityNeighborhood"
              />
          </div>
          </div>
        </div>
        <div class="info-group bed-bath-sqft">
          <button class="toggle-btn" data-group="bedroomsBathrooms" @click="toggleGroup('bedroomsBathrooms')">Bed/Bath/Laundry Filters</button>
          <div v-show="openGroups.bedroomsBathrooms" class="bedrooms-bathrooms-group">
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.beds"
                :options="bedMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Number of Beds..."
                label="name"
                track-by="name"
                @update:beds="updateBeds"
              />
            </div>
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.baths"
                :options="bathMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Number of Baths..."
                label="name"
                track-by="name"
                @update:baths="updateBaths"
              />
            </div>
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.laundry"
                :options="laundryMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Laundry..."
                label="name"
                track-by="name"
                @update:laundry="updateLaundry"
              />
            </div>
          </div>
        </div>
        <div class="info-group min-max-rent">
          <button class="toggle-btn" @click="toggleGroup('minMaxRent')">Min/Max Rent/Fee Filters</button>
          <div v-show="openGroups.minMaxRent" class="min-max-rent-group"> <!-- v-show="openGroups.minMaxRent" -->
            <input class="value" type="text" v-model="localSearchCriteria.min_rent" placeholder="Min Rent..." />
            <input class="value" type="text" v-model="localSearchCriteria.max_rent" placeholder="Max Rent..." />        
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.listing_fee"
                :options="feeMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Fee..."
                label="name"
                track-by="name"
                @update:listing_fee="updateFee"
              />
            </div>
          </div>
        </div>
        <div class="info-group laundry-parking-pet">
          <button class="toggle-btn" @click="toggleGroup('laundryParkingPet')">Min/Max Sqft/Pet Filters</button>
          <div v-show="openGroups.laundryParkingPet" class="laundry-parking-pet-group"> <!-- v-show="openGroups.laundryParkingPet" -->
            <input class="value" type="text" v-model="localSearchCriteria.square_footage_min" placeholder="Minimum Square Feet..." />
            <input class="value" type="text" v-model="localSearchCriteria.square_footage_max" placeholder="Maximum Square Feet..." />
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.pet"
                :options="petMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Pets..."
                label="name"
                track-by="name"
                @update:pet="updatePet"
              />
            </div>
          </div>
        </div>
        <div class="info-group photo-tour-feature">
          <button class="toggle-btn" @click="toggleGroup('propertyStatusMedia')">Parking/Photo/Tours Filters</button>
          <div v-show="openGroups.propertyStatusMedia" class="property-status-media-group">            
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.parking"
                :options="parkingMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Parking..."
                label="name"
                track-by="name"
                @update:parking="updateParking"
              />
            </div>
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.photo"
                :options="photoMapping"
                :multiple="true"
                :close-on-select="true"
                placeholder="Photos..."
                label="name"
                track-by="name"
                @update:photo="updatePhotos"
              />
            </div>
            <div class="multi-container">
              <VueMultiselect
                class="multiselect"
                v-model="localSearchCriteria.tours"
                :options="tourMapping"
                :multiple="false"
                :close-on-select="true"
                placeholder="Tours..."
                label="name"
                track-by="name"
                @update:tours="updateTours"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="info-group">
        <button class="toggle-btn" @click="toggleGroup('availDates')">Available Dates/Features Filters</button>
        <div v-show="openGroups.availDates" class="avail-dates-group"> <!-- v-show="openGroups.availDates" -->
          <div class="avail-dates">
            <Datepicker class="value datepicker" v-model="localSearchCriteria.avail_from" placeholder="From Date"></Datepicker> 
            <Datepicker class="value datepicker" v-model="localSearchCriteria.avail_to" placeholder="To Date"></Datepicker>
          </div>            
          <div class="multi-container">
            <VueMultiselect
              class="multiselect"
              v-model="localSearchCriteria.features"
              :options="features"
              :multiple="true"
              :close-on-select="true"
              placeholder="Features..."
              label="name"
              track-by="name"
              @update:features="updateFeatures"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="search-btn-container">
      <button class="search-btn" @click="searchListings">Search</button>
    </div>
  </div>
</template>

<script>
/**
 * This component is responsible for displaying the search filters.
 * It receives the search criteria from the SearchPage component, and displays them in a form.
 * It also allows the user to update the search criteria, and search for listings.
 * 
 * The search criteria is passed down from the SearchPage component, and is updated in this component.
 * When the user clicks the search button, the search criteria is passed back up to the SearchPage component.
 * The SearchPage component then uses the search criteria to search for listings.
 */
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import downArrow from '@/assets/down-arrow.png';
import { features, laundryMapping, featuresMapping, bathMapping, allNeighborhoods, neighborhoodMapping, feeMapping, bedMapping, photoMapping, parkingMapping, petMapping, tourMapping } from '../utils/dataSets.js';
import VueMultiselect from 'vue-multiselect';
import '../../node_modules/vue-multiselect/dist/vue-multiselect.css';

export default {
  components: {
      Datepicker,
      VueMultiselect,
  },
  props: {
      searchCriteria: {
          type: Object,
          required: true
      }
  },
  computed: {
    localSearchCriteria: {
        get() {
          return this.searchCriteria;
        },
        set() {
          // Sends the event with updated criteria.
          this.$emit('update-criteria', this.searchCriteria);
        },
    },
    apiFormattedNeighborhoods() {
      if (!this.localSearchCriteria.city_neighborhood.length) {
        return null; // Return null if no selection
      }
      return this.localSearchCriteria.city_neighborhood.map(item => item.apiValue.replace('-', ':'));
    }
  },
  methods: {
    // Searches for listings using the search criteria.
    searchListings() {
      if (this.localSearchCriteria.max_rent <= 1500 && this.localSearchCriteria.max_rent !== '' && this.localSearchCriteria.max_rent !== null) {
        window.alert('CAUTION: Many listings you see for under $1500 are either single rooms, or parking spots for rent. We will not assist in the pursuit of these listings. Please pay attention to listing details.');
      }
      const criteriaForApi = this.prepareSearchCriteriaForApi();
      // Sends the event to the parent component.
      console.log("Criteria for API: ", criteriaForApi);
      this.$emit('search', criteriaForApi);
    },
    // Toggles the group with the given name (mobile dropdowns).
    toggleGroup(groupName) {
      this.openGroups[groupName] = !this.openGroups[groupName];
      // Find the button element and update its aria-expanded attribute.
      const button = this.$el.querySelector(`.toggle-btn[data-group="${groupName}"]`);
      if (button) {
        button.setAttribute('aria-expanded', this.openGroups[groupName]);
      }
    },
    formatDate(date) {
      if (!date) return null;
      let d = new Date(date);
      return ((d.getMonth() + 1).toString().padStart(2, '0') + '/' +
              d.getDate().toString().padStart(2, '0') + '/' +
              d.getFullYear());
    },
    // Transforms the search criteria to match the API's format.
    prepareSearchCriteriaForApi() {
      const apiCriteria = { ...this.searchCriteria };
      // Neighborhoods
      if (this.neighborhoodMapping &&apiCriteria.city_neighborhood in this.neighborhoodMapping) {
        apiCriteria.city_neighborhood = this.neighborhoodMapping[apiCriteria.city_neighborhood];
      }
      // Fee
      if (this.feeMapping && apiCriteria.listing_fee in this.feeMapping) {
        apiCriteria.listing_fee = this.feeMapping[apiCriteria.listing_fee];
      }
      // Beds
      if (this.bedMapping && apiCriteria.beds in this.bedMapping) {
        apiCriteria.beds = this.bedMapping[apiCriteria.beds];
      }
      // max_bed
      if (this.bedMapping && apiCriteria.max_bed in this.bedMapping) {
        apiCriteria.max_bed = this.bedMapping[apiCriteria.max_bed];
      }
      // min_bed
      if (this.bedMapping && apiCriteria.min_bed in this.bedMapping) {
        apiCriteria.min_bed = this.bedMapping[apiCriteria.min_bed];
      }
      // Baths
      if (this.bathMapping && apiCriteria.baths in this.bathMapping) {
        apiCriteria.baths = this.bedMapping[apiCriteria.baths];
      }
      // Photos
      if (this.photoMapping && apiCriteria.photo in this.photoMapping) {
        apiCriteria.photo = this.photoMapping[apiCriteria.photo];
      }
      // Parking
      if (this.parkingMapping && apiCriteria.parking in this.parkingMapping) {
        apiCriteria.parking = this.parkingMapping[apiCriteria.parking];
      }
      // Pet
      if (this.petMapping && apiCriteria.pet in this.petMapping) {
        apiCriteria.pet = this.petMapping[apiCriteria.pet];
      }

      if (this.featuresMapping && apiCriteria.features in this.featuresMapping) {
        apiCriteria.features = this.featuresMapping[apiCriteria.features];
      }

      if (this.laundryMapping && apiCriteria.laundry in this.laundryMapping) {
        apiCriteria.laundry = this.laundryMapping[apiCriteria.laundry];
      }

      if (apiCriteria.avail_from) {
        apiCriteria.avail_from = this.formatDate(this.searchCriteria.avail_from);
      }
      if (apiCriteria.avail_to) {
        apiCriteria.avail_to = this.formatDate(this.searchCriteria.avail_to);
      }

      if (Array.isArray(apiCriteria.features)) {
        // Transform the features array into strings separated by commas.
        apiCriteria.features = apiCriteria.features.map(feature => feature.name).join(',')
      }

      // Virtual Tours
      if (apiCriteria.tours === 'Virtual Tours Only') {
        apiCriteria.tours = "Y";
      }

      console.log("API Criteria: ", apiCriteria);

      return apiCriteria;
    },
    // Resets the search criteria to the default values.
    resetFilters() {
      window.location.reload();
    },
    // Helper functions to update localSearchCriteria from 
    // the VueMultiselect component.
    updateFeatures(newFeatures) {
      this.localSearchCriteria.features = newFeatures;
    },
    updateCityNeighborhood(newCityNeighborhood) {
      this.localSearchCriteria.city_neighborhood = newCityNeighborhood;
    },
    updateBeds(newBeds) {
      this.localSearchCriteria.beds = newBeds;
    },
    updateBaths(newBaths) {
      this.localSearchCriteria.baths = newBaths;
    },
    updateLaundry(newLaundry) {
      this.localSearchCriteria.laundry = newLaundry;
    },
    updateFee(newFee) {
      this.localSearchCriteria.listing_fee = newFee;
    },
    updatePet(newPet) {
      this.localSearchCriteria.pet = newPet;
    },
    updateParking(newParking) {
      this.localSearchCriteria.parking = newParking;
    },
    updatePhotos(newPhotos) {
      this.localSearchCriteria.photo = newPhotos;
    },
    updateTours(newTours) {
      this.localSearchCriteria.tours = newTours;
    }
  },
  data() {
    const isMobile = window.innerWidth < 768;
    return {
      downArrow,
      openGroups: { 
        locationInput: !isMobile,
        bedroomsBathrooms: !isMobile,
        minMaxRent: !isMobile,
        propertyStatusMedia: !isMobile,
        laundryParkingPet: !isMobile,
        availDates: !isMobile,
      },
      
      // Importing all the data sets and mappings used for API queries.
      allNeighborhoods,
      neighborhoodMapping,
      feeMapping,
      bedMapping,
      bathMapping,
      photoMapping,
      parkingMapping,
      petMapping,
      featuresMapping,
      laundryMapping,
      features,
      tourMapping,
    };
  },
  mounted() {
    const isMobile = window.innerWidth < 768;
    const defaultState = !isMobile;

    this.openGroups = {
      locationInput: defaultState,
      bedroomsBathrooms: defaultState,
      minMaxRent: defaultState,
      propertyStatusMedia: defaultState,
      laundryParkingPet: defaultState,
      availDates: defaultState,
    };
  },
  watch: {
    localSearchCriteria: {
      deep: true,
      handler(newCriteria) {
        for (const key in newCriteria) {
          if (newCriteria[key] === "null") {
            this.localSearchCriteria[key] = null;
          }
        }
      }
    }
  }
}

</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /** Neumorphic styling */
  background: rgb(40, 40, 40); /* Neumorphic background */
  padding: 2rem;
}

.info-group {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.toggle-btn {
  max-width: 250px;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #696969;
  box-shadow: 5px 5px 10px rgb(31, 31, 31),
              -5px -5px 10px rgb(61, 61, 61);
  font-size: 1rem;
  color: #ebebeb;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 275px;
}
.toggle-btn::after {
  content: '';
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
  border-top: 5px solid #ebebeb; /* Triangle pointing downwards */
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-bottom: none;
  transition: transform 0.3s ease;
}
/* When group is open, rotate the caret to point upwards */
.toggle-btn[aria-expanded="true"]::after {
  transform: rotate(180deg);
}
.toggle-btn::hover {
  background: #93ca88;
  box-shadow: 5px 5px 10px rgb(31, 31, 31),
              -5px -5px 10px rgb(61, 61, 61);

}
.value {
  display: flex;
  align-items: center;
  width: 180px;
  color: #adadad;
}

.filters,
.top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  align-items: center;
}
.filters {
  flex-direction: column;
}

.datepicker {
  width: 215px;
}

.search-btn-container {
  margin-top: 20px;
}

/** Neumorphism styling */

.multi-container {
  width: 215px;
}
.filters input {
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 5px;
  background: #FFF;
  font-size: 1rem;
  font-family: inherit;
}

.multiselect {
  border-radius: 15px;
  width: 100%;
}

.search-btn {
  max-width: 250px;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #afc6d2;
  box-shadow: 5px 5px 10px rgb(31, 31, 31),
              -5px -5px 10px rgb(61, 61, 61);
  font-size: 1rem;
  color: #252525;
  cursor: pointer;
  transition: all 0.2s ease;
}
.search-btn:hover {
  background: #788792;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}

.reset-btn {
  max-width: 250px;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #afc6d2;
  box-shadow: 5px 5px 10px rgb(31, 31, 31),
              -5px -5px 10px rgb(61, 61, 61);
  font-size: 1rem;
  color: #252525;
  cursor: pointer;
  transition: all 0.2s ease;
}
.reset-btn:hover {
  background: #788792;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
/** End neumorphism styling */

/** Multiselect Overrides */
::v-deep .multiselect__tags {
  font-size: 1rem;
  padding: 12px 5px 5px 16px;
}

/** Desktop view */
@media only screen and (min-width: 768px) {
  /* .toggle-btn {
    display: none;
  } */
  .search-container {
    display: flex;
    justify-content: space-evenly;
  }
  .filters input, 
  .filters select {
    max-height: 100px;
  }
  .toggle-btn {
    display: none;
  }
}
</style>