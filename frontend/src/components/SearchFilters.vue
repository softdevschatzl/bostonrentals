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
            <select class="value" v-model="localSearchCriteria.city_neighborhood">
              <option value="null" selected><strong>City/Neighborhood</strong></option>
              <optgroup v-for="(group, letter) in groupedNeighborhoods" :label="letter" :key="letter">
                <option v-for="neighborhood in group" :key="neighborhood" :value="neighborhood">{{ neighborhood }}</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div class="info-group">
          <button class="toggle-btn" data-group="bedroomsBathrooms" @click="toggleGroup('bedroomsBathrooms')">Bedrooms/Bathrooms Filters</button>
          <div v-show="openGroups.bedroomsBathrooms" class="bedrooms-bathrooms-group">
            <select class="value" v-model="localSearchCriteria.beds">
              <option value="null" selected>Number of Beds...</option>
              <option>Studio</option>
              <option>1</option>
              <option>1.5</option>
              <option>1 split</option>
              <option>2</option>
              <option>2.5</option>
              <option>2 split</option>
              <option>3</option>
              <option>3.5</option>
              <option>3 split</option>
              <option>4</option>
              <option>4.5</option>
              <option>4 split</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10+</option>
            </select>
            <select class="value" v-model="localSearchCriteria.baths">
              <option value="null" selected>Number of Baths...</option>
              <option>1</option>
              <option>1.5</option>
              <option>2</option>
              <option>2.5</option>
              <option>3</option>
              <option>3.5</option>
              <option>4</option>
              <option>4.5</option>
              <option>5</option>
              <option>5.5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10+</option>
            </select>
            <input class="value" type="text" v-model="localSearchCriteria.sqft" placeholder="Minimum Square Feet..." />
          </div>
        </div>
        <div class="info-group min-max-rent">
          <button class="toggle-btn" @click="toggleGroup('minMaxRent')">Min/Max Rent Filters</button>
          <div v-show="openGroups.minMaxRent" class="min-max-rent-group"> <!-- v-show="openGroups.minMaxRent" -->
            <input class="value" type="text" v-model="localSearchCriteria.min_rent" placeholder="Min Rent..." />
            <input class="value" type="text" v-model="localSearchCriteria.max_rent" placeholder="Max Rent..." />
            <select class="value" v-model="localSearchCriteria.listing_fee">
              <option value="null" selected>Fee...</option>
              <option>No Fee</option>
              <option>25% Month Fee</option> 
              <option>50% Off Month Fee</option>
              <option>75% Month Fee</option>
              <option>1 Month Fee</option>
            </select>
          </div>
        </div>
        <div class="info-group">
          <button class="toggle-btn" @click="toggleGroup('laundryParkingPet')">Laundry/Parking/Pet Filters</button>
          <div v-show="openGroups.laundryParkingPet" class="laundry-parking-pet-group"> <!-- v-show="openGroups.laundryParkingPet" -->
            <select class="value" v-model="localSearchCriteria.features">
              <option value="null" selected>Laundry...</option>
              <option>Washer/Dryer In Unit</option>
              <option>Laundry In Building</option>
              <option>Laundry On Site</option>
              <option>Laundry Services</option>
              <option>None</option>
            </select>
            <select class="value" v-model="localSearchCriteria.parking">
              <option value="null" selected>Parking...</option>
              <option>Parking Included</option>
            </select>
            <select class="value" v-model="localSearchCriteria.pet">
              <option value="null" selecetd>Pet...</option>
              <option>Cat</option>
              <option>Dog</option>
              <option>Friendly</option>
            </select>
          </div>
        </div>
        <div class="info-group">
          <button class="toggle-btn" @click="toggleGroup('propertyStatusMedia')">Property Status/Photo Filters</button>
          <div v-show="openGroups.propertyStatusMedia" class="property-status-media-group">
            <select class="value" v-model="localSearchCriteria.photo">
              <option value="null" selected>Photos...</option>
              <option>Only Listings With Photos</option>
              <option>Any Listing With or Without</option>
            </select>
            <select class="value" v-model="localSearchCriteria.tours">
              <option value="null" selected>Virtual Tours...</option>
              <option>Virtual Tours Only</option>
              <option>All Listings</option>
            </select>
            <select class="value">
              <option value="null" selected>Features...</option>
              <option>FIX THIS</option>
            </select>
          </div>
        </div>
      </div>
      <div class="info-group bottom">
        <button class="toggle-btn" @click="toggleGroup('availDates')">Available Dates Filters</button>
        <div v-show="openGroups.availDates" class="avail-dates-group"> <!-- v-show="openGroups.availDates" -->
          <div class="avail-dates">
            <Datepicker class="value datepicker" v-model="localSearchCriteria.avail_from" placeholder="From Date"></Datepicker> 
            <Datepicker class="value datepicker" v-model="localSearchCriteria.avail_to" placeholder="To Date"></Datepicker>
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
import { laundryMapping, featuresMapping, allNeighborhoods, neighborhoodMapping, feeMapping, bedMapping, photoMapping, parkingMapping, petMapping } from '../utils/dataSets.js';

export default {
  components: {
      Datepicker,
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
      groupedNeighborhoods() {
        const groups = {};
        for (const neighborhood of this.allNeighborhoods) {
          const letter = neighborhood[0];
          if (!groups[letter]) {
            groups[letter] = [];
          }
          groups[letter].push(neighborhood);
        }
        return groups;
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
      photoMapping,
      parkingMapping,
      petMapping,
      featuresMapping,
      laundryMapping,
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
  background: #ECF0F3; /* Neumorphic background */
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
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
  background: #888888;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #ebebeb;
  cursor: pointer;
  transition: all 0.2s ease;
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
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;

}
.value {
  display: flex;
  align-items: center;
  width: 175px;
}
select.value {
  width: 208px;
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
.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.datepicker {
  width: 210px;
}

.search-btn-container {
  margin-top: 20px;
}

/** Neumorphism styling */
select {
  color: #aaa; /* Default color, similar to a placeholder */
}
select option {
  color: black; /* Color for options */
}
select option[value=""][disabled] {
  display: none; /* Hide the placeholder from the dropdown list */
}
select:not(:valid) {
  color: #aaa;
}
select:valid {
  color: black;
}
.filters input {
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #ECF0F3;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #333;
}
.filters select {
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #333;
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
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
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
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
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
    background: #ECF0F3;
  }
  .toggle-btn {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #ECF0F3 url('../assets/down-arrow.png') no-repeat right center; /* 10px is the width of the arrow image */
    background-size: 12px 12px;
    padding-right: 50px;
  }
}

@media only screen and (min-width: 1392px) {
  .bottom {
    margin-top: 1rem;
  }
}
</style>