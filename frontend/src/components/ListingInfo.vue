<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <h1>Rental Information</h1>
      <button class="close-btn" @click="close">X</button>
      <!-- Content of the listing info -->
      <div class="info-content">
        <div class="info-content-header">
          <h2>{{ listing?.addressLine1 }}</h2>
          <span>-</span>
          <p>{{ listing?.city }}, {{ listing?.state }}, {{ listing?.zipCode }}</p>
          <!-- Add more fields as needed -->
        </div>
        <p class="property-type" v-if="listing?.propertyType">{{ listing?.propertyType }}</p>
        <!-- Display listing details here -->
        <div class="image-container">
          <Carousel :images="listingImages"/>
        </div>
        <div class="info-container">
          <div class="info-container-1">
            <div class="info-container-2">
              <h2>Beds</h2>
              <p>{{ listing?.bedrooms }}</p>
            </div>
            <div class="info-container-2">
              <h2>Baths</h2>
              <p>{{ listing?.bathrooms }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.rent || listing?.fee">
            <div class="info-container-2">
              <h2>Rent</h2>
              <p>{{ listing?.rent }}</p>
            </div>
            <div class="info-container-2">
              <h2>Fee</h2>
              <p>{{ listing?.fee }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.pet">
            <div class="info-container-2">
              <h2>Pet</h2>
              <p>{{ listing?.pet }}</p>
            </div>
          </div>
          <div class="info-container-1" v-if="listing?.laundry || listing?.parking">
            <div class="info-container-2">
                <h2>Laundry</h2>
                <p>{{ listing?.laundry }}</p>
            </div>
            <div class="info-container-2">
                <h2>Parking</h2>
                <p>{{ listing?.parking }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from './ImageCarousel.vue';

export default {
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
    }
  },
  mounted() {
    console.log(this.listing);
  },
  computed: {
    listingImages() {
      return this.listing.images || [];
    }
  }
}
</script>

<style scoped>
h1 {
  color: #ffffff;
  margin-bottom: 15px;
}
h2 {
  font-size: 18px;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #050833;
  width: 85%;
  height: 75%;
  border-radius: 20px;
}
.listing-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #cecece;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: 80%;
  gap: 20px;
  /* Add more styles as needed */
}
.info-content-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.info-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}
.info-container-1 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 25px;
  width: auto;
  background: #b1b1b1;
  padding: 5px;
}
.info-container-2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: auto;
  padding: 5px;
  border: 1px solid black;
}
.info-container-2 h2 {
  text-decoration: underline;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #050833;
  color: #ff0000;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
}

.image-container {
  height: 300px;
  width: 600px;
}

@media only screen and (max-width: 768px) {
  h2 {
    text-align: center;
  }
  .container {
    width: 100%;
    height: 90%;
    top: 5%;
    border-radius: 0;
  }

  .image-container {
    width: 90%;
    height: 50%;
  }
}
</style>
