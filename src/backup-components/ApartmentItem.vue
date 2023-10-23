<template>
    <div class="apartments" :style="backgroundStyle">
      <div class="name">
        {{ apartment.name }}
      </div>
      <div class="address">
        {{ apartment.address }}
      </div>
      <div class="beds-and-baths">
        <p>{{ apartment.bedrooms }} Beds,</p>
        <p>{{ apartment.bathrooms }} Baths</p>
      </div>
      <div class="sqft">
        <p>{{ apartment.sqft }}</p>
      </div>
      <div class="price">
        <p>${{ apartment.price }}/month</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'ApartmentItem',
        props: {
            apartment: Object,
        },
        computed: {
          backgroundStyle() {
            return {
              backgroundImage: `url(${this.apartment.imageUrl})`,
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            };
          }
        }
    }
</script>

<style scoped>
  .apartments {
    background-color: rgb(255, 255, 255);
    height: 30vh;
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align: center;
    border: 4px solid #668d5e;
    border-radius: 5%;
    box-shadow: 8px 8px 14px 0px rgba(0, 0, 0, 0.3);
  }
  .apartments:hover {
    transition: .3s ease-in-out;
    transform: scale(1.1);
  }
  .apartment-image {
    height: 50%;
    width: auto;
  }

  .name, .address, .beds-and-baths, .sqft, .price {
    background-color: rgb(65, 65, 65);
    margin: 5px;
    padding: 5px;
    color: #fff;
  }
</style>