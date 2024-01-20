<!-- SearchResults.vue -->
<template>
<div class="listings" v-if="Array.isArray(listings)">
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
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr class="listing" v-for="listing in listings" :key="listing.id" @click="showListingDetails(listing)">
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
<div class="no-listings-container" v-else>
  <div class="no-listings">
    <p>No listings found.</p>
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

export default {
  components: {
    ListingInfo
  },
  data() {
    return {
      selectAll: false,
      defaultImage,
      selectedListing: null,
      showListingInfo: false
    }
  },
  props: {
      listings: {
          type: Array,
          required: true,
          default: () => []
      },
  },
  mounted() {
    console.log('Listings: ', this.listings);
    console.log('Listings Type: ', typeof this.listings);
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
  padding: 15px;
  border-bottom: 1px solid #bebebe;
}
.listing-header th {
  background: #ECF0F3;
  border-bottom: 2px solid #bebebe;
  border-left: 1px solid #cecece;
  border-right: 1px solid #cecece;
}
.listings th, .listings td {
  width: 1/6*100%;
  box-sizing: border-box;
}
.listing td {
  padding: 15px;
  border-bottom: 2px solid #aaaaaa;
}

.listing {
  background: #bebebe;
}
.listing:hover {
  background-color: #DFE0E2;
}
.listing:hover {
  background: #DFE0E2;
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-listings {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100px;
  background: #afc6d2;
  text-align: center;
  border: 5px solid #7e7e7e;
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