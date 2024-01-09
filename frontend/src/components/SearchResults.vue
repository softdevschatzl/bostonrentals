<!-- SearchResults.vue -->
<template>
<div class="listings">
  <table>
    <thead>
      <tr class="listing-header">
        <th><input type="checkbox" @change="selectAllListings" v-model="selectAll"></th>  <!-- Checkbox -->
        <th>Image</th>
        <th>Address</th>
        <th>City/State</th>
        <th>Property Type</th>
        <th>Beds</th>
        <th>Baths</th>
        <th>Rent</th>
      </tr>
    </thead>
    <tbody>
      <tr class="listing" v-for="listing in numberlessAddresses" :key="listing.id" @click="showListingDetails(listing)">
        <td><input type="checkbox" v-model="listing.selected" /></td>
        <td>
          <img :src="defaultImage" alt="Listing Image" class="listing-image" />
        </td>
        <td>{{ listing.addressLine1 }}</td>
        <td>{{ listing.city }}, {{ listing.state }}</td>
        <td>{{ listing.propertyType }}</td>
        <td>{{ listing.bedrooms }}</td>
        <td>{{ listing.bathrooms }}</td>
        <td>{{ listing.rent }}</td>
      </tr>
    </tbody>
  </table>
  <ListingInfo :listing="selectedListing" :visible="showListingInfo" @close="showListingInfo = false" />
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
          required: true
      },
  },
  mounted() {
    // console.log('Listings: ', this.listings); use if having issues with listing data.
  },
  computed: { // this is where we can do the address manipulation.
    numberlessAddresses() {
      return this.listings.map(listing => {
        // no address numbers!!!!
        // Split the address into parts, by spaces.
        let addressParts = listing.addressLine1.split(' ');

        // Covering the case where there are hyphenated address numbers.
        const hyphenatedNumberRegex = /^[0-9]+-[0-9]+/;

        // Check if the first part is a number and if the next part is not 'St'.
        if (hyphenatedNumberRegex.test(addressParts[0])) {
          // If so, remove the first part.
          addressParts.shift();
        } else if (!isNaN(addressParts[0]) && addressParts[1].toLowerCase() !== 'st') {
          // If the first part is a number and the next part is not 'St', remove the first part.
          addressParts = addressParts.slice(1);
        }

        const modifiedAddress = addressParts.join(' ');

        return {
          ...listing,
          addressLine1: modifiedAddress
        };
      });
    }
  },
  methods: {
    selectAllListings() {
      this.numberlessAddresses.forEach(listing => {
        listing.selected = !this.selectAll;
      });
    },
    showListingDetails(listing) {
      this.selectedListing = listing;
      this.showListingInfo = true;
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

@media only screen and (max-width: 768px) {
  .listing-image {
    width: 50px;
    height: 50px;
  }
}
</style>