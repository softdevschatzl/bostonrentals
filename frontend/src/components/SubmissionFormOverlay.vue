<template>
  <div class="submission-form-overlay">
    <button type="button" class="btn-close" @click="close">
        <span class="icon-cross"></span>
        <span class="visually-hidden">Close</span>
    </button>
    <h1>Submission Form</h1>
    <p>Sharing List: {{  }}</p>
    <form @submit.prevent="handleSubmit" class="actual-form">
      <label for="credit-score">Credit Score:</label>
      <input id="credit-score" type="number" v-model="creditScore" required>
      <label for="has-pets">Do You Have Pets?</label>
      <input type="checkbox" id="has-pets" v-model="hasPets" value="true">
      <label for="is-student">Is Student:</label>
      <input type="checkbox" id="is-student" v-model="isStudent" value="true">
      <label for="primary-contact">Primary Contact:</label>
      <select id="primary-contact" v-model="primaryContact" required>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      creditScore: null,
      hasPets: false,
      isStudent: false,
      primaryContact: null,
      submissionNameVisible: false,
    }
  },
  methods: {
    handleSubmit() {
      console.log('Credit Score:', this.creditScore);
      console.log('Has Pets:', this.hasPets);
      console.log('Is Student:', this.isStudent);
      console.log('Primary Contact:', this.primaryContact);
    },
    close() {
      this.submissionFormVisible = false;
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
h1 {
  margin-bottom: 20px;
}
.overlay-shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}

.submission-form-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50vh;
  width: 50vh;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: 3px solid #333;
  display: flex;
  flex-direction: column;
}

.actual-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

// Display a cross with CSS only.
//
// Cool close button.
//
// Credits: Cyril Lamotte on Codepen.
// https://codepen.io/cyril-lamotte/pen/bGVxjOr
//
// $size  : px or em
// $color : color
// $thickness : px
@mixin cross($size: 20px, $color: currentColor, $thickness: 1px) {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: $size;
  height: $size;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: calc(($size - $thickness) / 2);
    left: 0;
    right: 0;
    height: $thickness;
    background: $color;
    border-radius: $thickness;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }

  span {
    display: block;
  }

}
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
  border: 0;
  padding: 0;
  background: #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 150ms;
  
  .icon-cross {
    @include cross(30px, #afc6d2, 6px);   
  }
  
  &:hover,
  &:focus {
    transform: rotateZ(90deg);
    background: #444444;
  }

}
// For screen readers.
.visually-hidden {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden;
}
</style>