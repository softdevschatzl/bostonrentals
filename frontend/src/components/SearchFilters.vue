<template>
  <div class="search-container">
    <!-- Search Filters -->
    <div class="filters">
      <div class="info-group location-input">
        <input class="value" type="text" v-model="localSearchCriteria.streetName" placeholder="Street Name..." />
        <input class="value" type="text" v-model="localSearchCriteria.zipCode" placeholder="Zip Code..." />
        <input class="value" type="text" v-model="localSearchCriteria.citiesNeighborhoods" placeholder="Cities / Neighborhoods..." />
      </div>
      <div class="info-group values">
        <select class="value" v-model="localSearchCriteria.beds">
          <option value="" disabled>Select Beds</option>
          <option>Studio</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
        <select class="value" v-model="localSearchCriteria.baths">
          <option value="" disabled>Select Baths</option>
          <option>1</option>
          <option>1.5</option>
          <option>2</option>
          <option>2.5</option>
          <option>3</option>
          <option>3.5</option>
          <option>4</option>
        </select>
        <input class="value" type="text" v-model="localSearchCriteria.unit" placeholder="Unit" />
      </div>
      <div class="info-group">
        <div class="avail-dates">
          <Datepicker class="value" v-model="localSearchCriteria.startDate" placeholder="Start Date"></Datepicker> 
          <Datepicker class="value" v-model="localSearchCriteria.endDate" placeholder="End Date"></Datepicker>
        </div>
        <div class="min-max-rent">
          <input type="text" v-model="localSearchCriteria.minRent" placeholder="Min Rent" />
          <input type="text" v-model="localSearchCriteria.maxRent" placeholder="Max Rent" />
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
            }
        }
    },
    methods: {
        searchListings() {
            // Sends the event to the parent component.
            this.$emit('search');
        }
    }
}

</script>

<style scoped>
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

.info-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  margin: 0 15px 0 15px;
  width: 180px;
}

.search-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  background: #ECF0F3; /* Neumorphic background */
  border-radius: 25px;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  padding: 2rem;
  max-width: 1500px;
  margin: 2rem auto;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

.min-max-rent {
  display: flex;
  flex-direction: column;
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
.search-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

@media only screen and (min-width: 768px) {
  .info-group {
    display: flex;
    flex-direction: row;
  }
  .min-max-rent {
    flex-direction: row;
  }
  .filters {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .value {
    width: 200px;
  }
  .filters input 
  .filters select {
    max-height: 100px;
  }
}
</style>