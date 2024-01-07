<template>
  <div class="listing-info" v-if="visible && listing">
    <div class="container">
      <button class="close-btn" @click="close">X</button>
      <!-- Content of the listing info -->
      <div class="info-content">
        <!-- Display listing details here -->
        <img :src="listing.image || defaultImage" alt="Listing Image" class="listing-image" />
        <p>{{ listing?.addressLine1 }}</p>
        <p>{{ listing?.city }}, {{ listing?.state }}</p>
        <p>{{ listing.propertyType }}</p>
        <!-- Add more fields as needed -->
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from '../assets/no-image-found.jpg';

export default {
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
  data() {
    return {
      defaultImage
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #050833;
  width: 75%;
  height: 50%;
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
.listing-image {
  height: 200px;
  width: 200px;
}

.info-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #cecece;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: 80%;
  /* Add more styles as needed */
}

.close-btn {
  background-color: #050833;
  color: #ff0000;
  width: 50px;
  height: 50px;
}
</style>
