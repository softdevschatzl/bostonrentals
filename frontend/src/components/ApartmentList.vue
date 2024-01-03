<template>
  <div class="apartments-section double-color-background">
    <div class="apartments-header">
      <h1>Find Rentals Near Alewife, MA</h1>
    </div>
    <div class="apartments-wrapper">
      <div class="apartments"> <!-- :style="backgroundStyle" See line 40. -->
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="content">
          <div class="name">123 Dick Rd</div>
          <div class="details">
            <span>11 Beds,</span>
            <span>0.5 Baths,</span>
            <span>9 sqft</span>
          </div>
        </div>
      </div>
      <div class="apartments"> <!-- :style="backgroundStyle" See line 40. -->
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="content">
          <div class="name">456 Apple Ave</div>
          <div class="details">
            <span>1 Beds,</span>
            <span>0 Baths,</span>
            <span>1 sqft</span>
          </div>
        </div>
      </div>
      <div class="apartments"> <!-- :style="backgroundStyle" See line 40. -->
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="content">
          <div class="name">789 Opaline Ter</div>
          <div class="details">
            <span>78 Beds,</span>
            <span>109 Baths,</span>
            <span>1235483 sqft</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    apartments: Array,
    location: String,
  },
};
</script>

<style scoped>
h1 {
  display: flex;
  text-align: center;
}

.apartments {
    background-color: rgba(255, 255, 255, 0.7);  /* Semi-transparent white to see the apartment image */
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
    background: #050833;
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
    background: #050833;
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
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3));
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
  .double-color-background {
    height: 100%;

    background: linear-gradient(to bottom, #050833 15%, #161616 25%, #161616 75%);
  }

  .apartments-section {
    min-height: 70vh;
    width: 100%;
    background-color: #4b4b4b;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .apartments {
    background-color: rgb(48, 48, 48);
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
  .apartments-wrapper {
    margin-top: 7vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
  }
  .apartment-image {
    height: 100px;
  }

  .apartments-header {
    margin: 40px;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    top: 0;
  }

  @media only screen and (max-width: 768px) {
    h1 {
      font-size: 25px;
    }

    .apartments-wrapper {
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }
    .apartments {
      width: 60%;
      height: 200px;
    }
  }
</style>
  