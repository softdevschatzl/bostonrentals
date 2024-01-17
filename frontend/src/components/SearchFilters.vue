<!-- SearchFilters.vue  -->
<template>
  <div class="search-container">
    <!-- Search Filters -->
    <div class="filters">
      <div class="top">
        <div class="info-group location-input">
          <button class="toggle-btn" data-group="locationInput" @click="toggleGroup('locationInput')">Location Filters </button>
          <div v-show="openGroups.locationInput" class="location-input-group"> <!-- v-show="openGroups.locationInput" -->
            <input class="value" type="text" v-model="localSearchCriteria.street_name" placeholder="Street Name..." />
            <input class="value" type="text" v-model="localSearchCriteria.zip" placeholder="Zip Code..." />
            <select class="value" v-model="localSearchCriteria.city_neighborhood">
              <option value="" selected><strong>City/Neighborhood</strong></option>
              <optgroup v-for="(group, letter) in groupedNeighborhoods" :label="letter" :key="letter">
                <option v-for="neighborhood in group" :key="neighborhood" :value="neighborhood">{{ neighborhood }}</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div class="info-group">
          <button class="toggle-btn" data-group="bedroomsBathrooms" @click="toggleGroup('bedroomsBathrooms')">Bedrooms/Bathrooms Filters</button>
          <div v-show="openGroups.bedroomsBathrooms" class="bedrooms-bathrooms-group">
            <select class="value" v-model="localSearchCriteria.min_bed">
              <option value="" disabled>Minimum Beds</option>
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
            <select class="value" v-model="localSearchCriteria.min_bath">
              <option value="" disabled>Minimum Baths</option>
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
              <option value="" disabled>Fee</option>
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
            <select class="value" v-model="localSearchCriteria.laundry">
              <option value="" disabled>Laundry</option>
              <option>Washer/Dryer In Unit</option>
              <option>Laundry In Building</option>
              <option>Laundry On Site</option>
              <option>Washer/Dryer Hookups</option>
              <option>Laundry Services</option>
              <option>None</option>
            </select>
            <select class="value" v-model="localSearchCriteria.parking">
              <option value="" disabled>Parking</option>
              <option>Available</option>
              <option>For Rent</option>
              <option>Included</option>
              <option>None</option>
            </select>
            <select class="value" v-model="localSearchCriteria.pet">
              <option value="" disabled>Pet Friendly</option>
              <option>Cat</option>
              <option>Dog</option>
              <option>Friendly</option>
            </select>
          </div>
        </div>
        <div class="info-group">
          <button class="toggle-btn" @click="toggleGroup('propertyStatusMedia')">Property Status/Media Filters</button>
          <div v-show="openGroups.propertyStatusMedia" class="property-status-media-group">
            <select class="value" v-model="localSearchCriteria.status">
              <option value="" disabled>Status</option>
              <option>On Market</option>
              <option>Pending</option>
              <option>Off Market</option>
            </select>
            <select class="value" v-model="localSearchCriteria.media">
              <option value="" disabled>Media</option>
              <option>Only Listings With Photos</option>
              <option>Any</option>
            </select>
            <select class="value">
              <option value="" disabled>Advanced Options</option>
              <option>FIX THIS</option>
            </select>
          </div>
        </div>
      </div>
      <div class="info-group bottom">
        <button class="toggle-btn" @click="toggleGroup('availDates')">Available Dates Filters</button>
        <div v-show="openGroups.availDates" class="avail-dates-group"> <!-- v-show="openGroups.availDates" -->
          <div class="avail-dates">
            <Datepicker class="value datepicker" v-model="localSearchCriteria.startDate" placeholder="From (N/A)"></Datepicker> 
            <Datepicker class="value datepicker" v-model="localSearchCriteria.endDate" placeholder="To (N/A)"></Datepicker>
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
      if (apiCriteria.city_neighborhood in this.neighborhoodMapping) {
        apiCriteria.city_neighborhood = this.neighborhoodMapping[apiCriteria.city_neighborhood];
      }
      // Fee
      if (apiCriteria.listing_fee in this.feeMapping) {
        apiCriteria.listing_fee = this.feeMapping[apiCriteria.listing_fee];
      }
      // Beds
      if (apiCriteria.beds in this.bedMapping) {
        apiCriteria.beds = this.bedMapping[apiCriteria.beds];
      }
      // Baths
      if (apiCriteria.baths in this.bedMapping) {
        apiCriteria.baths = this.bedMapping[apiCriteria.baths];
      }

      console.log("API Criteria: ", apiCriteria);

      return apiCriteria;
    }
  },
  data() {
    const isMobile = window.innerWidth < 768;
    return {
      downArrow,
      allNeighborhoods: [
        // Boston
        'Boston',
        'Boston - Allston',
        'Boston - Back Bay',
        'Boston - Bay Village',
        'Boston - Beacon Hill',
        'Boston - Brighton',
        'Boston - Charlestown',
        'Boston - Chinatown',
        'Boston - Dorchester',
        'Boston - East Boston',
        'Boston - Fenway',
        'Boston - Financial District',
        'Boston - Fort Hill',
        'Boston - Hyde Park',
        'Boston - Jamaica Plain',
        'Boston - Kenmore',
        'Boston - Leather District',
        'Boston - Mattapan',
        'Boston - Midtown',
        'Boston - Mission Hill',
        'Boston - North End',
        'Boston - Roslindale',
        'Boston - Roxbury',
        'Boston - Seaport District',
        'Boston - South Boston',
        'Boston - South End',
        'Boston - Theatre District',
        'Boston - Waterfront',
        'Boston - West End',
        'Boston - West Roxbury',

        // Braintree
        'Braintree',
        'Braintree - Braintree Highlands',
        'Braintree - East Braintree',
        'Braintree - Five Corners',
        'Braintree - South Braintree',
        // Brookline
        'Brookline',
        'Brookline - Beaconsfield',
        'Brookline - Brookline Hills',
        'Brookline - Brookline Village',
        'Brookline - Chestnut Hill',
        'Brookline - Coolidge Corner',
        'Brookline - Longwood',
        'Brookline - Reservoir',
        'Brookline - Washington Square',
        // Cambridge
        'Cambridge',
        'Cambridge - Agassiz',
        'Cambridge - Cambridge Highlands',
        'Cambridge - Cambridgeport',
        'Cambridge - Central Square',
        'Cambridge - East Cambridge',
        'Cambridge - Harvard Square',
        'Cambridge - Huron Square',
        'Cambridge - Inman Square',
        'Cambridge - Kendall Square',
        'Cambridge - Mid Cambridge',
        'Cambridge - Neighborhood Nine',
        'Cambridge - North Cambridge',
        'Cambridge - Porter Square',
        'Cambridge - Riverside',
        'Cambridge - Wellington-Harrington',
        'Cambridge - West Cambridge',
        // Medford
        'Medford',
        'Medford - College Hill',
        'Medford - Medford Hillside',
        'Medford - North Medford',
        'Medford - Tufts University',
        'Medford - Wellington',
        'Medford - West Medford',
        // Quincy
        'Quincy',
        'Quincy - Adams Shore',
        'Quincy - Atlantic',
        'Quincy - Germantown',
        'Quincy - Houghs Neck',
        'Quincy - Marina Bay',
        'Quincy - Merrymount',
        'Quincy - Montclair',
        'Quincy - Norfolk Downs',
        'Quincy - North Quincy',
        'Quincy - Quincy Center',
        'Quincy - Quincy Neck',
        'Quincy - Quincy Point',
        'Quincy - Rock Island',
        'Quincy - South Quincy',
        'Quincy - Squantum',
        'Quincy - West Quincy',
        'Quincy - Wollaston',
        'Quincy - Wollaston Heights',
        // Somerville
        'Somerville',
        'Somerville - Assembly Square',
        'Somerville - Ball Square',
        'Somerville - Davis Square',
        'Somerville - East Somerville',
        'Somerville - Inman Square',
        'Somerville - Magoun Square',
        'Somerville - Powderhouse Square',
        'Somerville - Prospect Hill',
        'Somerville - Spring Hill',
        'Somerville - Teele Square',
        'Somerville - Ten Hills',
        'Somerville - Union Square',
        'Somerville - West Somerville',
        'Somerville - Winter Hill',
        // Weymouth
        'Weymouth',
        'Weymouth - Bicknell Square',
        'Weymouth - Columbian Square',
        'Weymouth - East Weymouth',
        'Weymouth - Fort Hill',
        'Weymouth - Great Hill',
        'Weymouth - Jackson Square',
        'Weymouth - Lincoln Heights',
        'Weymouth - Lovell Corners',
        'Weymouth - North Weymouth',
        'Weymouth - Old Spain',
        'Weymouth - Rose Cliff',
        'Weymouth - South Weymouth',
        'Weymouth - Weymouth Heights',
        'Weymouth - Weymouth Landing',
      ],
      openGroups: { 
        locationInput: !isMobile,
        bedroomsBathrooms: !isMobile,
        minMaxRent: !isMobile,
        propertyStatusMedia: !isMobile,
        laundryParkingPet: !isMobile,
        availDates: !isMobile,
      },
      neighborhoodMapping: {
        'Boston - Allston': 'Boston:Allston',
        'Boston - Back Bay': 'Boston:Back Bay',
        'Boston - Bay Village': 'Boston:Bay Village',
        'Boston - Beacon Hill': 'Boston:Beacon Hill',
        'Boston - Brighton': 'Boston:Brighton',
        'Boston - Charlestown': 'Boston:Charlestown',
        'Boston - Chinatown': 'Boston:Chinatown',
        'Boston - Dorchester': 'Boston:Dorchester',
        'Boston - East Boston': 'Boston:East Boston',
        'Boston - Fenway': 'Boston:Fenway',
        'Boston - Financial District': 'Boston:Financial District',
        'Boston - Fort Hill': 'Boston:Fort Hill',
        'Boston - Hyde Park': 'Boston:Hyde Park',
        'Boston - Jamaica Plain': 'Boston:Jamaica Plain',
        'Boston - Kenmore': 'Boston:Kenmore',
        'Boston - Leather District': 'Boston:Leather District',
        'Boston - Mattapan': 'Boston:Mattapan',
        'Boston - Midtown': 'Boston:Midtown',
        'Boston - Mission Hill': 'Boston:Mission Hill',
        'Boston - North End': 'Boston:North End',
        'Boston - Roslindale': 'Boston:Roslindale',
        'Boston - Roxbury': 'Boston:Roxbury',
        'Boston - Seaport District': 'Boston:Seaport District',
        'Boston - South Boston': 'Boston:South Boston',
        'Boston - South End': 'Boston:South End',
        'Boston - Theatre District': 'Boston:Theatre District',
        'Boston - Waterfront': 'Boston:Waterfront',
        'Boston - West End': 'Boston:West End',
        'Boston - West Roxbury': 'Boston:West Roxbury',

        // Braintree
        'Braintree - Braintree Highlands': 'Braintree:Braintree Highlands',
        'Braintree - East Braintree': 'Braintree:East Braintree',
        'Braintree - Five Corners': 'Braintree:Five Corners',
        'Braintree - South Braintree': 'Braintree:South Braintree',
        
        // Brookline
        'Brookline - Beaconsfield': 'Brookline:Beaconsfield',
        'Brookline - Brookline Hills': 'Brookline:Brookline Hills',
        'Brookline - Brookline Village': 'Brookline:Brookline Village',
        'Brookline - Chestnut Hill': 'Brookline:Chestnut Hill',
        'Brookline - Coolidge Corner': 'Brookline:Coolidge Corner',
        'Brookline - Longwood': 'Brookline:Longwood',
        'Brookline - Reservoir': 'Brookline:Reservoir',
        'Brookline - Washington Square': 'Brookline:Washington Square',

        // Cambridge
        'Cambridge - Agassiz': 'Cambridge:Agassiz',
        'Cambridge - Cambridge Highlands': 'Cambridge:Cambridge Highlands',
        'Cambridge - Cambridgeport': 'Cambridge:Cambridgeport',
        'Cambridge - Central Square': 'Cambridge:Central Square',
        'Cambridge - East Cambridge': 'Cambridge:East Cambridge',
        'Cambridge - Harvard Square': 'Cambridge:Harvard Square',
        'Cambridge - Huron Square': 'Cambridge:Huron Square',
        'Cambridge - Inman Square': 'Cambridge:Inman Square',
        'Cambridge - Kendall Square': 'Cambridge:Kendall Square',
        'Cambridge - Mid Cambridge': 'Cambridge:Mid Cambridge',
        'Cambridge - Neighborhood Nine': 'Cambridge:Neighborhood Nine',
        'Cambridge - North Cambridge': 'Cambridge:North Cambridge',
        'Cambridge - Porter Square': 'Cambridge:Porter Square',
        'Cambridge - Riverside': 'Cambridge:Riverside',
        'Cambridge - Wellington-Harrington': 'Cambridge:Wellington-Harrington',
        'Cambridge - West Cambridge': 'Cambridge:West Cambridge',

        // Medford
        'Medford - College Hill': 'Medford:College Hill',
        'Medford - Medford Hillside': 'Medford:Medford Hillside',
        'Medford - North Medford': 'Medford:North Medford',
        'Medford - Tufts University': 'Medford:Tufts University',
        'Medford - Wellington': 'Medford:Wellington',
        'Medford - West Medford': 'Medford:West Medford',

        // Quincy
        'Quincy - Adams Shore': 'Quincy:Adams Shore',
        'Quincy - Atlantic': 'Quincy:Atlantic',
        'Quincy - Germantown': 'Quincy:Germantown',
        'Quincy - Houghs Neck': 'Quincy:Houghs Neck',
        'Quincy - Marina Bay': 'Quincy:Marina Bay',
        'Quincy - Merrymount': 'Quincy:Merrymount',
        'Quincy - Montclair': 'Quincy:Montclair',
        'Quincy - Norfolk Downs': 'Quincy:Norfolk Downs',
        'Quincy - North Quincy': 'Quincy:North Quincy',
        'Quincy - Quincy Center': 'Quincy:Quincy Center',
        'Quincy - Quincy Neck': 'Quincy:Quincy Neck',
        'Quincy - Quincy Point': 'Quincy:Quincy Point',
        'Quincy - Rock Island': 'Quincy:Rock Island',
        'Quincy - South Quincy': 'Quincy:South Quincy',
        'Quincy - Squantum': 'Quincy:Squantum',
        'Quincy - West Quincy': 'Quincy:West Quincy',
        'Quincy - Wollaston': 'Quincy:Wollaston',
        'Quincy - Wollaston Heights': 'Quincy:Wollaston Heights',

        // Somerville
        'Somerville - Assembly Square': 'Somerville:Assembly Square',
        'Somerville - Ball Square': 'Somerville:Ball Square',
        'Somerville - Davis Square': 'Somerville:Davis Square',
        'Somerville - East Somerville': 'Somerville:East Somerville',
        'Somerville - Inman Square': 'Somerville:Inman Square',
        'Somerville - Magoun Square': 'Somerville:Magoun Square',
        'Somerville - Powderhouse Square': 'Somerville:Powderhouse Square',
        'Somerville - Prospect Hill': 'Somerville:Prospect Hill',
        'Somerville - Spring Hill': 'Somerville:Spring Hill',
        'Somerville - Teele Square': 'Somerville:Teele Square',
        'Somerville - Ten Hills': 'Somerville:Ten Hills',
        'Somerville - Union Square': 'Somerville:Union Square',
        'Somerville - West Somerville': 'Somerville:West Somerville',
        'Somerville - Winter Hill': 'Somerville:Winter Hill',

        // Weymouth
        'Weymouth - Bicknell Square': 'Weymouth:Bicknell Square',
        'Weymouth - Columbian Square': 'Weymouth:Columbian Square',
        'Weymouth - East Weymouth': 'Weymouth:East Weymouth',
        'Weymouth - Fort Hill': 'Weymouth:Fort Hill',
        'Weymouth - Great Hill': 'Weymouth:Great Hill',
        'Weymouth - Jackson Square': 'Weymouth:Jackson Square',
        'Weymouth - Lincoln Heights': 'Weymouth:Lincoln Heights',
        'Weymouth - Lovell Corners': 'Weymouth:Lovell Corners',
        'Weymouth - North Weymouth': 'Weymouth:North Weymouth',
        'Weymouth - Old Spain': 'Weymouth:Old Spain',
        'Weymouth - Rose Cliff': 'Weymouth:Rose Cliff',
        'Weymouth - South Weymouth': 'Weymouth:South Weymouth',
        'Weymouth - Weymouth Heights': 'Weymouth:Weymouth Heights',
        'Weymouth - Weymouth Landing': 'Weymouth:Weymouth Landing',
      },
      feeMapping: {
        'No Fee': '1', // Fee paid by landlord
        '25% Month Fee': '.75',
        '50% Month Fee': '.5',
        '75% Month Fee': '.25',
        '1 Month Fee': '0', // Fee paid by tenant
      },
      bedMapping: {
        'Studio': 0,
      },
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