<template>
    <div class="apartments">
        {{ apartment.name }}
        {{ apartment.address }}
        {{ apartment.bedrooms }}
        {{ apartment.bathrooms }}
        {{ apartment.sqft }}
        <img :src="apartment.imageUrl" alt="Apartment Image" class="apartment-image">
        {{ apartment.price }}
        {{ apartment.description }}
    </div>
</template>

<script>
    export default {
        name: 'ApartmentItem',
        props: {
            apartment: Object,
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
  }
  .apartments:hover {
    transition: .3s ease-in-out;
    transform: scale(1.1);
  }
  .apartment-image {
    height: 100px;
  }
</style>