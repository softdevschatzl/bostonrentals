<template>
  <div class="search-container">
    <!-- Search Filters -->
    <div class="filters">
      <div class="info-group location-input">
        <input class="value" type="text" v-model="localSearchCriteria.streetName" placeholder="Street Name..." />
        <input class="value" type="text" v-model="localSearchCriteria.zipCode" placeholder="Zip Code..." />
        <select class="value" v-model="localSearchCriteria.citiesNeighborhoods">
          <option value="" disabled>City/Neighborhood</option>
          <optgroup v-for="(group, letter) in groupedNeighborhoods" :label="letter" :key="letter">
            <option v-for="neighborhood in group" :key="neighborhood" :value="neighborhood">{{ neighborhood }}</option>
          </optgroup>
        </select>
      </div>
      <div class="info-group">
        <select class="value" v-model="localSearchCriteria.beds">
          <option value="" disabled>Beds</option>
          <option>Studio</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        <select class="value" v-model="localSearchCriteria.baths">
          <option value="" disabled>Baths</option>
          <option>1</option>
          <option>1.5</option>
          <option>2</option>
          <option>2.5</option>
          <option>3</option>
          <option>3.5</option>
          <option>4</option>
        </select>
        <input class="value" type="text" v-model="localSearchCriteria.unit" placeholder="Unit..." />
      </div>
      <div class="info-group bottom">
        <div class="avail-dates">
          <Datepicker class="value datepicker" v-model="localSearchCriteria.startDate" placeholder="From"></Datepicker> 
          <Datepicker class="value datepicker" v-model="localSearchCriteria.endDate" placeholder="To"></Datepicker>
        </div>
        <div class="info-group min-max-rent">
          <input class="value" type="text" v-model="localSearchCriteria.minRent" placeholder="Min Rent..." />
          <input class="value" type="text" v-model="localSearchCriteria.maxRent" placeholder="Max Rent..." />
        </div>
      </div>
    </div>
    <div class="search-btn-container">
      <button class="search-btn" @click="localSearchListings">Search</button>
    </div>
  </div>
</template>

<script>
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
            set(value) {
                // Sends the event with updated criteria.
                this.$emit('update-criteria', value);
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
        allNeighborhoods: ['Back Bay', 'Beacon Hill', 'Charlestown', /** Get more neighborhoods. */],
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
  gap: 1rem;
  /** Neumorphic styling */
  background: #ECF0F3; /* Neumorphic background */
  border-radius: 25px;
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
.value {
  display: flex;
  align-items: center;
  width: 175px;
}
select.value {
  width: 210px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.datepicker {
  width: 210px;
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

/** Desktop view */
@media only screen and (min-width: 768px) {
  .info-group {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }
  .avail-dates {
    display: flex;
    flex-direction: row;
    width: 250px;
  }
  .filters {
    display: flex;
    justify-content: space-around;
  }
  .value {
    width: 200px;
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