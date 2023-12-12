<!-- SearchFilters.vue  -->
<template>
  <div class="search-container">
    <!-- Search Filters -->
    <div class="filters">
      <div class="top">
        <div class="info-group location-input">
          <input class="value" type="text" v-model="localSearchCriteria.address" placeholder="Street Name..." />
          <input class="value" type="text" v-model="localSearchCriteria.zipCode" placeholder="Zip Code..." />
          <select class="value" v-model="localSearchCriteria.cities">
            <option value="" disabled>City/Neighborhood</option>
            <optgroup v-for="(group, letter) in groupedNeighborhoods" :label="letter" :key="letter">
              <option v-for="neighborhood in group" :key="neighborhood" :value="neighborhood">{{ neighborhood }}</option>
            </optgroup>
          </select>
        </div>
        <div class="info-group">
          <select class="value" v-model="localSearchCriteria.bedrooms">
            <option value="" disabled>Beds</option>
            <option>0 (Studio)</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
          <select class="value" v-model="localSearchCriteria.bathrooms">
            <option value="" disabled>Baths</option>
            <option>1</option>
            <option>1.5</option>
            <option>2</option>
            <option>2.5</option>
            <option>3</option>
            <option>3.5</option>
            <option>4</option>
          </select>
          <input class="value" type="text" v-model="localSearchCriteria.unit" placeholder="Unit...(N/A)" />
        </div>
        <div class="info-group min-max-rent">
          <input class="value" type="text" v-model="localSearchCriteria.minRent" placeholder="Min Rent...(N/A)" />
          <input class="value" type="text" v-model="localSearchCriteria.maxRent" placeholder="Max Rent...(N/A)" />
          <input class="value" type="text" v-model="localSearchCriteria.fee" placeholder="Fee... (N/A)" />
        </div>
        <div class="info-group">
          <select class="value" v-model="localSearchCriteria.propertyType">
            <option value="" disabled>Property Type (N/A)</option>
            <option>Apartment</option>
            <option>Condo</option>
            <option>House</option>
            <option>Multi-Family</option>
            <option>Townhouse</option>
          </select>
          <select class="value" v-model="localSearchCriteria.status">
            <option value="" disabled>Status (N/A)</option>
            <option>On Market</option>
            <option>Off Market</option>
          </select>
          <select class="value" v-model="localSearchCriteria.media">
            <option value="" disabled>Media (N/A)</option>
            <option>Photos</option>
            <option>Virtual Tour</option>
          </select>
        </div>
        <div class="info-group">
          <select class="value" v-model="localSearchCriteria.laundry">
            <option value="" disabled>Laundry (N/A)</option>
            <option>In Unit</option>
            <option>In Building</option>
            <option>None</option>
          </select>
          <select class="value" v-model="localSearchCriteria.parking">
            <option value="" disabled>Parking (N/A)</option>
            <option>Garage</option>
            <option>Driveway</option>
            <option>Street</option>
            <option>None</option>
          </select>
          <select class="value" v-model="localSearchCriteria.pet">
            <option value="" disabled>Pet Friendly (N/A)</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>
      <div class="info-group bottom">
        <div class="avail-dates">
          <Datepicker class="value datepicker" v-model="localSearchCriteria.startDate" placeholder="From (N/A)"></Datepicker> 
          <Datepicker class="value datepicker" v-model="localSearchCriteria.endDate" placeholder="To (N/A)"></Datepicker>
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
        searchListings() {
            // Sends the event to the parent component.
            this.$emit('search');
        }
    },
    data() {
      return {
        allNeighborhoods: ['Allston', 
        'Back Bay', 'Bay Village', 'Beacon Hill', 'Brighton', 
        'Charlestown', 'Chinatown-Leather District', 'Cambridge',
        'Dorchester', 'Downtown', 
        'East Boston', 
        'Fenway-Kenmore',
        'Jamaica Plain',
        'Mid-Dorchester', 'Mission Hill', 'Medford',
        'North End', 
        'Roslindale',
        'Roxbury',
        'South Boston', 'South End', 'Somerville',
        'West End', 'West Roxbury', 'Wharf District', /** Get more neighborhoods. */],
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
  border-radius: 25px;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  padding: 2rem;
}

/* .info-group {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-left: 2.5vw;
} */
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
.filters input,
.filters select {
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
.search-btn {
  max-width: 250px;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #668d5e;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  font-size: 1rem;
  color: #ebebeb;
  cursor: pointer;
  transition: all 0.2s ease;
}
.search-btn:hover {
  background: #93ca88;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
/** End neumorphism styling */

/** Desktop view */
@media only screen and (min-width: 768px) {
  .search-container {
    display: flex;
    justify-content: space-evenly;
  }
  .filters input 
  .filters select {
    max-height: 100px;
  }
}

@media only screen and (min-width: 1392px) {
  .bottom {
    margin-top: 1rem;
  }
}
</style>