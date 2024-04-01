<!-- SearchResults.vue -->
<template>
<div class="listings" v-if="Array.isArray(listings) && listings.length">
  <table>
    <thead>
      <tr class="listing-header">
        <th><input type="checkbox" @change="selectAllListings" @click.stop v-model="selectAll"></th>  <!-- Checkbox -->
        <th>Photo</th>
        <th>Street Name</th>
        <th>City/State</th>
        <th>Neighborhood</th>
        <th>Beds</th>
        <th>Baths</th>
        <th class="price-header">
          Price
          <span class="price" @click="toggleSortPrice">
            <svg v-if="sortState === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V3.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 3.707V11.5a.5.5 0 0 1-.5.5z"/>
            </svg>
            <svg v-else-if="sortState === 'desc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V4.5A.5.5 0 0 1 8 4z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H2.707l3.147 3.146a.5.5 0 0 1-.708.708L2 9.707V13.5a.5.5 0 0 1-1 0v-4.5z"/>
              <path fill-rule="evenodd" d="M14.5 7.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-1 0V9.707l-3.146 3.147a.5.5 0 0 1-.708-.708L13.293 9H9.5a.5.5 0 0 1 0-1h4.5z"/>
            </svg>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="listing" v-for="listing in sortedListings" :key="listing.id" @click="showListingDetails(listing)">
        <td><input type="checkbox" v-model="listing.selected" @click.stop /></td>
        <td>
          <img :src="listing.photos[0] || defaultImage" alt="Listing Image" class="listing-image" />
        </td>
        <td>{{ listing.streetName }}</td>
        <td>{{ listing.city }}, {{ listing.state }}</td>
        <td>{{ listing.neighborhood }}</td>
        <td>{{ listing.beds }}</td>
        <td>{{ listing.baths }}</td>
        <td>{{ listing.price }}</td>
      </tr>
    </tbody>
  </table>
  <ListingInfo :listing="selectedListing" :visible="showListingInfo" @close="showListingInfo = false" />
</div>

<div class="no-listings-container" v-if="!Array.isArray(listings) || listings.length === 0">
  <div class="no-listings" v-if="!loading">
    <p>No listings found.</p>
  </div>
  <div class="search-animation" v-else>
    <SearchingAnimation />
  </div>
</div>
</template>

<script>
/**
 * This component is responsible for displaying the search results.
 * It receives the listings from the SearchPage component, and displays them in a table.
 * It also allows the user to select listings, and add them to their favorites.
 */
import ListingInfo from './ListingInfo.vue';
import defaultImage from '../assets/no-image-found.jpg';
import SearchingAnimation from '../components/SearchAnimation.vue';

export default {
  components: {
    ListingInfo,
    SearchingAnimation,
  },
  data() {
    return {
      selectAll: false,
      defaultImage,
      selectedListing: null,
      showListingInfo: false,
      sortState: '',
    }
  },
  props: {
      listings: {
          type: Array,
          required: true,
          default: () => []
      },
      loading: {
          type: Boolean,
          required: true,
      }
  },
  mounted() {
    // console.log('Listings: ', this.listings);
    // console.log('Listings Type: ', typeof this.listings);
  },
  methods: {
    selectAllListings() {
      const isChecked = event.target.checked;
      this.selectAll = isChecked;
      this.listings.forEach(listing => {
        listing.selected = isChecked;
      });
    },
    showListingDetails(listing) {
      this.selectedListing = listing;
      this.showListingInfo = true;
    },
    toggleSortPrice() {
      if (this.sortState === '') {
        this.sortState = 'asc';
      } else if (this.sortState === 'asc') {
        this.sortState = 'desc';
      } else {
        this.sortState = '';
      }
    }
  },
  computed: {
    sortedListings() {
      if (this.sortState === 'asc') {
        return [...this.listings].sort((a, b) => a.price - b.price);
      } else if (this.sortState === 'desc') {
        return [...this.listings].sort((a, b) => b.price - a.price);
      } else {
        return this.listings;
      }
    }
  }
}
</script>

<style scoped>
.listings {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  margin: 0 auto;
}
.listings table {
  width: auto;
  min-width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}
.listings th, .listings td {
  text-align: left;
  align-items: left;
  padding: 15px;
  border-bottom: 1px solid #bebebe;
}
.listing-header th {
  color: #ffffff;
  background: rgb(30, 30, 30);
  border-top: 2px solid #bebebe;
  border-bottom: 2px solid #bebebe;
  border-left: 1px solid #cecece;
  border-right: 1px solid #cecece;
}
.listings th, .listings td {
  /* width: calc(1/6*100%); */
  box-sizing: border-box;
}

.price-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listing td {
  padding: 15px;
  border-bottom: 2px solid #aaaaaa;
  /* border-right: 1px solid #6e6e6e;
  border-left: 1px solid #6e6e6e; */
}

.listing {
  background: rgb(0, 0, 0);
  color: #ffffff;
}
.listing:hover {
  background-color: rgb(41, 41, 41); 
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
.listing-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.no-listings-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-listings {
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100px;
  background: #afc6d2;
  text-align: center;
  border: 5px solid #7e7e7e;
}

.search-animation {
  margin-top: 40vh;
}

.price {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 768px) {
  .listing-image {
    width: 50px;
    height: 50px;
  }
  .no-listings {
    margin-top: 50px;
    margin-bottom: 50px;
  }
}
</style>