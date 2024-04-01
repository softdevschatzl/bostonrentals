<template>
  <div class="apartments" :style="backgroundStyle" @item-click="handleClick"> <!-- :style="backgroundStyle" See line 40. -->
    <div class="border-left"></div>
    <div class="border-right"></div>
    <div class="content">
      <div class="name">{{ address }}</div>
      <div class="details">
        <span>{{ bedrooms }} Beds</span>
        <span>-</span>
        <span>{{ bathrooms }} Baths</span>
        <span>-</span>
        <span>{{ sqft }} sqft</span>
        <span>-</span>
        <span>${{ rent }}/mo</span>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'ApartmentItem',
      props: {
          propertyData: {
            type: Object,
            required: true,
            default: () => ({})
          }
      },
      computed: {
        address() {
          return this.propertyData.streetName;
        },
        bedrooms() {
          return this.propertyData.beds || 'N/A';
        },
        bathrooms() {
          return this.propertyData.baths || 'N/A';
        },
        sqft() {
          return this.propertyData.squareFootage || 'N/A';
        },
        rent() {
          return this.propertyData.price || 'N/A';
        },
        backgroundStyle() {
          return {
            backgroundImage: `url(${this.propertyData.photos[0]})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
          };
        },
      },
      mounted() {
        // console.log("Property data: ", this.propertyData);
      },
      methods: {
        handleClick() {
          this.$emit('item-click', this.propertyData);
        }
      }
    }
</script>

<style scoped>
  .apartments {
    background-color: #afc6d2;
    height: 30vh;
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    overflow: hidden;  /* Ensure no child element spills out of the rounded corners */
    position: relative;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .apartments::before, .apartments::after {
    content: "";
    position: absolute;
    background: white;
    transition: all 0.3s ease-in-out;
    z-index: 1;
  }

  /* Initial state for the top border */
  .apartments::before {
    top: 0;
    left: 0; 
    right: 100%; 
    height: 6px;
    width: 0;
  }

  /* Initial state for the bottom border */
  .apartments::after {
    bottom: 0;
    left: 100%;
    right: 0;
    height: 6px;
    width: 0;
  }

  .apartments > .border-left::before, .apartments > .border-right::before {
    content: "";
    position: absolute;
    background: white;
    transition: all 0.3s ease-in-out;
    z-index: 1;
  }

  /* Initial state for the left border */
  .apartments > .border-left::before {
    top: 0;
    bottom: 100%;
    left: 0;
    width: 6px;
    height: 0;
  }

  /* Initial state for the right border */
  .apartments > .border-right::before {
    top: 100%;
    bottom: 0;
    right: 0;
    width: 6px;
    height: 0;
  }

  .apartments:hover::before, .apartments:hover::after {
    left: 0;
    right: 0;
    width: 100%;
  }

  .apartments:hover > .border-left::before, .apartments:hover > .border-right::before {
    top: 0;
    bottom: 0;
    height: 100%;
  }

  .apartments:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2); /* Slightly increase shadow depth on hover for better effect */
  }

  .content {
    position: absolute;
    bottom: 15px;
    left: 15px;
    right: 15px;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.45));
    padding: 15px;
    border-radius: 12px;
  }

  .name {
    font-size: 1.6em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .address {
    font-size: 1.2em;
    margin-bottom: 5px;
  }

  .details span {
    margin-right: 10px;
  }

  .price {
    font-size: 1.4em;
    font-weight: bold;
    margin-top: 10px;
  }

  .name, .address, .details, .price {
    color: #fff;
  }
</style>