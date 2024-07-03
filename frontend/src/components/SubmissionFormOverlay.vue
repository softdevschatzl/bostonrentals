<template>
  <div class="submission-form-overlay">
    <form @submit.prevent="handleSubmit">
      <input
    </form>
  </div>
</template>

<script>
export default {
  props: ['listings'],
  data() {
    return {
      creditScore: null,
      hasPets: null,
      isStudent: null,
      primaryContact: null,
    }
  },
  methods: {
    handleSubmit() {
      console.log('Credit Score:', this.creditScore);
      console.log('Has Pets:', this.hasPets);
      console.log('Is Student:', this.isStudent);
      console.log('Primary Contact:', this.primaryContact);
    },
  },
};
</script>

<style scoped>
.submission-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>